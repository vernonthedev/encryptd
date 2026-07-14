import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { encryptEnv, decryptEnv } from './native';
import type { EnvPayload, ConfigOptions } from './types';

const ENV_FORMAT_VERSION = 1;

export type { EnvPayload, ConfigOptions };

export function config(options: ConfigOptions = {}): Record<string, string> {
  const envPath = options.path || '.env.enc';
  const passphrase = options.passphrase || process.env.ENV_PASSPHRASE;

  if (!passphrase) throw new Error('[SrcIndex] ENV_PASSPHRASE not set. Pass it via options.passphrase or ENV_PASSPHRASE env var.');

  const fullPath = resolve(process.cwd(), envPath);
  if (!existsSync(fullPath)) throw new Error(`[SrcIndex] Encrypted env file not found at ${fullPath}`);

  const raw = readFileSync(fullPath, 'utf-8');
  let payload: EnvPayload;
  try {
    payload = JSON.parse(raw);
  } catch {
    throw new Error(`[SrcIndex] Invalid encrypted env file at ${fullPath}. Expected valid JSON.`);
  }

  const decryptedData = decryptEnv(payload, passphrase);

  const lines = decryptedData.split('\n');
  const envVars: Record<string, string> = {};

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx > 0) {
      const key = trimmed.substring(0, eqIdx).trim();
      let val = trimmed.substring(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) val = val.slice(1, -1);
      envVars[key] = val;
      if (!Object.hasOwn(process.env, key) || options.override) process.env[key] = val;
    }
  }
  return envVars;
}

export function runCli(args: string[]) {
  const command = args[0];

  if (command === 'encrypt') {
    const inputFile = args[1] || '.env';
    const outputFile = args[2] || '.env.enc';
    const passphrase = process.env.ENV_PASSPHRASE;

    if (!passphrase) throw new Error('[SrcIndex] Set ENV_PASSPHRASE env var.');
    if (!existsSync(inputFile)) throw new Error(`[SrcIndex] ${inputFile} not found.`);

    const plainText = readFileSync(inputFile, 'utf-8');
    const payload: EnvPayload = { ...encryptEnv(plainText, passphrase), version: ENV_FORMAT_VERSION };
    writeFileSync(outputFile, JSON.stringify(payload, null, 2), 'utf-8');
    console.log(`[SrcIndex] Encrypted ${inputFile} -> ${outputFile}`);
  } else if (command === 'decrypt') {
    const inputFile = args[1] || '.env.enc';
    const passphrase = process.env.ENV_PASSPHRASE;

    if (!passphrase) throw new Error('[SrcIndex] Set ENV_PASSPHRASE env var.');
    if (!existsSync(inputFile)) throw new Error(`[SrcIndex] ${inputFile} not found.`);

    const raw = readFileSync(inputFile, 'utf-8');
    const payload: EnvPayload = JSON.parse(raw);
    const plainText = decryptEnv(payload, passphrase);
    console.log(`[SrcIndex] ${plainText}`);
  } else {
    console.log('[SrcIndex] Usage: ENV_PASSPHRASE="..." secure-env encrypt [.env] [.env.enc]');
    console.log('[SrcIndex]        ENV_PASSPHRASE="..." secure-env decrypt [.env.enc]');
  }
}
