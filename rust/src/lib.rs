use aes_gcm::{
    aead::{Aead, KeyInit, OsRng},
    Aes256Gcm, Nonce,
};
use napi::bindgen_prelude::*;
use napi_derive::napi;

/*
* Define the structure we expect from JS/TS
*/
#[napi(object)]
pub struct EnvPayload {
    pub iv: String,
    pub content: String,
    pub tag: String,
}

#[napi]
pub fn encrypt_env(plain_text: String, passphrase: String) -> Result<EnvPayload> {
    /*
     * Derive a 32-byte key from the passphrase.
     * In a real-world scenario, you should use a proper key derivation function like Argon2 or PBKDF2.
     * For simplicity, we will hash the passphrase to get a 32-byte key.
     */
    use sha2::{Digest, Sha256};
    let mut hasher = Sha256::new();
    hasher.update(passphrase.as_bytes());
    let key_bytes = hasher.finalize();

    let key = aes_gcm::Key::<Aes256Gcm>::from_slice(&key_bytes);
    let cipher = Aes256Gcm::new(key);

    /*
     * 96-bit unique IV
     */
    let nonce = Aes256Gcm::generate_nonce(&mut OsRng);
    let nonce_bytes = nonce.to_vec();

    match cipher.encrypt(&nonce, plain_text.as_bytes()) {
        Ok(ciphertext) => {
            /*
             * aes-gcm appends the 16-byte auth tag to the end of the ciphertext
             */
            let content_hex = hex::encode(&ciphertext[..ciphertext.len() - 16]);
            let tag_hex = hex::encode(&ciphertext[ciphertext.len() - 16..]);

            Ok(EnvPayload {
                iv: hex::encode(nonce_bytes),
                content: content_hex,
                tag: tag_hex,
            })
        }
        Err(e) => Err(Error::from_reason(format!(
            "[RustLib] Encryption failed: {}",
            e
        ))),
    }
}

#[napi]
pub fn decrypt_env(payload: EnvPayload, passphrase: String) -> Result<String> {
    use sha2::{Digest, Sha256};
    let mut hasher = Sha256::new();
    hasher.update(passphrase.as_bytes());
    let key_bytes = hasher.finalize();

    let key = aes_gcm::Key::<Aes256Gcm>::from_slice(&key_bytes);
    let cipher = Aes256Gcm::new(key);

    let nonce_bytes = hex::decode(&payload.iv).map_err(|e| Error::from_reason(e.to_string()))?;
    let nonce = Nonce::from_slice(&nonce_bytes);

    let mut ciphertext =
        hex::decode(&payload.content).map_err(|e| Error::from_reason(e.to_string()))?;
    let tag = hex::decode(&payload.tag).map_err(|e| Error::from_reason(e.to_string()))?;

    /*
     * Reconstruct ciphertext + tag format
     */
    ciphertext.extend(tag);

    match cipher.decrypt(nonce, ciphertext.as_ref()) {
        Ok(plaintext) => {
            String::from_utf8(plaintext).map_err(|e| Error::from_reason(e.to_string()))
        }
        Err(e) => Err(Error::from_reason(format!(
            "[RustLib] Decryption failed. Wrong key or tampered file. {}",
            e
        ))),
    }
}
