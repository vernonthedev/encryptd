#!/usr/bin/env node
/**
 * Dependency-free changelog generator for @vernonthedev/encryptd.
 *
 * Why not `conventional-changelog`? The installed toolchain is internally
 * incompatible (Handlebars-based writer@8 vs new-architecture preset@10), so
 * preset customization silently no-ops. This script reads `git log` directly,
 * parses Conventional Commits (type/scope/subject/body), and renders a grouped
 * Markdown changelog that includes the FULL commit body and the real git author.
 *
 * Usage:
 *   node scripts/generate-changelog.mjs [version]
 *
 * Behavior:
 *   - Generates the section for commits since the most recent git tag
 *     (or the whole history on a first release).
 *   - Prepends that section to CHANGELOG.md (under a single "# Changelog" title).
 *   - Writes the new section on its own to RELEASE_NOTES.md (for the GH Release body).
 */
import { readFile, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';

// ASCII separators are safe: they never appear in commit text.
const FIELD = '\x1f'; // unit separator between fields
const RECORD = '\x1e'; // record separator between commits

// Visible sections, in display order. Types not listed here are hidden.
const SECTIONS = [
  ['feat', 'Features'],
  ['fix', 'Bug Fixes'],
  ['perf', 'Performance Improvements'],
  ['revert', 'Reverts'],
  ['refactor', 'Code Refactoring'],
  ['docs', 'Documentation'],
  ['style', 'Styles'],
  ['test', 'Tests']
];
// Hidden by design: chore, build, ci (release/tooling noise).

function git(args) {
  return execFileSync('git', args, {
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024
  });
}

function parseRepoUrl(pkg) {
  const raw = (pkg.repository && pkg.repository.url) || '';
  const cleaned = raw.replace(/^git\+/, '').replace(/\.git$/, '');
  const match = cleaned.match(/github\.com[/:]([^/]+)\/([^/]+)/i);
  if (!match) {
    return { base: cleaned, owner: null, repo: null };
  }
  return {
    base: `https://github.com/${match[1]}/${match[2]}`,
    owner: match[1],
    repo: match[2]
  };
}

function lastTag() {
  try {
    const tag = git(['describe', '--tags', '--abbrev=0']).trim();
    return tag || null;
  } catch {
    return null;
  }
}

function readCommits(range) {
  const format = ['%H', '%an', '%ae', '%s', '%b'].join(FIELD) + RECORD;
  const args = ['log', `--pretty=format:${format}`];
  if (range) {
    args.push(range);
  }
  const raw = git(args);

  return raw
    .split(RECORD)
    .map((chunk) => chunk.replace(/^\s+/, ''))
    .filter(Boolean)
    .map((record) => {
      const [hash, authorName, authorEmail, subject, ...rest] = record.split(FIELD);
      const body = rest.join(FIELD).trim();
      const header = (subject || '').trim();
      const match = header.match(/^(\w+)(?:\(([^)]+)\))?(!)?:\s*(.+)$/);

      return {
        hash: (hash || '').trim(),
        authorName: (authorName || '').trim(),
        authorEmail: (authorEmail || '').trim(),
        type: match ? match[1].toLowerCase() : null,
        scope: match ? match[2] || null : null,
        breaking: match ? Boolean(match[3]) : false,
        subject: match ? match[4].trim() : header,
        body
      };
    })
    .filter((commit) => commit.hash);
}

function renderCommit(commit, repo) {
  const short = commit.hash.slice(0, 7);
  const link = repo.base
    ? `([${short}](${repo.base}/commit/${commit.hash}))`
    : `(${short})`;
  const scope = commit.scope ? `**${commit.scope}:** ` : '';
  const author = commit.authorName ? ` - by ${commit.authorName}` : '';

  let out = `* ${scope}${commit.subject} ${link}${author}`;

  const body = commit.body.trim();
  if (body) {
    const indented = body
      .split('\n')
      .map((line) => (line.trim() ? `  ${line}` : ''))
      .join('\n');
    out += `\n\n${indented}`;
  }

  return out;
}

function renderSection(version, date, commits, repo) {
  let out = `## ${version} (${date})`;

  const breaking = commits.filter(
    (c) => c.breaking || /BREAKING[ -]CHANGE/.test(c.body)
  );
  if (breaking.length) {
    out += `\n\n### BREAKING CHANGES\n\n`;
    out += breaking.map((c) => renderCommit(c, repo)).join('\n');
  }

  for (const [type, title] of SECTIONS) {
    const list = commits.filter((c) => c.type === type);
    if (!list.length) {
      continue;
    }
    out += `\n\n### ${title}\n\n`;
    out += list.map((c) => renderCommit(c, repo)).join('\n');
  }

  return out.trim();
}

async function main() {
  const pkg = JSON.parse(await readFile('package.json', 'utf8'));
  const version = (process.argv[2] || pkg.version).replace(/^v/, '');
  const repo = parseRepoUrl(pkg);
  const date = new Date().toISOString().slice(0, 10);

  const tag = lastTag();
  const range = tag ? `${tag}..HEAD` : '';
  const commits = readCommits(range);

  const section = renderSection(version, date, commits, repo);

  const title = '# Changelog\n';
  let existing = '';
  try {
    existing = await readFile('CHANGELOG.md', 'utf8');
  } catch {
    existing = '';
  }
  const prior = existing.replace(/^#\s*Changelog\s*/i, '').trim();

  const full = `${title}\n${section}\n${prior ? `\n${prior}\n` : ''}`;
  await writeFile('CHANGELOG.md', full);
  await writeFile('RELEASE_NOTES.md', `${section}\n`);

  console.error(
    `[changelog] v${version}: ${commits.length} commit(s), range: ${range || 'all history'}`
  );
}

main().catch((err) => {
  console.error('[changelog] failed:', err);
  process.exit(1);
});
