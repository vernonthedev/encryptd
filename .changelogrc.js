module.exports = {
  types: [
    { type: 'feat', section: 'Features' },
    { type: 'fix', section: 'Bug Fixes' },
    { type: 'perf', section: 'Performance Improvements' },
    { type: 'refactor', section: 'Code Refactoring' },
    { type: 'docs', section: 'Documentation' },
    { type: 'style', section: 'Styles' },
    { type: 'test', section: 'Tests' },
    { type: 'chore', section: 'Chores', hidden: true },
    { type: 'build', section: 'Build System', hidden: true },
    { type: 'ci', section: 'Continuous Integration', hidden: true }
  ],
  commitGroupsSort: 'title',
  commitsSort: ['scope', 'subject'],
  noteGroupsSort: 'title',
  notesSort: 'compare',
  headerPartial: '# {{version}} ({{date}})\n',
  issueUrlFormat: 'https://github.com/vernonthedev/encryptd/issues/{{id}}',
  commitUrlFormat: 'https://github.com/vernonthedev/encryptd/commit/{{hash}}',
  userUrlFormat: 'https://github.com/{{user}}',
  transform: (commit, context) => {
    // Include commit body in the changelog as "Details" note
    if (commit.body) {
      commit.notes = commit.notes || [];
      commit.notes.push({
        title: 'Details',
        text: commit.body
      });
    }
    
    // Link to author's GitHub profile
    if (commit.author) {
      commit.authorUrl = `https://github.com/${commit.author}`;
    }
    
    return commit;
  }
};