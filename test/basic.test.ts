import { describe, it, expect } from 'vitest';

let native: { encryptEnv: Function; decryptEnv: Function };

try {
  native = require('../index');
} catch {
  // native binding not built — skip
}

const run = native
  ? describe
  : describe.skip;

const PASSPHRASE = 'test-passphrase-2024';

run('encryptd', () => {
  const { encryptEnv, decryptEnv } = native!;

  it('encrypt/decrypt round-trip with single var', () => {
    const plain = 'DATABASE_URL=postgres://localhost/mydb';
    const payload = encryptEnv(plain, PASSPHRASE);
    expect(decryptEnv(payload, PASSPHRASE)).toBe(plain);
  });

  it('encrypt/decrypt round-trip with multi-line env', () => {
    const plain = 'DATABASE_URL=postgres://localhost/mydb\nAPI_KEY=secret123\nDEBUG=true';
    const payload = encryptEnv(plain, PASSPHRASE);
    expect(decryptEnv(payload, PASSPHRASE)).toBe(plain);
  });

  it('encrypt/decrypt round-trip with empty value', () => {
    const plain = 'EMPTY=';
    const payload = encryptEnv(plain, PASSPHRASE);
    expect(decryptEnv(payload, PASSPHRASE)).toBe(plain);
  });

  it('encrypt/decrypt round-trip with special characters', () => {
    const plain = 'SECRET=a+b/c:d@e#f!g%h^';
    const payload = encryptEnv(plain, PASSPHRASE);
    expect(decryptEnv(payload, PASSPHRASE)).toBe(plain);
  });

  it('encrypted output has iv, content, and tag', () => {
    const payload = encryptEnv('KEY=val', PASSPHRASE);
    expect(payload.iv).toBeTruthy();
    expect(payload.content).toBeTruthy();
    expect(payload.tag).toBeTruthy();
  });

  it('produces different ciphertext each time (random IV)', () => {
    const a = encryptEnv('KEY=val', PASSPHRASE);
    const b = encryptEnv('KEY=val', PASSPHRASE);
    expect(a).not.toEqual(b);
  });

  it('decrypt with wrong passphrase throws', () => {
    const payload = encryptEnv('SECRET=topsecret', PASSPHRASE);
    expect(() => decryptEnv(payload, 'wrong-passphrase')).toThrow();
  });

  it('decrypt with empty passphrase throws', () => {
    const payload = encryptEnv('KEY=val', PASSPHRASE);
    expect(() => decryptEnv(payload, '')).toThrow();
  });
});
