<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/encryptd-AES--256--GCM%20Env%20Encryption-%2300d4aa?style=for-the-badge&labelColor=%23111111">
    <img alt="encryptd" src="https://img.shields.io/badge/encryptd-AES--256--GCM%20Env%20Encryption-%2300d4aa?style=for-the-badge&labelColor=%23f0f0f0">
  </picture>
</p>

<p align="center">
  <a href="https://github.com/vernonthedev/encryptd/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/vernonthedev/encryptd/ci.yml?branch=main&label=CI&logo=github&style=flat-square" alt="CI"></a>
  <a href="https://github.com/vernonthedev/encryptd/releases"><img src="https://img.shields.io/github/v/release/vernonthedev/encryptd?include_prereleases&label=version&logo=github&style=flat-square" alt="Version"></a>
  <a href="#"><img src="https://img.shields.io/badge/rust-1.85%2B-dea584?logo=rust&style=flat-square" alt="Rust"></a>
  <a href="#"><img src="https://img.shields.io/badge/typescript-%23007ACC?logo=typescript&style=flat-square" alt="TypeScript"></a>
</p>

**encryptd** encrypts and decrypts `.env` files using **AES-256-GCM** via a Rust native addon (napi-rs). Works as both a library and a CLI.

## Install

```sh
pnpm add @vernonthedev/encryptd
```

> Published to **GitHub Packages**.

## CLI

```sh
# Encrypt .env -> .env.enc
ENV_PASSPHRASE="your-secret" npx encryptd encrypt
# Decrypt .env.enc -> stdout
ENV_PASSPHRASE="your-secret" npx encryptd decrypt
```

Custom paths:

```sh
ENV_PASSPHRASE="s3cr3t" npx encryptd encrypt .env.prod .env.prod.enc
ENV_PASSPHRASE="s3cr3t" npx encryptd decrypt .env.prod.enc
```

## How It Works

| Step | What |
|------|------|
| **Encrypt** | Random 16B salt → PBKDF2-HMAC-SHA256 (100K iterations) derives 32B key → random 96-bit nonce → AES-256-GCM encrypt → hex-encode salt, IV, ciphertext, auth tag → write as JSON |
| **Decrypt** | Parse JSON → hex-decode salt, IV, content, tag → PBKDF2 derives same key → AES-256-GCM decrypt (auto-verifies tag) → output plaintext |

The Rust native addon runs encryption via `aes-gcm` crate, exposed to Node.js through napi-rs. Each encryption uses a fresh random nonce, so the same input produces different output every time.

## Platform Support

| OS & Arch | Binary |
|-----------|--------|
| macOS (ARM64) | `encryptd-darwin-arm64` |
| macOS (x64) | `encryptd-darwin-x64` |
| Linux (x64) | `encryptd-linux-x64-gnu` |
| Windows (x64) | `encryptd-win32-x64-msvc` |

## Development

```sh
pnpm install
pnpm napi-build   # compile Rust -> native binary
pnpm build        # compile TypeScript
pnpm test         
```
