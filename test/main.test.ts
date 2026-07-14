// ponytail: native binding require() is called at module scope. If the
// native binary hasn't been built, all tests skip. Upgrade: generate proper
// TS bindings from napi-rs and import those instead of require().
import { describe, it, expect } from 'vitest';

let native: {
  encryptEnv: (plainText: string, passphrase: string) => { iv: string; content: string; tag: string };
  decryptEnv: (payload: { iv: string; content: string; tag: string }, passphrase: string) => string;
};

try {
  native = require('../index');
} catch {
  // native binding not built — all tests below will skip
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

  it('encrypted output has iv, content, and tag', () => {
    const payload = native.encryptEnv('KEY=val', PASSPHRASE);
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
