**encryptd** encrypts and decrypts `.env` files using **AES-256-GCM** via a Rust native addon (napi-rs). Works as both a library and a CLI.

## Install

```sh
pnpm install @vernonthedev/encryptd
```

> Published to **GitHub Packages**. Requires `.npmrc`: `@vernonthedev:registry=https://npm.pkg.github.com`

## CLI

```sh
# Encrypt .env -> .env.enc
ENV_PASSPHRASE="your-secret" npx secure-env encrypt

# Decrypt .env.enc -> stdout
ENV_PASSPHRASE="your-secret" npx secure-env decrypt
```

Custom paths:

```sh
ENV_PASSPHRASE="s3cr3t" npx secure-env encrypt .env.prod .env.prod.enc
ENV_PASSPHRASE="s3cr3t" npx secure-env decrypt .env.prod.enc
```

## API

```ts
import { config } from '@vernonthedev/encryptd';

// Loads .env.enc, decrypts it, sets process.env
const env = config({ passphrase: 'your-secret' });
console.log(env.DATABASE_URL);
```

### `config(options?)`

| Option | Default | Description |
|--------|---------|-------------|
| `path` | `".env.enc"` | Path to encrypted file |
| `passphrase` | `process.env.ENV_PASSPHRASE` | Encryption passphrase |
| `override` | `false` | Overwrite existing `process.env` keys |

Returns `Record<string, string>` of decrypted env vars.

### `secure-env encrypt [input] [output]`

Reads a plaintext `.env`, encrypts it with `ENV_PASSPHRASE`, writes JSON output.

### `secure-env decrypt [input]`

Reads an encrypted `.env.enc`, decrypts it, prints to stdout.

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

## API Reference

```typescript
// @vernonthedev/encryptd

interface EnvPayload {
  version?: number;
  salt: string;     // hex-encoded PBKDF2 salt
  iv: string;       // hex-encoded nonce
  content: string;  // hex-encoded ciphertext
  tag: string;      // hex-encoded GCM auth tag
}

interface ConfigOptions {
  path?: string;
  passphrase?: string;
  override?: boolean;
}

// Low-level Rust bridge
function encryptEnv(plainText: string, passphrase: string): EnvPayload;
function decryptEnv(payload: EnvPayload, passphrase: string): string;

// High-level loader
function config(options?: ConfigOptions): Record<string, string>;

// CLI dispatcher
function runCli(args: string[]): void;
```

## Development

```sh
pnpm install
pnpm napi-build   # compile Rust -> native binary
pnpm build        # compile TypeScript
pnpm test         # vitest
```
