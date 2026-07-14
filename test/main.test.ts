import { describe, it, expect } from 'vitest';
import type { EnvPayload } from '../src/native';

// ponytail: require with try/catch for graceful fallback when
// the native binary isn't built (non-Rust CI, dev without MSVC).
type Native = { encryptEnv: (s: string, p: string) => EnvPayload; decryptEnv: (p: EnvPayload, k: string) => string };
let native: Native | undefined;

try {
  native = require('../rust/index');
} catch (e) {
  const err1 = (e as Error)?.message;
  try { native = require('../index'); } catch (e2) {
    console.error('[Test] require ../rust/index failed:', err1);
    console.error('[Test] require ../index failed:', (e2 as Error)?.message);
  }
}

const PASSPHRASE = 'test-passphrase-2024';

const describeOrSkip = native ? describe : describe.skip;

describeOrSkip('encryptd', () => {
  it('encrypt/decrypt round-trip with single var', () => {
    const plain = 'DATABASE_URL=postgres://localhost/mydb';
    const payload = native.encryptEnv(plain, PASSPHRASE);
    expect(native.decryptEnv(payload, PASSPHRASE)).toBe(plain);
  });

  it('encrypt/decrypt round-trip with multi-line env', () => {
    const plain = 'DATABASE_URL=postgres://localhost/mydb\nAPI_KEY=secret123\nDEBUG=true';
    const payload = native.encryptEnv(plain, PASSPHRASE);
    expect(native.decryptEnv(payload, PASSPHRASE)).toBe(plain);
  });

  it('encrypt/decrypt round-trip with empty value', () => {
    const plain = 'EMPTY=';
    const payload = native.encryptEnv(plain, PASSPHRASE);
    expect(native.decryptEnv(payload, PASSPHRASE)).toBe(plain);
  });

  it('encrypt/decrypt round-trip with special characters', () => {
    const plain = 'SECRET=a+b/c:d@e#f!g%h^';
    const payload = native.encryptEnv(plain, PASSPHRASE);
    expect(native.decryptEnv(payload, PASSPHRASE)).toBe(plain);
  });

  it('encrypted output has salt, iv, content, and tag', () => {
    const payload = native.encryptEnv('KEY=val', PASSPHRASE);
    expect(payload.salt).toBeTruthy();
    expect(payload.iv).toBeTruthy();
    expect(payload.content).toBeTruthy();
    expect(payload.tag).toBeTruthy();
  });

  it('produces different ciphertext each time (random IV)', () => {
    const a = native.encryptEnv('KEY=val', PASSPHRASE);
    const b = native.encryptEnv('KEY=val', PASSPHRASE);
    expect(a).not.toEqual(b);
  });

  it('decrypt with wrong passphrase throws', () => {
    const payload = native.encryptEnv('SECRET=topsecret', PASSPHRASE);
    expect(() => native.decryptEnv(payload, 'wrong-passphrase')).toThrow();
  });

  it('decrypt with empty passphrase throws', () => {
    const payload = native.encryptEnv('KEY=val', PASSPHRASE);
    expect(() => native.decryptEnv(payload, '')).toThrow();
  });
});
