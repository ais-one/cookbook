import crypto from 'node:crypto';

const HASH_KEYLEN = 64;

/**
 * Derive a hex-encoded scrypt hash from a plaintext password and hex-encoded salt.
 * Store both the returned hash and the salt in the database.
 *
 * @param password - Plaintext password to hash.
 * @param salt - Hex-encoded salt to use during derivation.
 * @returns Hex-encoded scrypt hash.
 */
export const setScryptHash = (password: string, salt: string): Promise<string> => {
  const saltBuffer = Buffer.from(salt, 'hex');
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, saltBuffer, HASH_KEYLEN, (err, derivedKey) => {
      if (err) reject(err);
      resolve(derivedKey.toString('hex'));
    });
  });
};

/**
 * Verify a plaintext password attempt against a stored scrypt hash and salt.
 * Uses timing-safe comparison to prevent side-channel attacks.
 *
 * @param passwordAttempt - The password provided by the user.
 * @param storedSalt - Hex-encoded salt retrieved from the database.
 * @param storedHash - Hex-encoded hash retrieved from the database.
 * @returns `true` when the password matches, `false` otherwise.
 */
export const matchScryptHash = (passwordAttempt: string, storedSalt: string, storedHash: string): Promise<boolean> => {
  const salt = Buffer.from(storedSalt, 'hex');
  const hash = Buffer.from(storedHash, 'hex');
  return new Promise((resolve, reject) => {
    crypto.scrypt(passwordAttempt, salt, HASH_KEYLEN, (err, derivedKey) => {
      if (err) reject(err);
      resolve(crypto.timingSafeEqual(hash, derivedKey));
    });
  });
};
