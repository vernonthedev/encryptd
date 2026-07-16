---
"@vernonthedev/encryptd": minor
---

Initial beta release with core encryption functionality:

- AES-256-GCM encryption with PBKDF2-HMAC-SHA256 (100k iterations)
- Per-encryption random salt stored in payload
- TypeScript NAPI-RS bindings with type-safe EnvPayload interface
- CLI commands: `encrypt` and `decrypt` for environment files
- Cross-platform builds (Linux x64, macOS x64/arm64, Windows x64)
- GitHub Packages publishing with automated releases