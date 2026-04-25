import crypto from 'node:crypto';

const DEFAULT_ENCODING = 'base64';

/**
 * Encrypt a UTF-8 string using the given cipher algorithm, key, and IV.
 *
 * @param alg - Cipher algorithm, e.g. `'aes-256-cbc'`.
 * @param key - Encryption key (Buffer or hex string, length depends on algorithm).
 * @param iv - Initialisation vector (Buffer or hex string).
 * @param text - Plaintext to encrypt.
 * @param encoding - Output encoding. Defaults to `'base64'`.
 */
export const encryptText = (
  alg: string,
  key: crypto.CipherKey,
  iv: crypto.BinaryLike,
  text: string,
  encoding: BufferEncoding = DEFAULT_ENCODING,
): string => {
  const cipher = crypto.createCipheriv(alg, key, iv);
  return cipher.update(text, 'utf8', encoding) + cipher.final(encoding);
};

/**
 * Decrypt a ciphertext string using the given cipher algorithm, key, and IV.
 *
 * @param alg - Cipher algorithm, e.g. `'aes-256-cbc'`.
 * @param key - Decryption key (Buffer or hex string).
 * @param iv - Initialisation vector (Buffer or hex string).
 * @param text - Ciphertext to decrypt.
 * @param encoding - Input encoding of the ciphertext. Defaults to `'base64'`.
 */
export const decryptText = (
  alg: string,
  key: crypto.CipherKey,
  iv: crypto.BinaryLike,
  text: string,
  encoding: BufferEncoding = DEFAULT_ENCODING,
): string => {
  const decipher = crypto.createDecipheriv(alg, key, iv);
  return decipher.update(text, encoding, 'utf8') + decipher.final('utf8');
};

/** Generate a random 16-byte initialisation vector. */
export const genIv = (): Buffer => crypto.randomBytes(16);

/**
 * Derive a fixed-size key Buffer from a password string using a hash digest.
 * Supports `aes-256-*` (32 bytes via SHA-256) and `aes-128-*` (32 bytes via MD5).
 *
 * @param algorithm - Cipher algorithm string used to infer the key size.
 * @param password - Source password string.
 */
export const genKey = (algorithm: string, password: string): Buffer => {
  const [size, algo] = algorithm.includes('256')
    ? [32, 'sha256']
    : algorithm.includes('128')
      ? [16, 'md5']
      : [32, 'sha256'];
  const hash = crypto.createHash(algo);
  hash.update(password);
  return Buffer.from(hash.digest('hex'), 'hex').subarray(0, size);
};
