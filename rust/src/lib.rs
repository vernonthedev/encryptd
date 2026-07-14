use aes_gcm::{aead::{Aead, AeadCore, KeyInit, OsRng}, Aes256Gcm, Nonce};
use napi::bindgen_prelude::*;
use napi_derive::napi;
use rand_core::RngCore;

const PBKDF2_ITERATIONS: u32 = 100_000;

#[napi(object)]
pub struct EnvPayload {
    pub salt: String,
    pub iv: String,
    pub content: String,
    pub tag: String,
}

fn derive_key(passphrase: &[u8], salt: &[u8]) -> [u8; 32] {
    use pbkdf2::pbkdf2_hmac;
    use sha2::Sha256;
    let mut key = [0u8; 32];
    pbkdf2_hmac::<Sha256>(passphrase, salt, PBKDF2_ITERATIONS, &mut key);
    key
}

#[napi]
pub fn encrypt_env(plain_text: String, passphrase: String) -> Result<EnvPayload> {
    let mut salt = [0u8; 16];
    OsRng.fill_bytes(&mut salt);

    let key_bytes = derive_key(passphrase.as_bytes(), &salt);
    let key = aes_gcm::Key::<Aes256Gcm>::from_slice(&key_bytes);
    let cipher = Aes256Gcm::new(key);

    let nonce = Aes256Gcm::generate_nonce(&mut OsRng);
    let nonce_bytes = nonce.to_vec();

    match cipher.encrypt(&nonce, plain_text.as_bytes()) {
        Ok(ciphertext) => {
            let content_hex = hex::encode(&ciphertext[..ciphertext.len() - 16]);
            let tag_hex = hex::encode(&ciphertext[ciphertext.len() - 16..]);
            Ok(EnvPayload {
                salt: hex::encode(salt),
                iv: hex::encode(nonce_bytes),
                content: content_hex,
                tag: tag_hex,
            })
        }
        Err(e) => Err(Error::from_reason(format!("[RustLib] Encryption failed: {}", e))),
    }
}

#[napi]
pub fn decrypt_env(payload: EnvPayload, passphrase: String) -> Result<String> {
    let salt = hex::decode(&payload.salt).map_err(|e| Error::from_reason(format!("[RustLib] Invalid salt hex: {}", e)))?;

    let key_bytes = derive_key(passphrase.as_bytes(), &salt);
    let key = aes_gcm::Key::<Aes256Gcm>::from_slice(&key_bytes);
    let cipher = Aes256Gcm::new(key);

    let nonce_bytes = hex::decode(&payload.iv).map_err(|e| Error::from_reason(format!("[RustLib] Invalid IV hex: {}", e)))?;
    let nonce = Nonce::from_slice(&nonce_bytes);

    let mut ciphertext = hex::decode(&payload.content).map_err(|e| Error::from_reason(format!("[RustLib] Invalid content hex: {}", e)))?;
    let tag = hex::decode(&payload.tag).map_err(|e| Error::from_reason(format!("[RustLib] Invalid tag hex: {}", e)))?;
    ciphertext.extend(tag);

    match cipher.decrypt(nonce, ciphertext.as_ref()) {
        Ok(plaintext) => String::from_utf8(plaintext).map_err(|e| Error::from_reason(format!("[RustLib] Invalid UTF-8: {}", e))),
        Err(e) => Err(Error::from_reason(format!("[RustLib] Decryption failed. Wrong key or tampered file. {}", e))),
    }
}
