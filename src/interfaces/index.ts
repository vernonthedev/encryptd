export interface EncryptedPayload {
  iv: string;
  content: string;
  authTag: string;
}