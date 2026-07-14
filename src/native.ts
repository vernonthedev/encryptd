export interface EnvPayload {
  salt: string;
  iv: string;
  content: string;
  tag: string;
}

export declare function encryptEnv(plainText: string, passphrase: string): EnvPayload;
export declare function decryptEnv(payload: EnvPayload, passphrase: string): string;

let binding: Record<string, unknown> | undefined;
try { binding = require('../rust/index'); } catch { try { binding = require('../index'); } catch { /* binary not built */ } }

if (binding) {
  exports.encryptEnv = binding.encryptEnv as typeof encryptEnv;
  exports.decryptEnv = binding.decryptEnv as typeof decryptEnv;
}