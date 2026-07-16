# Changelog

## 0.0.1-beta.0 (2026-07-14)

### Features

* **Release pipeline**: Manual release workflow with CI gate, matrix builds (linux/macOS/Windows), GitHub Packages publishing, and GitHub Release creation
* **Version management**: Conventional commits + changesets for automated version bumping and changelog generation
* **Core encryption**: AES-256-GCM with PBKDF2-HMAC-SHA256 (100k iterations), per-encryption random salt
* **TypeScript bindings**: Native NAPI-RS bindings with type-safe EnvPayload interface, CLI encrypt/decrypt commands
* **Project structure**: Source directory, crypto module, and cross-platform build setup