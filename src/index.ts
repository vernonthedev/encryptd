import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { encryptEnv, decryptEnv, EnvPayload } from './index';

export interface ConfigOptions {
  path?: string;
  passphrase?: string;
  override?: boolean;
}
/*
* RUNTIME LOADER
*/
export function config(options: ConfigOptions = {}): Record<string, string> {
  const envPath = options.path || '.env.enc';
  const passphrase = options.passphrase || process.env.ENV_PASSPHRASE;

  if (!passphrase) throw new Error('[TsSRC] No passphrase provided.');

  const fullPath = resolve(process.cwd(), envPath);
  if (!existsSync(fullPath)) throw new Error(`[TsSRC] Encrypted env file not found at ${fullPath}`);

  const encryptedJson = readFileSync(fullPath, 'utf-8');
  const payload: EnvPayload = JSON.parse(encryptedJson);

  const decryptedData = decrypt_env(payload, passphrase);

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
      if (!process.env.hasOwnProperty(key) || options.override) process.env[key] = val;
    }
  }
  return envVars;
}
/*
* CLI ENCRYPTOR
*/
export function runCli(args: string[]) {
  if (args[0] === 'encrypt') {
    const inputFile = args[1] || '.env';
    const outputFile = args[2] || '.env.enc';
    const passphrase = process.env.ENV_PASSPHRASE;

    if (!passphrase) throw new Error('[TsSRC] Set ENV_PASSPHRASE env var.');
    if (!existsSync(inputFile)) throw new Error(`[TsSRC] ${inputFile} not found.`);

    const plainText = readFileSync(inputFile, 'utf-8');

    const payload = encryptEnv(plainText, passphrase);

    writeFileSync(outputFile, JSON.stringify(payload, null, 2), 'utf-8');
    console.log(`[Encryptd][+] Encrypted ${inputFile} -> ${outputFile}`);
  } else {
    console.log('[Usage]: ENV_PASSPHRASE="..." npx secure-env-rs encrypt');
  }
}
