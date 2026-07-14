# Changelog

## 0.0.1-beta.0 (2026-07-14)

### Features

* add manual release workflow with CI gate and GitHub Packages publishing ([2712078](https://github.com/vernonthedev/encryptd/commit/27120784f6f604a86d4c265a2dfc47a21f3545a4)) - by vernonthedev

  - check-ci job: blocks release if latest CI run on main failed
  - version-bump: determines version, generates changelog, creates tag
  - release (matrix): builds 4 platforms, fixes package.json, publishes to GitHub Packages with --tag beta
  - create-release: aggregates all platform .tgz files into single GitHub Release (prerelease)
  - Uses vernonthedev <techjaja2@gmail.com> as author for commits and tags
* add manual release beta workflow with correct structure ([4de615a](https://github.com/vernonthedev/encryptd/commit/4de615a6473215398369e78c889e12f3042d2323)) - by vernonthedev

  - Workflow triggered manually via GitHub UI (workflow_dispatch)
  - CI gate: blocks release if latest CI run failed
  - Version bump: auto-determines semver from conventional commits
  - Matrix builds: 4 platforms (linux x64, macos x64/arm64, windows x64)
  - Publishes beta packages to GitHub Packages with --tag beta
  - Creates single GitHub Release with all platform .tgz artifacts
  - Uses conventional-changelog for full commit body in release notes
  - Author attribution: vernonthedev <techjaja2@gmail.com>
* add changesets + conventional-changelog release setup ([c556fe4](https://github.com/vernonthedev/encryptd/commit/c556fe41409cfa7f1e02ec9c20ce18a60bcaf7c2)) - by vernonthedev

  - Add manual-release workflow triggered via GitHub UI (workflow_dispatch)
    - Generates full CHANGELOG.md from conventional commits (subject + body)
    - Auto-determines version bump from commit types (feat!/feat/fix)
    - Publishes beta releases to GitHub Packages with --tag beta
    - Creates GitHub Release with full changelog as release notes
    - Commits version bump with author vernonthedev <techjaja2@gmail.com>

  - Add conventional-changelog config (.changelogrc.js)
    - Includes full commit body in changelog entries
    - Links commit hashes and authors to GitHub
    - Groups by type: Features, Bug Fixes, Performance, etc.

  - Add changesets config for version management
    - Changelog disabled (handled by conventional-changelog)
    - Base branch: main, access: restricted

  - Add npm scripts: changeset, version, release, changelog, changelog:first

  - Add dev dependencies: @changesets/cli, @changesets/changelog-github, conventional-changelog-cli, conventional-changelog-conventionalcommits
* replace SHA-256 KDF with PBKDF2, remove stubs ([74f64da](https://github.com/vernonthedev/encryptd/commit/74f64dabd3e1296ff0b4149ad49eac8ef1a04c2e)) - by vernonthedev

  Rust:
  - Replace SHA-256 hash with PBKDF2-HMAC-SHA256 (100K iterations)
  - Add random 16B salt per encryption, stored in EnvPayload
  - Extract derive_key() helper used by both encrypt/decrypt

  TypeScript:
  - Remove stub index.d.ts (no fake types)
  - Remove native.ts pass-through (import directly from napi binding)
  - Add salt field to EnvPayload type

  Docs:
  - Update README.md with full install, CLI, and dev guide
  - Add docs/api.md with complete API reference
  - Update How It Works tables for PBKDF2
* **src:** add source directory structure ([dcc31cf](https://github.com/vernonthedev/encryptd/commit/dcc31cf4d47949742acd3fd388831ca76d25123f)) - by vernonthedev

  - Typscript Runtime loader and cli encryptor configurations
* **crypto:** implement core encryption logic and interfaces ([0aa9d54](https://github.com/vernonthedev/encryptd/commit/0aa9d5457a84b4d2f042ed13c20c066628058865)) - by vernonthedev

  Introduce AES-256-GCM encryption constants and integrate type-safe
  interfaces for payload handling.

  - Add encryption constants (ALGORITHM, IV_LENGTH, SALT, etc.) to crypto.ts
  - Implement EncryptedPayload interface in new interfaces directory
  - Revert module system to commonjs in tsconfig.json
  - Clean up package.json metadata and scripts

### Bug Fixes

* reset package.json version to 0.0.1 baseline ([328913c](https://github.com/vernonthedev/encryptd/commit/328913c8e8b0906d2a8b129305aa49f4af8b6749)) - by vernonthedev
* use GITHUB_TOKEN for gh release create (Create GitHub Release) ([6d38b35](https://github.com/vernonthedev/encryptd/commit/6d38b35d8af43594ed5db08104a94a9797b7a8c0)) - by vernonthedev
* stop ignoring RELEASE_NOTES.md so the release commit succeeds ([f34f963](https://github.com/vernonthedev/encryptd/commit/f34f9632ecf896c4b686d1838c4228f8afc8294d)) - by vernonthedev
* reset beta release pipeline to a clean 0.0.1 baseline ([b7b802d](https://github.com/vernonthedev/encryptd/commit/b7b802d2d669541680bb1922f6e2a0875a5c6407)) - by vernonthedev

  - Remove changesets; replace broken conventional-changelog stack (Handlebars
    writer vs new-arch preset incompatibility) with a dependency-free changelog
    generator that renders Conventional Commit sections, full commit bodies, and
    the real git author.
  - Reset versions to 0.0.1 (package.json) / 0.0.1 (Cargo.toml).
  - Rewrite manual-release-beta.yml: fix CI gate (reference ci.yml by name),
    auto commit-driven beta versioning with collision-safe -beta.N counter,
    publish the main package to GitHub Packages (--tag beta), attach per-OS
    built artifacts to the GitHub Release, and drop publishConfig.access:
    restricted which GitHub Packages rejects.
  - Add files whitelist so dist/ and the native binary ship in the package.
* **ci:** remove merge-multiple to prevent artifact overwrite in release job ([06b749c](https://github.com/vernonthedev/encryptd/commit/06b749cb71a2bed7ceaeeb06c0c5ec5ab25c028f)) - by vernonthedev

  When downloading multiple artifacts with the same internal file structure (npm/*.tgz),
  merge-multiple: true causes them to overwrite each other. By removing this option,
  each artifact is extracted to its own subdirectory (named after the artifact),
  allowing all .tgz files to be collected with the glob pattern all-artifacts/**/*.tgz.
* restore Cargo.toml version to 0.5.0 ([8841d15](https://github.com/vernonthedev/encryptd/commit/8841d15c3a47d5fd579108a4eb6d84c12cc880ca)) - by vernonthedev
* restore valid package.json version to 0.5.0-beta.0 ([8936590](https://github.com/vernonthedev/encryptd/commit/8936590b2447d5abb3f4a93e16cd1d08ddf327d4)) - by vernonthedev
* strip pre-release suffix before version arithmetic ([3a91d02](https://github.com/vernonthedev/encryptd/commit/3a91d027b07453e6ee33e7c846aaf2d03d7ef2ff)) - by vernonthedev

  - CURRENT_VERSION may include -beta.0 suffix
  - Strip suffix with  before parsing MAJOR.MINOR.PATCH
  - Fixes 'invalid arithmetic operator' error when PATCH contains -beta.0
* use Node.js for cross-platform package fixing and publishing ([cf645a4](https://github.com/vernonthedev/encryptd/commit/cf645a4e9367b4ea631340eb7e458c1f66d82f76)) - by vernonthedev

  - Replace bash for loops with Node.js scripts for Windows compatibility
  - Fix platform package.json to remove repository field and add publishConfig
  - Publish packages using npm with correct registry and tag
* remove repository field from platform packages for npm publish ([996df84](https://github.com/vernonthedev/encryptd/commit/996df84e3e1c0a102768921d9e5c178bd2e08847)) - by vernonthedev

  - napi pre-publish includes repository field from root package.json
  - npm tries to use git SSH instead of registry URL when repository field exists
  - Fix by stripping repository field and adding publishConfig to each platform package
* restore valid package.json version to 0.3.0-beta.0 ([309cef0](https://github.com/vernonthedev/encryptd/commit/309cef0ee77916e38930226a67fa76aff9b2a102)) - by vernonthedev
* use base version for Cargo.toml (Cargo doesn't support pre-release suffixes) ([89ff70d](https://github.com/vernonthedev/encryptd/commit/89ff70d2374b0ba386243540f8b00900447c92fc)) - by vernonthedev

  - Update workflow to strip -beta.0 suffix when updating Cargo.toml
  - Fix Cargo.toml version to valid semver (0.3.0)
  - package.json keeps full version with -beta.0 for npm
* update package.json for GitHub Packages publishing ([bf0e311](https://github.com/vernonthedev/encryptd/commit/bf0e311f5ca2b4668d078056c801c5ba5344abc0)) - by vernonthedev

  - Change repository URL from git:// to https:// to avoid git protocol issues during npm publish
  - Add access: restricted to publishConfig for scoped package on GitHub Packages
* add --no-gh-release flag to napi pre-publish ([ed69190](https://github.com/vernonthedev/encryptd/commit/ed69190f6186fe0c6c75cb52cd0cbb3f5040aedb)) - by vernonthedev

  - napi pre-publish was trying to create GitHub release but we handle that separately
  - Adding --no-gh-release flag skips the built-in GH release creation
* correct manual-release.yml indentation and structure ([90b5d52](https://github.com/vernonthedev/encryptd/commit/90b5d527122f07b8f702102495c2343d51b2608c)) - by vernonthedev

  - Fixed indentation issues in version-bump job (commit, tag, push steps)
  - Fixed indentation in release job (checkout step)
  - All steps now properly aligned at correct indentation level
  - Workflow structure now valid YAML for GitHub Actions
* **ci:** fix workflow indentation in version-bump job ([3aa0939](https://github.com/vernonthedev/encryptd/commit/3aa093955e9811fcf7362361f03c104fefb70cf4)) - by vernonthedev
* **ci:** fix workflow indentation and permissions ([2ccb6e5](https://github.com/vernonthedev/encryptd/commit/2ccb6e52b650770de002be219125cb9fa24f14a7)) - by vernonthedev
* **ci:** tag version bump and checkout tag in release jobs to fix napi pre-publish ([7008d01](https://github.com/vernonthedev/encryptd/commit/7008d01ded3cc1d9911a51a70100e972858cb28b)) - by vernonthedev
* **ci:** add missing check-ci job and fix workflow ID for CI gate ([49b60a1](https://github.com/vernonthedev/encryptd/commit/49b60a1df1c31d4e7058ee327f0511123b91c7a6)) - by vernonthedev
* update manual-release workflow with proper artifact handling ([0b2bbaa](https://github.com/vernonthedev/encryptd/commit/0b2bbaa852e334046bd42c4077aed2b3f74b6ad5)) - by vernonthedev

  - Split into 3 jobs: check-ci, release (matrix), create-release
  - Each platform job uploads its npm package as artifact
  - create-release downloads all artifacts and attaches to single GitHub Release
  - Uses softprops/action-gh-release files: all-artifacts/**/*.tgz
  - Version output passed via needs.release.outputs.new_version
* update manual-release workflow with correct napi publish command ([ecd3186](https://github.com/vernonthedev/encryptd/commit/ecd3186e78057e03da732c45c07e45742341d26e)) - by vernonthedev

  - Replace 'napi publish' (doesn't exist) with 'napi pre-publish' + 'npm publish'
  - Use matrix builds for all 4 platforms (linux x64, macos x64, macos arm64, windows x64)
  - Only ubuntu-latest handles version bump, changelog, commit, release creation, push
  - Add check-ci job that runs first and blocks release if CI failed
  - Release jobs depend on check-ci (needs: check-ci)
* **rust:** add hand-written index.js to load native binary ([261012a](https://github.com/vernonthedev/encryptd/commit/261012a380eba6ea9ffd370eccaf656ba809cdcb)) - by vernonthedev

  napi-rs CLI 3.x with --platform flag generates only index.d.ts and
  the .node binary, not index.js. Write our own index.js that maps
  platform+arch to the correct binary filename and requires it.

  Remove rust/index.js from .gitignore (it's hand-written, not generated).
* **ci:** upgrade actions to @v5, add debug step, log require errors ([23fa281](https://github.com/vernonthedev/encryptd/commit/23fa281497bf78844ee713cea4265988403562d5)) - by vernonthedev

  - Upgrade actions/checkout and actions/setup-node to @v5 for
    Node.js 24 compatibility (silences node20 deprecation warnings)
  - Add debug step listing generated files after napi build
  - Test now logs both require error messages via console.error for
    visibility in CI logs
* **ci:** restore cargoCwd, point imports to rust/, ignore napi artifacts ([5571c1e](https://github.com/vernonthedev/encryptd/commit/5571c1ebbb60a6a0d666adc0b613522e82757338)) - by vernonthedev

  With cargoCwd: 'rust', napi build outputs index.js/d.ts and .node
  binaries into rust/ directory. Reverted cargoCwd removal and fixed
  all import paths to look in rust/ first (native.ts, test).

  Runners reverted to latest (macos-latest now = macOS 26, past the
  migration date, no more warning). Linux deps condition changed from
  matrix.os check to runner.os check so it works with ubuntu-latest.

  Added rust/*.node, rust/index.js, rust/index.d.ts to .gitignore.
* **ci:** remove cargoCwd, add manifest-path to publish, pin runner versions ([7f0873c](https://github.com/vernonthedev/encryptd/commit/7f0873cdf4242517ae09892c691ca8e743d6aa3c)) - by vernonthedev

  Root cause of skipped tests: cargoCwd: 'rust' made napi build
  output files to rust/ instead of root, so require('../index') in
  both native.ts and test/main.test.ts failed silently.

  - Remove cargoCwd so napi build outputs to root (npm package root)
  - Add --manifest-path rust/Cargo.toml to publish CI commands
  - native.ts fallback: try ../index then ../rust/index
  - Pin runner images: ubuntu-24.04, macos-14, windows-2022 to
    silence deprecation warnings for macos-latest and node20 actions
* **ts:** add native.ts bridge with inline types, import from ./native ([622d3a7](https://github.com/vernonthedev/encryptd/commit/622d3a7b83ccea37a5fe478088cde10148ef2447)) - by vernonthedev

  Replace direct import from napi-generated ../index with a proper
  bridge module. Declares EnvPayload, encryptEnv, and decryptEnv
  types inline (matching Rust signatures) and loads the binding at
  runtime via require('../index'). This decouples tsc from needing
  the napi-generated index.d.ts at compile time.
* **rust:** add missing AeadCore import for generate_nonce ([d11f087](https://github.com/vernonthedev/encryptd/commit/d11f0877d2787daf8344996b0cb435450ab123c8)) - by vernonthedev
* **ci:** remove optionalDependencies from package.json ([48bc19a](https://github.com/vernonthedev/encryptd/commit/48bc19a383868e14f23b15381af290f316595707)) - by vernonthedev

  pnpm --frozen-lockfile fails because these unpublished platform
  packages can't be resolved and get silently dropped from the
  lockfile. They belong only in the published npm package —
  napi publish CLI injects them during release.
* **ci:** add pnpm install step, use pnpm scripts instead of npx ([99802fe](https://github.com/vernonthedev/encryptd/commit/99802fe0fc4f51f87e64fbfd5951fe1d2d01a3ae)) - by vernonthedev

  CI was failing because dependencies were never installed. Added pnpm/action-setup, pnpm install --frozen-lockfile, and replaced all npx calls with pnpm equivalents.
* upgrade native.ts to use proper napi-rs imports, fix test types ([5b1c4b2](https://github.com/vernonthedev/encryptd/commit/5b1c4b21ae460956f71e8efca552b5108f70496d)) - by vernonthedev

  Both ponytail trade-offs resolved:

  src/native.ts — replaced require() manual type assertion with proper
  re-exports from the napi-rs generated binding (../index). TypeScript now
  gets types from the generated index.d.ts instead of a hand-written cast.
  Compiles to the same require('../index') at runtime.

  test/main.test.ts — replaced manual type interface with
  typeof import('../index'). Types now come from the generated binding
  while require() with try/catch preserves the graceful skip behavior
  for environments without the native binary.
* resolve napi build path, .npmrc auth, and rename test file ([bbba9f7](https://github.com/vernonthedev/encryptd/commit/bbba9f713974d6c4b801a5bd54e1ba28ec710412)) - by vernonthedev

  Bugs fixed:
  - napi-rs CLI could not find Cargo.toml (looked at root only). Added
    --manifest-path flag and cargoCwd config to point at rust/
  - Cargo.toml was missing [package] and [lib] sections — added them.
    Without [package], cargo treats it as a virtual manifest and rejects
    [dependencies]
  - napi config deprecated: name -> binaryName, triples -> targets.
    Updated to suppress deprecation warnings
  - .npmrc had  which pnpm refuses to expand in project
    .npmrc (security). Removed the auth line — CI uses NODE_AUTH_TOKEN
    env var via setup-node action; local dev uses global ~/.npmrc
  - test file renamed basic.test.ts -> main.test.ts for clarity
  - rust/target/ added to .gitignore (was leaking build artifacts)
* resolve critical NAPI binding, hasOwnProperty, and build bugs ([0c6036b](https://github.com/vernonthedev/encryptd/commit/0c6036b24d5ced9f5b2266e0c3aa9d46c02246d3)) - by vernonthedev

  Fix four critical bugs and restructure the TS/CI architecture:

  Bugs fixed:
  - Circular self-import in src/index.ts:3 — split into native.ts (NAPI
    binding loader via require) and types.ts (shared types), eliminating
    the self-import that would crash at runtime
  - Missing sha2 crate in Cargo.toml — Rust lib.rs imports sha2 but
    it was never declared as a dependency; build would fail
  - process.env.hasOwnProperty throws — Node creates process.env via
    Object.create(null) so hasOwnProperty is undefined; replaced with
    Object.hasOwn()
  - decrypt_env called but never imported — config() called the
    snake_case version which was never imported; now uses camelCase
    decryptEnv from the native binding

  Architecture:
  - Add napi-build script and wire into prepublishOnly so the Rust
    native binary is built before publish
  - Point main/types/bin to dist/ (compiled JS) instead of raw TS source
  - Add format version field to encrypted payload for future migration
  - Add decrypt subcommand to CLI for verification workflow
  - Match optionalDependencies to actual CI build targets (dropped
    linux-x64-musl, added darwin-x64)

  CI:
  - Add test job running on push/PR (not just release) with vitest
  - Build both darwin-x64 and darwin-arm64 on macos-latest via Rust
    cross-compilation
  - Gate publish jobs behind test + release event

  Tests:
  - Add 8 vitest round-trip tests covering encrypt/decrypt, edge cases
    (empty values, special chars, wrong passphrase), and IV uniqueness

### Code Refactoring

* **config:** update typescript module resolution to NodeNext ([c54114b](https://github.com/vernonthedev/encryptd/commit/c54114b9204599b7d2075435fef04bc33ec53874)) - by vernonthedev

  Adjust tsconfig.json to use NodeNext for both module and moduleResolution
  to ensure compatibility with modern Node.js ESM/CJS interoperability.
  Added node types and initialized the src directory structure.

  - Change module system to NodeNext
  - Update module resolution strategy
  - Add node type definitions
  - Initialize source directory

### Documentation

* **ci:** update CI workflow badge to use ci.yml ([e3efb05](https://github.com/vernonthedev/encryptd/commit/e3efb056bf2f4c06f4a9784b8bf480cb5154c0f8)) - by vernonthedev

  - Ensured our shieldcn status badges use our new ci.yml workflow setup
    for statuses.
* properly updated readme guidelines and usage guidelines in the /docs directory ([37c57be](https://github.com/vernonthedev/encryptd/commit/37c57be2b5334f131fb91a8d2faf205befcb0ef7)) - by vernonthedev

### Styles

* add [SrcIndex] and [RustLib] prefixes to all errors and logs ([cf4ed27](https://github.com/vernonthedev/encryptd/commit/cf4ed276bf74d43a02fd4df72c35f98985260b24)) - by vernonthedev

  Every error throw and console.log in the project now starts with a
  [DirFile] prefix so the source location is immediately visible:

  - [SrcIndex] for src/index.ts (config + CLI)
  - [RustLib] for rust/src/lib.rs (native encrypt/decrypt)

  The Rust file already had [RustLib] on the main encrypt/decrypt
  errors. Added it to the hex decode and UTF-8 conversion errors
  that were previously bare.

## 0.0.1-beta.0 (2026-07-14)

### Features

* add manual release workflow with CI gate and GitHub Packages publishing ([2712078](https://github.com/vernonthedev/encryptd/commit/27120784f6f604a86d4c265a2dfc47a21f3545a4)) - by vernonthedev

  - check-ci job: blocks release if latest CI run on main failed
  - version-bump: determines version, generates changelog, creates tag
  - release (matrix): builds 4 platforms, fixes package.json, publishes to GitHub Packages with --tag beta
  - create-release: aggregates all platform .tgz files into single GitHub Release (prerelease)
  - Uses vernonthedev <techjaja2@gmail.com> as author for commits and tags
* add manual release beta workflow with correct structure ([4de615a](https://github.com/vernonthedev/encryptd/commit/4de615a6473215398369e78c889e12f3042d2323)) - by vernonthedev

  - Workflow triggered manually via GitHub UI (workflow_dispatch)
  - CI gate: blocks release if latest CI run failed
  - Version bump: auto-determines semver from conventional commits
  - Matrix builds: 4 platforms (linux x64, macos x64/arm64, windows x64)
  - Publishes beta packages to GitHub Packages with --tag beta
  - Creates single GitHub Release with all platform .tgz artifacts
  - Uses conventional-changelog for full commit body in release notes
  - Author attribution: vernonthedev <techjaja2@gmail.com>
* add changesets + conventional-changelog release setup ([c556fe4](https://github.com/vernonthedev/encryptd/commit/c556fe41409cfa7f1e02ec9c20ce18a60bcaf7c2)) - by vernonthedev

  - Add manual-release workflow triggered via GitHub UI (workflow_dispatch)
    - Generates full CHANGELOG.md from conventional commits (subject + body)
    - Auto-determines version bump from commit types (feat!/feat/fix)
    - Publishes beta releases to GitHub Packages with --tag beta
    - Creates GitHub Release with full changelog as release notes
    - Commits version bump with author vernonthedev <techjaja2@gmail.com>

  - Add conventional-changelog config (.changelogrc.js)
    - Includes full commit body in changelog entries
    - Links commit hashes and authors to GitHub
    - Groups by type: Features, Bug Fixes, Performance, etc.

  - Add changesets config for version management
    - Changelog disabled (handled by conventional-changelog)
    - Base branch: main, access: restricted

  - Add npm scripts: changeset, version, release, changelog, changelog:first

  - Add dev dependencies: @changesets/cli, @changesets/changelog-github, conventional-changelog-cli, conventional-changelog-conventionalcommits
* replace SHA-256 KDF with PBKDF2, remove stubs ([74f64da](https://github.com/vernonthedev/encryptd/commit/74f64dabd3e1296ff0b4149ad49eac8ef1a04c2e)) - by vernonthedev

  Rust:
  - Replace SHA-256 hash with PBKDF2-HMAC-SHA256 (100K iterations)
  - Add random 16B salt per encryption, stored in EnvPayload
  - Extract derive_key() helper used by both encrypt/decrypt

  TypeScript:
  - Remove stub index.d.ts (no fake types)
  - Remove native.ts pass-through (import directly from napi binding)
  - Add salt field to EnvPayload type

  Docs:
  - Update README.md with full install, CLI, and dev guide
  - Add docs/api.md with complete API reference
  - Update How It Works tables for PBKDF2
* **src:** add source directory structure ([dcc31cf](https://github.com/vernonthedev/encryptd/commit/dcc31cf4d47949742acd3fd388831ca76d25123f)) - by vernonthedev

  - Typscript Runtime loader and cli encryptor configurations
* **crypto:** implement core encryption logic and interfaces ([0aa9d54](https://github.com/vernonthedev/encryptd/commit/0aa9d5457a84b4d2f042ed13c20c066628058865)) - by vernonthedev

  Introduce AES-256-GCM encryption constants and integrate type-safe
  interfaces for payload handling.

  - Add encryption constants (ALGORITHM, IV_LENGTH, SALT, etc.) to crypto.ts
  - Implement EncryptedPayload interface in new interfaces directory
  - Revert module system to commonjs in tsconfig.json
  - Clean up package.json metadata and scripts

### Bug Fixes

* stop ignoring RELEASE_NOTES.md so the release commit succeeds ([f34f963](https://github.com/vernonthedev/encryptd/commit/f34f9632ecf896c4b686d1838c4228f8afc8294d)) - by vernonthedev
* reset beta release pipeline to a clean 0.0.1 baseline ([b7b802d](https://github.com/vernonthedev/encryptd/commit/b7b802d2d669541680bb1922f6e2a0875a5c6407)) - by vernonthedev

  - Remove changesets; replace broken conventional-changelog stack (Handlebars
    writer vs new-arch preset incompatibility) with a dependency-free changelog
    generator that renders Conventional Commit sections, full commit bodies, and
    the real git author.
  - Reset versions to 0.0.1 (package.json) / 0.0.1 (Cargo.toml).
  - Rewrite manual-release-beta.yml: fix CI gate (reference ci.yml by name),
    auto commit-driven beta versioning with collision-safe -beta.N counter,
    publish the main package to GitHub Packages (--tag beta), attach per-OS
    built artifacts to the GitHub Release, and drop publishConfig.access:
    restricted which GitHub Packages rejects.
  - Add files whitelist so dist/ and the native binary ship in the package.
* **ci:** remove merge-multiple to prevent artifact overwrite in release job ([06b749c](https://github.com/vernonthedev/encryptd/commit/06b749cb71a2bed7ceaeeb06c0c5ec5ab25c028f)) - by vernonthedev

  When downloading multiple artifacts with the same internal file structure (npm/*.tgz),
  merge-multiple: true causes them to overwrite each other. By removing this option,
  each artifact is extracted to its own subdirectory (named after the artifact),
  allowing all .tgz files to be collected with the glob pattern all-artifacts/**/*.tgz.
* restore Cargo.toml version to 0.5.0 ([8841d15](https://github.com/vernonthedev/encryptd/commit/8841d15c3a47d5fd579108a4eb6d84c12cc880ca)) - by vernonthedev
* restore valid package.json version to 0.5.0-beta.0 ([8936590](https://github.com/vernonthedev/encryptd/commit/8936590b2447d5abb3f4a93e16cd1d08ddf327d4)) - by vernonthedev
* strip pre-release suffix before version arithmetic ([3a91d02](https://github.com/vernonthedev/encryptd/commit/3a91d027b07453e6ee33e7c846aaf2d03d7ef2ff)) - by vernonthedev

  - CURRENT_VERSION may include -beta.0 suffix
  - Strip suffix with  before parsing MAJOR.MINOR.PATCH
  - Fixes 'invalid arithmetic operator' error when PATCH contains -beta.0
* use Node.js for cross-platform package fixing and publishing ([cf645a4](https://github.com/vernonthedev/encryptd/commit/cf645a4e9367b4ea631340eb7e458c1f66d82f76)) - by vernonthedev

  - Replace bash for loops with Node.js scripts for Windows compatibility
  - Fix platform package.json to remove repository field and add publishConfig
  - Publish packages using npm with correct registry and tag
* remove repository field from platform packages for npm publish ([996df84](https://github.com/vernonthedev/encryptd/commit/996df84e3e1c0a102768921d9e5c178bd2e08847)) - by vernonthedev

  - napi pre-publish includes repository field from root package.json
  - npm tries to use git SSH instead of registry URL when repository field exists
  - Fix by stripping repository field and adding publishConfig to each platform package
* restore valid package.json version to 0.3.0-beta.0 ([309cef0](https://github.com/vernonthedev/encryptd/commit/309cef0ee77916e38930226a67fa76aff9b2a102)) - by vernonthedev
* use base version for Cargo.toml (Cargo doesn't support pre-release suffixes) ([89ff70d](https://github.com/vernonthedev/encryptd/commit/89ff70d2374b0ba386243540f8b00900447c92fc)) - by vernonthedev

  - Update workflow to strip -beta.0 suffix when updating Cargo.toml
  - Fix Cargo.toml version to valid semver (0.3.0)
  - package.json keeps full version with -beta.0 for npm
* update package.json for GitHub Packages publishing ([bf0e311](https://github.com/vernonthedev/encryptd/commit/bf0e311f5ca2b4668d078056c801c5ba5344abc0)) - by vernonthedev

  - Change repository URL from git:// to https:// to avoid git protocol issues during npm publish
  - Add access: restricted to publishConfig for scoped package on GitHub Packages
* add --no-gh-release flag to napi pre-publish ([ed69190](https://github.com/vernonthedev/encryptd/commit/ed69190f6186fe0c6c75cb52cd0cbb3f5040aedb)) - by vernonthedev

  - napi pre-publish was trying to create GitHub release but we handle that separately
  - Adding --no-gh-release flag skips the built-in GH release creation
* correct manual-release.yml indentation and structure ([90b5d52](https://github.com/vernonthedev/encryptd/commit/90b5d527122f07b8f702102495c2343d51b2608c)) - by vernonthedev

  - Fixed indentation issues in version-bump job (commit, tag, push steps)
  - Fixed indentation in release job (checkout step)
  - All steps now properly aligned at correct indentation level
  - Workflow structure now valid YAML for GitHub Actions
* **ci:** fix workflow indentation in version-bump job ([3aa0939](https://github.com/vernonthedev/encryptd/commit/3aa093955e9811fcf7362361f03c104fefb70cf4)) - by vernonthedev
* **ci:** fix workflow indentation and permissions ([2ccb6e5](https://github.com/vernonthedev/encryptd/commit/2ccb6e52b650770de002be219125cb9fa24f14a7)) - by vernonthedev
* **ci:** tag version bump and checkout tag in release jobs to fix napi pre-publish ([7008d01](https://github.com/vernonthedev/encryptd/commit/7008d01ded3cc1d9911a51a70100e972858cb28b)) - by vernonthedev
* **ci:** add missing check-ci job and fix workflow ID for CI gate ([49b60a1](https://github.com/vernonthedev/encryptd/commit/49b60a1df1c31d4e7058ee327f0511123b91c7a6)) - by vernonthedev
* update manual-release workflow with proper artifact handling ([0b2bbaa](https://github.com/vernonthedev/encryptd/commit/0b2bbaa852e334046bd42c4077aed2b3f74b6ad5)) - by vernonthedev

  - Split into 3 jobs: check-ci, release (matrix), create-release
  - Each platform job uploads its npm package as artifact
  - create-release downloads all artifacts and attaches to single GitHub Release
  - Uses softprops/action-gh-release files: all-artifacts/**/*.tgz
  - Version output passed via needs.release.outputs.new_version
* update manual-release workflow with correct napi publish command ([ecd3186](https://github.com/vernonthedev/encryptd/commit/ecd3186e78057e03da732c45c07e45742341d26e)) - by vernonthedev

  - Replace 'napi publish' (doesn't exist) with 'napi pre-publish' + 'npm publish'
  - Use matrix builds for all 4 platforms (linux x64, macos x64, macos arm64, windows x64)
  - Only ubuntu-latest handles version bump, changelog, commit, release creation, push
  - Add check-ci job that runs first and blocks release if CI failed
  - Release jobs depend on check-ci (needs: check-ci)
* **rust:** add hand-written index.js to load native binary ([261012a](https://github.com/vernonthedev/encryptd/commit/261012a380eba6ea9ffd370eccaf656ba809cdcb)) - by vernonthedev

  napi-rs CLI 3.x with --platform flag generates only index.d.ts and
  the .node binary, not index.js. Write our own index.js that maps
  platform+arch to the correct binary filename and requires it.

  Remove rust/index.js from .gitignore (it's hand-written, not generated).
* **ci:** upgrade actions to @v5, add debug step, log require errors ([23fa281](https://github.com/vernonthedev/encryptd/commit/23fa281497bf78844ee713cea4265988403562d5)) - by vernonthedev

  - Upgrade actions/checkout and actions/setup-node to @v5 for
    Node.js 24 compatibility (silences node20 deprecation warnings)
  - Add debug step listing generated files after napi build
  - Test now logs both require error messages via console.error for
    visibility in CI logs
* **ci:** restore cargoCwd, point imports to rust/, ignore napi artifacts ([5571c1e](https://github.com/vernonthedev/encryptd/commit/5571c1ebbb60a6a0d666adc0b613522e82757338)) - by vernonthedev

  With cargoCwd: 'rust', napi build outputs index.js/d.ts and .node
  binaries into rust/ directory. Reverted cargoCwd removal and fixed
  all import paths to look in rust/ first (native.ts, test).

  Runners reverted to latest (macos-latest now = macOS 26, past the
  migration date, no more warning). Linux deps condition changed from
  matrix.os check to runner.os check so it works with ubuntu-latest.

  Added rust/*.node, rust/index.js, rust/index.d.ts to .gitignore.
* **ci:** remove cargoCwd, add manifest-path to publish, pin runner versions ([7f0873c](https://github.com/vernonthedev/encryptd/commit/7f0873cdf4242517ae09892c691ca8e743d6aa3c)) - by vernonthedev

  Root cause of skipped tests: cargoCwd: 'rust' made napi build
  output files to rust/ instead of root, so require('../index') in
  both native.ts and test/main.test.ts failed silently.

  - Remove cargoCwd so napi build outputs to root (npm package root)
  - Add --manifest-path rust/Cargo.toml to publish CI commands
  - native.ts fallback: try ../index then ../rust/index
  - Pin runner images: ubuntu-24.04, macos-14, windows-2022 to
    silence deprecation warnings for macos-latest and node20 actions
* **ts:** add native.ts bridge with inline types, import from ./native ([622d3a7](https://github.com/vernonthedev/encryptd/commit/622d3a7b83ccea37a5fe478088cde10148ef2447)) - by vernonthedev

  Replace direct import from napi-generated ../index with a proper
  bridge module. Declares EnvPayload, encryptEnv, and decryptEnv
  types inline (matching Rust signatures) and loads the binding at
  runtime via require('../index'). This decouples tsc from needing
  the napi-generated index.d.ts at compile time.
* **rust:** add missing AeadCore import for generate_nonce ([d11f087](https://github.com/vernonthedev/encryptd/commit/d11f0877d2787daf8344996b0cb435450ab123c8)) - by vernonthedev
* **ci:** remove optionalDependencies from package.json ([48bc19a](https://github.com/vernonthedev/encryptd/commit/48bc19a383868e14f23b15381af290f316595707)) - by vernonthedev

  pnpm --frozen-lockfile fails because these unpublished platform
  packages can't be resolved and get silently dropped from the
  lockfile. They belong only in the published npm package —
  napi publish CLI injects them during release.
* **ci:** add pnpm install step, use pnpm scripts instead of npx ([99802fe](https://github.com/vernonthedev/encryptd/commit/99802fe0fc4f51f87e64fbfd5951fe1d2d01a3ae)) - by vernonthedev

  CI was failing because dependencies were never installed. Added pnpm/action-setup, pnpm install --frozen-lockfile, and replaced all npx calls with pnpm equivalents.
* upgrade native.ts to use proper napi-rs imports, fix test types ([5b1c4b2](https://github.com/vernonthedev/encryptd/commit/5b1c4b21ae460956f71e8efca552b5108f70496d)) - by vernonthedev

  Both ponytail trade-offs resolved:

  src/native.ts — replaced require() manual type assertion with proper
  re-exports from the napi-rs generated binding (../index). TypeScript now
  gets types from the generated index.d.ts instead of a hand-written cast.
  Compiles to the same require('../index') at runtime.

  test/main.test.ts — replaced manual type interface with
  typeof import('../index'). Types now come from the generated binding
  while require() with try/catch preserves the graceful skip behavior
  for environments without the native binary.
* resolve napi build path, .npmrc auth, and rename test file ([bbba9f7](https://github.com/vernonthedev/encryptd/commit/bbba9f713974d6c4b801a5bd54e1ba28ec710412)) - by vernonthedev

  Bugs fixed:
  - napi-rs CLI could not find Cargo.toml (looked at root only). Added
    --manifest-path flag and cargoCwd config to point at rust/
  - Cargo.toml was missing [package] and [lib] sections — added them.
    Without [package], cargo treats it as a virtual manifest and rejects
    [dependencies]
  - napi config deprecated: name -> binaryName, triples -> targets.
    Updated to suppress deprecation warnings
  - .npmrc had  which pnpm refuses to expand in project
    .npmrc (security). Removed the auth line — CI uses NODE_AUTH_TOKEN
    env var via setup-node action; local dev uses global ~/.npmrc
  - test file renamed basic.test.ts -> main.test.ts for clarity
  - rust/target/ added to .gitignore (was leaking build artifacts)
* resolve critical NAPI binding, hasOwnProperty, and build bugs ([0c6036b](https://github.com/vernonthedev/encryptd/commit/0c6036b24d5ced9f5b2266e0c3aa9d46c02246d3)) - by vernonthedev

  Fix four critical bugs and restructure the TS/CI architecture:

  Bugs fixed:
  - Circular self-import in src/index.ts:3 — split into native.ts (NAPI
    binding loader via require) and types.ts (shared types), eliminating
    the self-import that would crash at runtime
  - Missing sha2 crate in Cargo.toml — Rust lib.rs imports sha2 but
    it was never declared as a dependency; build would fail
  - process.env.hasOwnProperty throws — Node creates process.env via
    Object.create(null) so hasOwnProperty is undefined; replaced with
    Object.hasOwn()
  - decrypt_env called but never imported — config() called the
    snake_case version which was never imported; now uses camelCase
    decryptEnv from the native binding

  Architecture:
  - Add napi-build script and wire into prepublishOnly so the Rust
    native binary is built before publish
  - Point main/types/bin to dist/ (compiled JS) instead of raw TS source
  - Add format version field to encrypted payload for future migration
  - Add decrypt subcommand to CLI for verification workflow
  - Match optionalDependencies to actual CI build targets (dropped
    linux-x64-musl, added darwin-x64)

  CI:
  - Add test job running on push/PR (not just release) with vitest
  - Build both darwin-x64 and darwin-arm64 on macos-latest via Rust
    cross-compilation
  - Gate publish jobs behind test + release event

  Tests:
  - Add 8 vitest round-trip tests covering encrypt/decrypt, edge cases
    (empty values, special chars, wrong passphrase), and IV uniqueness

### Code Refactoring

* **config:** update typescript module resolution to NodeNext ([c54114b](https://github.com/vernonthedev/encryptd/commit/c54114b9204599b7d2075435fef04bc33ec53874)) - by vernonthedev

  Adjust tsconfig.json to use NodeNext for both module and moduleResolution
  to ensure compatibility with modern Node.js ESM/CJS interoperability.
  Added node types and initialized the src directory structure.

  - Change module system to NodeNext
  - Update module resolution strategy
  - Add node type definitions
  - Initialize source directory

### Documentation

* **ci:** update CI workflow badge to use ci.yml ([e3efb05](https://github.com/vernonthedev/encryptd/commit/e3efb056bf2f4c06f4a9784b8bf480cb5154c0f8)) - by vernonthedev

  - Ensured our shieldcn status badges use our new ci.yml workflow setup
    for statuses.
* properly updated readme guidelines and usage guidelines in the /docs directory ([37c57be](https://github.com/vernonthedev/encryptd/commit/37c57be2b5334f131fb91a8d2faf205befcb0ef7)) - by vernonthedev

### Styles

* add [SrcIndex] and [RustLib] prefixes to all errors and logs ([cf4ed27](https://github.com/vernonthedev/encryptd/commit/cf4ed276bf74d43a02fd4df72c35f98985260b24)) - by vernonthedev

  Every error throw and console.log in the project now starts with a
  [DirFile] prefix so the source location is immediately visible:

  - [SrcIndex] for src/index.ts (config + CLI)
  - [RustLib] for rust/src/lib.rs (native encrypt/decrypt)

  The Rust file already had [RustLib] on the main encrypt/decrypt
  errors. Added it to the hex decode and UTF-8 conversion errors
  that were previously bare.

## 0.0.1-beta.0 (2026-07-14)

### Features

* add manual release workflow with CI gate and GitHub Packages publishing ([2712078](https://github.com/vernonthedev/encryptd/commit/27120784f6f604a86d4c265a2dfc47a21f3545a4)) - by vernonthedev

  - check-ci job: blocks release if latest CI run on main failed
  - version-bump: determines version, generates changelog, creates tag
  - release (matrix): builds 4 platforms, fixes package.json, publishes to GitHub Packages with --tag beta
  - create-release: aggregates all platform .tgz files into single GitHub Release (prerelease)
  - Uses vernonthedev <techjaja2@gmail.com> as author for commits and tags
* add manual release beta workflow with correct structure ([4de615a](https://github.com/vernonthedev/encryptd/commit/4de615a6473215398369e78c889e12f3042d2323)) - by vernonthedev

  - Workflow triggered manually via GitHub UI (workflow_dispatch)
  - CI gate: blocks release if latest CI run failed
  - Version bump: auto-determines semver from conventional commits
  - Matrix builds: 4 platforms (linux x64, macos x64/arm64, windows x64)
  - Publishes beta packages to GitHub Packages with --tag beta
  - Creates single GitHub Release with all platform .tgz artifacts
  - Uses conventional-changelog for full commit body in release notes
  - Author attribution: vernonthedev <techjaja2@gmail.com>
* add changesets + conventional-changelog release setup ([c556fe4](https://github.com/vernonthedev/encryptd/commit/c556fe41409cfa7f1e02ec9c20ce18a60bcaf7c2)) - by vernonthedev

  - Add manual-release workflow triggered via GitHub UI (workflow_dispatch)
    - Generates full CHANGELOG.md from conventional commits (subject + body)
    - Auto-determines version bump from commit types (feat!/feat/fix)
    - Publishes beta releases to GitHub Packages with --tag beta
    - Creates GitHub Release with full changelog as release notes
    - Commits version bump with author vernonthedev <techjaja2@gmail.com>

  - Add conventional-changelog config (.changelogrc.js)
    - Includes full commit body in changelog entries
    - Links commit hashes and authors to GitHub
    - Groups by type: Features, Bug Fixes, Performance, etc.

  - Add changesets config for version management
    - Changelog disabled (handled by conventional-changelog)
    - Base branch: main, access: restricted

  - Add npm scripts: changeset, version, release, changelog, changelog:first

  - Add dev dependencies: @changesets/cli, @changesets/changelog-github, conventional-changelog-cli, conventional-changelog-conventionalcommits
* replace SHA-256 KDF with PBKDF2, remove stubs ([74f64da](https://github.com/vernonthedev/encryptd/commit/74f64dabd3e1296ff0b4149ad49eac8ef1a04c2e)) - by vernonthedev

  Rust:
  - Replace SHA-256 hash with PBKDF2-HMAC-SHA256 (100K iterations)
  - Add random 16B salt per encryption, stored in EnvPayload
  - Extract derive_key() helper used by both encrypt/decrypt

  TypeScript:
  - Remove stub index.d.ts (no fake types)
  - Remove native.ts pass-through (import directly from napi binding)
  - Add salt field to EnvPayload type

  Docs:
  - Update README.md with full install, CLI, and dev guide
  - Add docs/api.md with complete API reference
  - Update How It Works tables for PBKDF2
* **src:** add source directory structure ([dcc31cf](https://github.com/vernonthedev/encryptd/commit/dcc31cf4d47949742acd3fd388831ca76d25123f)) - by vernonthedev

  - Typscript Runtime loader and cli encryptor configurations
* **crypto:** implement core encryption logic and interfaces ([0aa9d54](https://github.com/vernonthedev/encryptd/commit/0aa9d5457a84b4d2f042ed13c20c066628058865)) - by vernonthedev

  Introduce AES-256-GCM encryption constants and integrate type-safe
  interfaces for payload handling.

  - Add encryption constants (ALGORITHM, IV_LENGTH, SALT, etc.) to crypto.ts
  - Implement EncryptedPayload interface in new interfaces directory
  - Revert module system to commonjs in tsconfig.json
  - Clean up package.json metadata and scripts

### Bug Fixes

* **ci:** remove merge-multiple to prevent artifact overwrite in release job ([06b749c](https://github.com/vernonthedev/encryptd/commit/06b749cb71a2bed7ceaeeb06c0c5ec5ab25c028f)) - by vernonthedev

  When downloading multiple artifacts with the same internal file structure (npm/*.tgz),
  merge-multiple: true causes them to overwrite each other. By removing this option,
  each artifact is extracted to its own subdirectory (named after the artifact),
  allowing all .tgz files to be collected with the glob pattern all-artifacts/**/*.tgz.
* restore Cargo.toml version to 0.5.0 ([8841d15](https://github.com/vernonthedev/encryptd/commit/8841d15c3a47d5fd579108a4eb6d84c12cc880ca)) - by vernonthedev
* restore valid package.json version to 0.5.0-beta.0 ([8936590](https://github.com/vernonthedev/encryptd/commit/8936590b2447d5abb3f4a93e16cd1d08ddf327d4)) - by vernonthedev
* strip pre-release suffix before version arithmetic ([3a91d02](https://github.com/vernonthedev/encryptd/commit/3a91d027b07453e6ee33e7c846aaf2d03d7ef2ff)) - by vernonthedev

  - CURRENT_VERSION may include -beta.0 suffix
  - Strip suffix with  before parsing MAJOR.MINOR.PATCH
  - Fixes 'invalid arithmetic operator' error when PATCH contains -beta.0
* use Node.js for cross-platform package fixing and publishing ([cf645a4](https://github.com/vernonthedev/encryptd/commit/cf645a4e9367b4ea631340eb7e458c1f66d82f76)) - by vernonthedev

  - Replace bash for loops with Node.js scripts for Windows compatibility
  - Fix platform package.json to remove repository field and add publishConfig
  - Publish packages using npm with correct registry and tag
* remove repository field from platform packages for npm publish ([996df84](https://github.com/vernonthedev/encryptd/commit/996df84e3e1c0a102768921d9e5c178bd2e08847)) - by vernonthedev

  - napi pre-publish includes repository field from root package.json
  - npm tries to use git SSH instead of registry URL when repository field exists
  - Fix by stripping repository field and adding publishConfig to each platform package
* restore valid package.json version to 0.3.0-beta.0 ([309cef0](https://github.com/vernonthedev/encryptd/commit/309cef0ee77916e38930226a67fa76aff9b2a102)) - by vernonthedev
* use base version for Cargo.toml (Cargo doesn't support pre-release suffixes) ([89ff70d](https://github.com/vernonthedev/encryptd/commit/89ff70d2374b0ba386243540f8b00900447c92fc)) - by vernonthedev

  - Update workflow to strip -beta.0 suffix when updating Cargo.toml
  - Fix Cargo.toml version to valid semver (0.3.0)
  - package.json keeps full version with -beta.0 for npm
* update package.json for GitHub Packages publishing ([bf0e311](https://github.com/vernonthedev/encryptd/commit/bf0e311f5ca2b4668d078056c801c5ba5344abc0)) - by vernonthedev

  - Change repository URL from git:// to https:// to avoid git protocol issues during npm publish
  - Add access: restricted to publishConfig for scoped package on GitHub Packages
* add --no-gh-release flag to napi pre-publish ([ed69190](https://github.com/vernonthedev/encryptd/commit/ed69190f6186fe0c6c75cb52cd0cbb3f5040aedb)) - by vernonthedev

  - napi pre-publish was trying to create GitHub release but we handle that separately
  - Adding --no-gh-release flag skips the built-in GH release creation
* correct manual-release.yml indentation and structure ([90b5d52](https://github.com/vernonthedev/encryptd/commit/90b5d527122f07b8f702102495c2343d51b2608c)) - by vernonthedev

  - Fixed indentation issues in version-bump job (commit, tag, push steps)
  - Fixed indentation in release job (checkout step)
  - All steps now properly aligned at correct indentation level
  - Workflow structure now valid YAML for GitHub Actions
* **ci:** fix workflow indentation in version-bump job ([3aa0939](https://github.com/vernonthedev/encryptd/commit/3aa093955e9811fcf7362361f03c104fefb70cf4)) - by vernonthedev
* **ci:** fix workflow indentation and permissions ([2ccb6e5](https://github.com/vernonthedev/encryptd/commit/2ccb6e52b650770de002be219125cb9fa24f14a7)) - by vernonthedev
* **ci:** tag version bump and checkout tag in release jobs to fix napi pre-publish ([7008d01](https://github.com/vernonthedev/encryptd/commit/7008d01ded3cc1d9911a51a70100e972858cb28b)) - by vernonthedev
* **ci:** add missing check-ci job and fix workflow ID for CI gate ([49b60a1](https://github.com/vernonthedev/encryptd/commit/49b60a1df1c31d4e7058ee327f0511123b91c7a6)) - by vernonthedev
* update manual-release workflow with proper artifact handling ([0b2bbaa](https://github.com/vernonthedev/encryptd/commit/0b2bbaa852e334046bd42c4077aed2b3f74b6ad5)) - by vernonthedev

  - Split into 3 jobs: check-ci, release (matrix), create-release
  - Each platform job uploads its npm package as artifact
  - create-release downloads all artifacts and attaches to single GitHub Release
  - Uses softprops/action-gh-release files: all-artifacts/**/*.tgz
  - Version output passed via needs.release.outputs.new_version
* update manual-release workflow with correct napi publish command ([ecd3186](https://github.com/vernonthedev/encryptd/commit/ecd3186e78057e03da732c45c07e45742341d26e)) - by vernonthedev

  - Replace 'napi publish' (doesn't exist) with 'napi pre-publish' + 'npm publish'
  - Use matrix builds for all 4 platforms (linux x64, macos x64, macos arm64, windows x64)
  - Only ubuntu-latest handles version bump, changelog, commit, release creation, push
  - Add check-ci job that runs first and blocks release if CI failed
  - Release jobs depend on check-ci (needs: check-ci)
* **rust:** add hand-written index.js to load native binary ([261012a](https://github.com/vernonthedev/encryptd/commit/261012a380eba6ea9ffd370eccaf656ba809cdcb)) - by vernonthedev

  napi-rs CLI 3.x with --platform flag generates only index.d.ts and
  the .node binary, not index.js. Write our own index.js that maps
  platform+arch to the correct binary filename and requires it.

  Remove rust/index.js from .gitignore (it's hand-written, not generated).
* **ci:** upgrade actions to @v5, add debug step, log require errors ([23fa281](https://github.com/vernonthedev/encryptd/commit/23fa281497bf78844ee713cea4265988403562d5)) - by vernonthedev

  - Upgrade actions/checkout and actions/setup-node to @v5 for
    Node.js 24 compatibility (silences node20 deprecation warnings)
  - Add debug step listing generated files after napi build
  - Test now logs both require error messages via console.error for
    visibility in CI logs
* **ci:** restore cargoCwd, point imports to rust/, ignore napi artifacts ([5571c1e](https://github.com/vernonthedev/encryptd/commit/5571c1ebbb60a6a0d666adc0b613522e82757338)) - by vernonthedev

  With cargoCwd: 'rust', napi build outputs index.js/d.ts and .node
  binaries into rust/ directory. Reverted cargoCwd removal and fixed
  all import paths to look in rust/ first (native.ts, test).

  Runners reverted to latest (macos-latest now = macOS 26, past the
  migration date, no more warning). Linux deps condition changed from
  matrix.os check to runner.os check so it works with ubuntu-latest.

  Added rust/*.node, rust/index.js, rust/index.d.ts to .gitignore.
* **ci:** remove cargoCwd, add manifest-path to publish, pin runner versions ([7f0873c](https://github.com/vernonthedev/encryptd/commit/7f0873cdf4242517ae09892c691ca8e743d6aa3c)) - by vernonthedev

  Root cause of skipped tests: cargoCwd: 'rust' made napi build
  output files to rust/ instead of root, so require('../index') in
  both native.ts and test/main.test.ts failed silently.

  - Remove cargoCwd so napi build outputs to root (npm package root)
  - Add --manifest-path rust/Cargo.toml to publish CI commands
  - native.ts fallback: try ../index then ../rust/index
  - Pin runner images: ubuntu-24.04, macos-14, windows-2022 to
    silence deprecation warnings for macos-latest and node20 actions
* **ts:** add native.ts bridge with inline types, import from ./native ([622d3a7](https://github.com/vernonthedev/encryptd/commit/622d3a7b83ccea37a5fe478088cde10148ef2447)) - by vernonthedev

  Replace direct import from napi-generated ../index with a proper
  bridge module. Declares EnvPayload, encryptEnv, and decryptEnv
  types inline (matching Rust signatures) and loads the binding at
  runtime via require('../index'). This decouples tsc from needing
  the napi-generated index.d.ts at compile time.
* **rust:** add missing AeadCore import for generate_nonce ([d11f087](https://github.com/vernonthedev/encryptd/commit/d11f0877d2787daf8344996b0cb435450ab123c8)) - by vernonthedev
* **ci:** remove optionalDependencies from package.json ([48bc19a](https://github.com/vernonthedev/encryptd/commit/48bc19a383868e14f23b15381af290f316595707)) - by vernonthedev

  pnpm --frozen-lockfile fails because these unpublished platform
  packages can't be resolved and get silently dropped from the
  lockfile. They belong only in the published npm package —
  napi publish CLI injects them during release.
* **ci:** add pnpm install step, use pnpm scripts instead of npx ([99802fe](https://github.com/vernonthedev/encryptd/commit/99802fe0fc4f51f87e64fbfd5951fe1d2d01a3ae)) - by vernonthedev

  CI was failing because dependencies were never installed. Added pnpm/action-setup, pnpm install --frozen-lockfile, and replaced all npx calls with pnpm equivalents.
* upgrade native.ts to use proper napi-rs imports, fix test types ([5b1c4b2](https://github.com/vernonthedev/encryptd/commit/5b1c4b21ae460956f71e8efca552b5108f70496d)) - by vernonthedev

  Both ponytail trade-offs resolved:

  src/native.ts — replaced require() manual type assertion with proper
  re-exports from the napi-rs generated binding (../index). TypeScript now
  gets types from the generated index.d.ts instead of a hand-written cast.
  Compiles to the same require('../index') at runtime.

  test/main.test.ts — replaced manual type interface with
  typeof import('../index'). Types now come from the generated binding
  while require() with try/catch preserves the graceful skip behavior
  for environments without the native binary.
* resolve napi build path, .npmrc auth, and rename test file ([bbba9f7](https://github.com/vernonthedev/encryptd/commit/bbba9f713974d6c4b801a5bd54e1ba28ec710412)) - by vernonthedev

  Bugs fixed:
  - napi-rs CLI could not find Cargo.toml (looked at root only). Added
    --manifest-path flag and cargoCwd config to point at rust/
  - Cargo.toml was missing [package] and [lib] sections — added them.
    Without [package], cargo treats it as a virtual manifest and rejects
    [dependencies]
  - napi config deprecated: name -> binaryName, triples -> targets.
    Updated to suppress deprecation warnings
  - .npmrc had  which pnpm refuses to expand in project
    .npmrc (security). Removed the auth line — CI uses NODE_AUTH_TOKEN
    env var via setup-node action; local dev uses global ~/.npmrc
  - test file renamed basic.test.ts -> main.test.ts for clarity
  - rust/target/ added to .gitignore (was leaking build artifacts)
* resolve critical NAPI binding, hasOwnProperty, and build bugs ([0c6036b](https://github.com/vernonthedev/encryptd/commit/0c6036b24d5ced9f5b2266e0c3aa9d46c02246d3)) - by vernonthedev

  Fix four critical bugs and restructure the TS/CI architecture:

  Bugs fixed:
  - Circular self-import in src/index.ts:3 — split into native.ts (NAPI
    binding loader via require) and types.ts (shared types), eliminating
    the self-import that would crash at runtime
  - Missing sha2 crate in Cargo.toml — Rust lib.rs imports sha2 but
    it was never declared as a dependency; build would fail
  - process.env.hasOwnProperty throws — Node creates process.env via
    Object.create(null) so hasOwnProperty is undefined; replaced with
    Object.hasOwn()
  - decrypt_env called but never imported — config() called the
    snake_case version which was never imported; now uses camelCase
    decryptEnv from the native binding

  Architecture:
  - Add napi-build script and wire into prepublishOnly so the Rust
    native binary is built before publish
  - Point main/types/bin to dist/ (compiled JS) instead of raw TS source
  - Add format version field to encrypted payload for future migration
  - Add decrypt subcommand to CLI for verification workflow
  - Match optionalDependencies to actual CI build targets (dropped
    linux-x64-musl, added darwin-x64)

  CI:
  - Add test job running on push/PR (not just release) with vitest
  - Build both darwin-x64 and darwin-arm64 on macos-latest via Rust
    cross-compilation
  - Gate publish jobs behind test + release event

  Tests:
  - Add 8 vitest round-trip tests covering encrypt/decrypt, edge cases
    (empty values, special chars, wrong passphrase), and IV uniqueness

### Code Refactoring

* **config:** update typescript module resolution to NodeNext ([c54114b](https://github.com/vernonthedev/encryptd/commit/c54114b9204599b7d2075435fef04bc33ec53874)) - by vernonthedev

  Adjust tsconfig.json to use NodeNext for both module and moduleResolution
  to ensure compatibility with modern Node.js ESM/CJS interoperability.
  Added node types and initialized the src directory structure.

  - Change module system to NodeNext
  - Update module resolution strategy
  - Add node type definitions
  - Initialize source directory

### Documentation

* **ci:** update CI workflow badge to use ci.yml ([e3efb05](https://github.com/vernonthedev/encryptd/commit/e3efb056bf2f4c06f4a9784b8bf480cb5154c0f8)) - by vernonthedev

  - Ensured our shieldcn status badges use our new ci.yml workflow setup
    for statuses.
* properly updated readme guidelines and usage guidelines in the /docs directory ([37c57be](https://github.com/vernonthedev/encryptd/commit/37c57be2b5334f131fb91a8d2faf205befcb0ef7)) - by vernonthedev

### Styles

* add [SrcIndex] and [RustLib] prefixes to all errors and logs ([cf4ed27](https://github.com/vernonthedev/encryptd/commit/cf4ed276bf74d43a02fd4df72c35f98985260b24)) - by vernonthedev

  Every error throw and console.log in the project now starts with a
  [DirFile] prefix so the source location is immediately visible:

  - [SrcIndex] for src/index.ts (config + CLI)
  - [RustLib] for rust/src/lib.rs (native encrypt/decrypt)

  The Rust file already had [RustLib] on the main encrypt/decrypt
  errors. Added it to the hex decode and UTF-8 conversion errors
  that were previously bare.

## 0.0.1-beta.0 (2026-07-14)

### Features

* add manual release workflow with CI gate and GitHub Packages publishing ([2712078](https://github.com/vernonthedev/encryptd/commit/27120784f6f604a86d4c265a2dfc47a21f3545a4)) — by vernonthedev

  - check-ci job: blocks release if latest CI run on main failed
  - version-bump: determines version, generates changelog, creates tag
  - release (matrix): builds 4 platforms, fixes package.json, publishes to GitHub Packages with --tag beta
  - create-release: aggregates all platform .tgz files into single GitHub Release (prerelease)
  - Uses vernonthedev <techjaja2@gmail.com> as author for commits and tags
* add manual release beta workflow with correct structure ([4de615a](https://github.com/vernonthedev/encryptd/commit/4de615a6473215398369e78c889e12f3042d2323)) — by vernonthedev

  - Workflow triggered manually via GitHub UI (workflow_dispatch)
  - CI gate: blocks release if latest CI run failed
  - Version bump: auto-determines semver from conventional commits
  - Matrix builds: 4 platforms (linux x64, macos x64/arm64, windows x64)
  - Publishes beta packages to GitHub Packages with --tag beta
  - Creates single GitHub Release with all platform .tgz artifacts
  - Uses conventional-changelog for full commit body in release notes
  - Author attribution: vernonthedev <techjaja2@gmail.com>
* add changesets + conventional-changelog release setup ([c556fe4](https://github.com/vernonthedev/encryptd/commit/c556fe41409cfa7f1e02ec9c20ce18a60bcaf7c2)) — by vernonthedev

  - Add manual-release workflow triggered via GitHub UI (workflow_dispatch)
    - Generates full CHANGELOG.md from conventional commits (subject + body)
    - Auto-determines version bump from commit types (feat!/feat/fix)
    - Publishes beta releases to GitHub Packages with --tag beta
    - Creates GitHub Release with full changelog as release notes
    - Commits version bump with author vernonthedev <techjaja2@gmail.com>

  - Add conventional-changelog config (.changelogrc.js)
    - Includes full commit body in changelog entries
    - Links commit hashes and authors to GitHub
    - Groups by type: Features, Bug Fixes, Performance, etc.

  - Add changesets config for version management
    - Changelog disabled (handled by conventional-changelog)
    - Base branch: main, access: restricted

  - Add npm scripts: changeset, version, release, changelog, changelog:first

  - Add dev dependencies: @changesets/cli, @changesets/changelog-github, conventional-changelog-cli, conventional-changelog-conventionalcommits
* replace SHA-256 KDF with PBKDF2, remove stubs ([74f64da](https://github.com/vernonthedev/encryptd/commit/74f64dabd3e1296ff0b4149ad49eac8ef1a04c2e)) — by vernonthedev

  Rust:
  - Replace SHA-256 hash with PBKDF2-HMAC-SHA256 (100K iterations)
  - Add random 16B salt per encryption, stored in EnvPayload
  - Extract derive_key() helper used by both encrypt/decrypt

  TypeScript:
  - Remove stub index.d.ts (no fake types)
  - Remove native.ts pass-through (import directly from napi binding)
  - Add salt field to EnvPayload type

  Docs:
  - Update README.md with full install, CLI, and dev guide
  - Add docs/api.md with complete API reference
  - Update How It Works tables for PBKDF2
* **src:** add source directory structure ([dcc31cf](https://github.com/vernonthedev/encryptd/commit/dcc31cf4d47949742acd3fd388831ca76d25123f)) — by vernonthedev

  - Typscript Runtime loader and cli encryptor configurations
* **crypto:** implement core encryption logic and interfaces ([0aa9d54](https://github.com/vernonthedev/encryptd/commit/0aa9d5457a84b4d2f042ed13c20c066628058865)) — by vernonthedev

  Introduce AES-256-GCM encryption constants and integrate type-safe
  interfaces for payload handling.

  - Add encryption constants (ALGORITHM, IV_LENGTH, SALT, etc.) to crypto.ts
  - Implement EncryptedPayload interface in new interfaces directory
  - Revert module system to commonjs in tsconfig.json
  - Clean up package.json metadata and scripts

### Bug Fixes

* **ci:** remove merge-multiple to prevent artifact overwrite in release job ([06b749c](https://github.com/vernonthedev/encryptd/commit/06b749cb71a2bed7ceaeeb06c0c5ec5ab25c028f)) — by vernonthedev

  When downloading multiple artifacts with the same internal file structure (npm/*.tgz),
  merge-multiple: true causes them to overwrite each other. By removing this option,
  each artifact is extracted to its own subdirectory (named after the artifact),
  allowing all .tgz files to be collected with the glob pattern all-artifacts/**/*.tgz.
* restore Cargo.toml version to 0.5.0 ([8841d15](https://github.com/vernonthedev/encryptd/commit/8841d15c3a47d5fd579108a4eb6d84c12cc880ca)) — by vernonthedev
* restore valid package.json version to 0.5.0-beta.0 ([8936590](https://github.com/vernonthedev/encryptd/commit/8936590b2447d5abb3f4a93e16cd1d08ddf327d4)) — by vernonthedev
* strip pre-release suffix before version arithmetic ([3a91d02](https://github.com/vernonthedev/encryptd/commit/3a91d027b07453e6ee33e7c846aaf2d03d7ef2ff)) — by vernonthedev

  - CURRENT_VERSION may include -beta.0 suffix
  - Strip suffix with  before parsing MAJOR.MINOR.PATCH
  - Fixes 'invalid arithmetic operator' error when PATCH contains -beta.0
* use Node.js for cross-platform package fixing and publishing ([cf645a4](https://github.com/vernonthedev/encryptd/commit/cf645a4e9367b4ea631340eb7e458c1f66d82f76)) — by vernonthedev

  - Replace bash for loops with Node.js scripts for Windows compatibility
  - Fix platform package.json to remove repository field and add publishConfig
  - Publish packages using npm with correct registry and tag
* remove repository field from platform packages for npm publish ([996df84](https://github.com/vernonthedev/encryptd/commit/996df84e3e1c0a102768921d9e5c178bd2e08847)) — by vernonthedev

  - napi pre-publish includes repository field from root package.json
  - npm tries to use git SSH instead of registry URL when repository field exists
  - Fix by stripping repository field and adding publishConfig to each platform package
* restore valid package.json version to 0.3.0-beta.0 ([309cef0](https://github.com/vernonthedev/encryptd/commit/309cef0ee77916e38930226a67fa76aff9b2a102)) — by vernonthedev
* use base version for Cargo.toml (Cargo doesn't support pre-release suffixes) ([89ff70d](https://github.com/vernonthedev/encryptd/commit/89ff70d2374b0ba386243540f8b00900447c92fc)) — by vernonthedev

  - Update workflow to strip -beta.0 suffix when updating Cargo.toml
  - Fix Cargo.toml version to valid semver (0.3.0)
  - package.json keeps full version with -beta.0 for npm
* update package.json for GitHub Packages publishing ([bf0e311](https://github.com/vernonthedev/encryptd/commit/bf0e311f5ca2b4668d078056c801c5ba5344abc0)) — by vernonthedev

  - Change repository URL from git:// to https:// to avoid git protocol issues during npm publish
  - Add access: restricted to publishConfig for scoped package on GitHub Packages
* add --no-gh-release flag to napi pre-publish ([ed69190](https://github.com/vernonthedev/encryptd/commit/ed69190f6186fe0c6c75cb52cd0cbb3f5040aedb)) — by vernonthedev

  - napi pre-publish was trying to create GitHub release but we handle that separately
  - Adding --no-gh-release flag skips the built-in GH release creation
* correct manual-release.yml indentation and structure ([90b5d52](https://github.com/vernonthedev/encryptd/commit/90b5d527122f07b8f702102495c2343d51b2608c)) — by vernonthedev

  - Fixed indentation issues in version-bump job (commit, tag, push steps)
  - Fixed indentation in release job (checkout step)
  - All steps now properly aligned at correct indentation level
  - Workflow structure now valid YAML for GitHub Actions
* **ci:** fix workflow indentation in version-bump job ([3aa0939](https://github.com/vernonthedev/encryptd/commit/3aa093955e9811fcf7362361f03c104fefb70cf4)) — by vernonthedev
* **ci:** fix workflow indentation and permissions ([2ccb6e5](https://github.com/vernonthedev/encryptd/commit/2ccb6e52b650770de002be219125cb9fa24f14a7)) — by vernonthedev
* **ci:** tag version bump and checkout tag in release jobs to fix napi pre-publish ([7008d01](https://github.com/vernonthedev/encryptd/commit/7008d01ded3cc1d9911a51a70100e972858cb28b)) — by vernonthedev
* **ci:** add missing check-ci job and fix workflow ID for CI gate ([49b60a1](https://github.com/vernonthedev/encryptd/commit/49b60a1df1c31d4e7058ee327f0511123b91c7a6)) — by vernonthedev
* update manual-release workflow with proper artifact handling ([0b2bbaa](https://github.com/vernonthedev/encryptd/commit/0b2bbaa852e334046bd42c4077aed2b3f74b6ad5)) — by vernonthedev

  - Split into 3 jobs: check-ci, release (matrix), create-release
  - Each platform job uploads its npm package as artifact
  - create-release downloads all artifacts and attaches to single GitHub Release
  - Uses softprops/action-gh-release files: all-artifacts/**/*.tgz
  - Version output passed via needs.release.outputs.new_version
* update manual-release workflow with correct napi publish command ([ecd3186](https://github.com/vernonthedev/encryptd/commit/ecd3186e78057e03da732c45c07e45742341d26e)) — by vernonthedev

  - Replace 'napi publish' (doesn't exist) with 'napi pre-publish' + 'npm publish'
  - Use matrix builds for all 4 platforms (linux x64, macos x64, macos arm64, windows x64)
  - Only ubuntu-latest handles version bump, changelog, commit, release creation, push
  - Add check-ci job that runs first and blocks release if CI failed
  - Release jobs depend on check-ci (needs: check-ci)
* **rust:** add hand-written index.js to load native binary ([261012a](https://github.com/vernonthedev/encryptd/commit/261012a380eba6ea9ffd370eccaf656ba809cdcb)) — by vernonthedev

  napi-rs CLI 3.x with --platform flag generates only index.d.ts and
  the .node binary, not index.js. Write our own index.js that maps
  platform+arch to the correct binary filename and requires it.

  Remove rust/index.js from .gitignore (it's hand-written, not generated).
* **ci:** upgrade actions to @v5, add debug step, log require errors ([23fa281](https://github.com/vernonthedev/encryptd/commit/23fa281497bf78844ee713cea4265988403562d5)) — by vernonthedev

  - Upgrade actions/checkout and actions/setup-node to @v5 for
    Node.js 24 compatibility (silences node20 deprecation warnings)
  - Add debug step listing generated files after napi build
  - Test now logs both require error messages via console.error for
    visibility in CI logs
* **ci:** restore cargoCwd, point imports to rust/, ignore napi artifacts ([5571c1e](https://github.com/vernonthedev/encryptd/commit/5571c1ebbb60a6a0d666adc0b613522e82757338)) — by vernonthedev

  With cargoCwd: 'rust', napi build outputs index.js/d.ts and .node
  binaries into rust/ directory. Reverted cargoCwd removal and fixed
  all import paths to look in rust/ first (native.ts, test).

  Runners reverted to latest (macos-latest now = macOS 26, past the
  migration date, no more warning). Linux deps condition changed from
  matrix.os check to runner.os check so it works with ubuntu-latest.

  Added rust/*.node, rust/index.js, rust/index.d.ts to .gitignore.
* **ci:** remove cargoCwd, add manifest-path to publish, pin runner versions ([7f0873c](https://github.com/vernonthedev/encryptd/commit/7f0873cdf4242517ae09892c691ca8e743d6aa3c)) — by vernonthedev

  Root cause of skipped tests: cargoCwd: 'rust' made napi build
  output files to rust/ instead of root, so require('../index') in
  both native.ts and test/main.test.ts failed silently.

  - Remove cargoCwd so napi build outputs to root (npm package root)
  - Add --manifest-path rust/Cargo.toml to publish CI commands
  - native.ts fallback: try ../index then ../rust/index
  - Pin runner images: ubuntu-24.04, macos-14, windows-2022 to
    silence deprecation warnings for macos-latest and node20 actions
* **ts:** add native.ts bridge with inline types, import from ./native ([622d3a7](https://github.com/vernonthedev/encryptd/commit/622d3a7b83ccea37a5fe478088cde10148ef2447)) — by vernonthedev

  Replace direct import from napi-generated ../index with a proper
  bridge module. Declares EnvPayload, encryptEnv, and decryptEnv
  types inline (matching Rust signatures) and loads the binding at
  runtime via require('../index'). This decouples tsc from needing
  the napi-generated index.d.ts at compile time.
* **rust:** add missing AeadCore import for generate_nonce ([d11f087](https://github.com/vernonthedev/encryptd/commit/d11f0877d2787daf8344996b0cb435450ab123c8)) — by vernonthedev
* **ci:** remove optionalDependencies from package.json ([48bc19a](https://github.com/vernonthedev/encryptd/commit/48bc19a383868e14f23b15381af290f316595707)) — by vernonthedev

  pnpm --frozen-lockfile fails because these unpublished platform
  packages can't be resolved and get silently dropped from the
  lockfile. They belong only in the published npm package —
  napi publish CLI injects them during release.
* **ci:** add pnpm install step, use pnpm scripts instead of npx ([99802fe](https://github.com/vernonthedev/encryptd/commit/99802fe0fc4f51f87e64fbfd5951fe1d2d01a3ae)) — by vernonthedev

  CI was failing because dependencies were never installed. Added pnpm/action-setup, pnpm install --frozen-lockfile, and replaced all npx calls with pnpm equivalents.
* upgrade native.ts to use proper napi-rs imports, fix test types ([5b1c4b2](https://github.com/vernonthedev/encryptd/commit/5b1c4b21ae460956f71e8efca552b5108f70496d)) — by vernonthedev

  Both ponytail trade-offs resolved:

  src/native.ts — replaced require() manual type assertion with proper
  re-exports from the napi-rs generated binding (../index). TypeScript now
  gets types from the generated index.d.ts instead of a hand-written cast.
  Compiles to the same require('../index') at runtime.

  test/main.test.ts — replaced manual type interface with
  typeof import('../index'). Types now come from the generated binding
  while require() with try/catch preserves the graceful skip behavior
  for environments without the native binary.
* resolve napi build path, .npmrc auth, and rename test file ([bbba9f7](https://github.com/vernonthedev/encryptd/commit/bbba9f713974d6c4b801a5bd54e1ba28ec710412)) — by vernonthedev

  Bugs fixed:
  - napi-rs CLI could not find Cargo.toml (looked at root only). Added
    --manifest-path flag and cargoCwd config to point at rust/
  - Cargo.toml was missing [package] and [lib] sections — added them.
    Without [package], cargo treats it as a virtual manifest and rejects
    [dependencies]
  - napi config deprecated: name -> binaryName, triples -> targets.
    Updated to suppress deprecation warnings
  - .npmrc had  which pnpm refuses to expand in project
    .npmrc (security). Removed the auth line — CI uses NODE_AUTH_TOKEN
    env var via setup-node action; local dev uses global ~/.npmrc
  - test file renamed basic.test.ts -> main.test.ts for clarity
  - rust/target/ added to .gitignore (was leaking build artifacts)
* resolve critical NAPI binding, hasOwnProperty, and build bugs ([0c6036b](https://github.com/vernonthedev/encryptd/commit/0c6036b24d5ced9f5b2266e0c3aa9d46c02246d3)) — by vernonthedev

  Fix four critical bugs and restructure the TS/CI architecture:

  Bugs fixed:
  - Circular self-import in src/index.ts:3 — split into native.ts (NAPI
    binding loader via require) and types.ts (shared types), eliminating
    the self-import that would crash at runtime
  - Missing sha2 crate in Cargo.toml — Rust lib.rs imports sha2 but
    it was never declared as a dependency; build would fail
  - process.env.hasOwnProperty throws — Node creates process.env via
    Object.create(null) so hasOwnProperty is undefined; replaced with
    Object.hasOwn()
  - decrypt_env called but never imported — config() called the
    snake_case version which was never imported; now uses camelCase
    decryptEnv from the native binding

  Architecture:
  - Add napi-build script and wire into prepublishOnly so the Rust
    native binary is built before publish
  - Point main/types/bin to dist/ (compiled JS) instead of raw TS source
  - Add format version field to encrypted payload for future migration
  - Add decrypt subcommand to CLI for verification workflow
  - Match optionalDependencies to actual CI build targets (dropped
    linux-x64-musl, added darwin-x64)

  CI:
  - Add test job running on push/PR (not just release) with vitest
  - Build both darwin-x64 and darwin-arm64 on macos-latest via Rust
    cross-compilation
  - Gate publish jobs behind test + release event

  Tests:
  - Add 8 vitest round-trip tests covering encrypt/decrypt, edge cases
    (empty values, special chars, wrong passphrase), and IV uniqueness

### Code Refactoring

* **config:** update typescript module resolution to NodeNext ([c54114b](https://github.com/vernonthedev/encryptd/commit/c54114b9204599b7d2075435fef04bc33ec53874)) — by vernonthedev

  Adjust tsconfig.json to use NodeNext for both module and moduleResolution
  to ensure compatibility with modern Node.js ESM/CJS interoperability.
  Added node types and initialized the src directory structure.

  - Change module system to NodeNext
  - Update module resolution strategy
  - Add node type definitions
  - Initialize source directory

### Documentation

* **ci:** update CI workflow badge to use ci.yml ([e3efb05](https://github.com/vernonthedev/encryptd/commit/e3efb056bf2f4c06f4a9784b8bf480cb5154c0f8)) — by vernonthedev

  - Ensured our shieldcn status badges use our new ci.yml workflow setup
    for statuses.
* properly updated readme guidelines and usage guidelines in the /docs directory ([37c57be](https://github.com/vernonthedev/encryptd/commit/37c57be2b5334f131fb91a8d2faf205befcb0ef7)) — by vernonthedev

### Styles

* add [SrcIndex] and [RustLib] prefixes to all errors and logs ([cf4ed27](https://github.com/vernonthedev/encryptd/commit/cf4ed276bf74d43a02fd4df72c35f98985260b24)) — by vernonthedev

  Every error throw and console.log in the project now starts with a
  [DirFile] prefix so the source location is immediately visible:

  - [SrcIndex] for src/index.ts (config + CLI)
  - [RustLib] for rust/src/lib.rs (native encrypt/decrypt)

  The Rust file already had [RustLib] on the main encrypt/decrypt
  errors. Added it to the hex decode and UTF-8 conversion errors
  that were previously bare.
