// ponytail: require() the napi-generated platform loader. No TS types from napi-rs
// at this layer — the type assertion is manual. Upgrade: generate proper TS bindings
// via @napi-rs/cli's JS binding output and import from those instead.
import type { EnvPayload } from './types';

const binding = require('../index') as {
  encryptEnv: (plainText: string, passphrase: string) => EnvPayload;
  decryptEnv: (payload: EnvPayload, passphrase: string) => string;
};

export const encryptEnv = binding.encryptEnv;
export const decryptEnv = binding.decryptEnv;
