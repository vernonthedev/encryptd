export interface EnvPayload {
  version?: number;
  salt: string;
  iv: string;
  content: string;
  tag: string;
}

export interface ConfigOptions {
  path?: string;
  passphrase?: string;
  override?: boolean;
}
