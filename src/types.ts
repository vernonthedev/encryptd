export interface EnvPayload {
  version?: number;
  iv: string;
  content: string;
  tag: string;
}

export interface ConfigOptions {
  path?: string;
  passphrase?: string;
  override?: boolean;
}
