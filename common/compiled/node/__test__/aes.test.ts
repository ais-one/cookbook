import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { decryptText, encryptText, genIv, genKey } from '../utils/aes.ts';

describe('utils/aes.ts', () => {
  const algorithm = 'aes256';
  const password = 'test-password';
  const plaintext = 'Hello, AES!';

  it('should generate a valid IV (16 bytes)', () => {
    const iv = genIv();
    assert.ok(Buffer.isBuffer(iv));
    assert.strictEqual(iv.length, 16);
  });

  it('should derive a 256 bit key from password', () => {
    const key = genKey(algorithm, password);
    assert.ok(Buffer.isBuffer(key));
    assert.strictEqual(key.length, 32);
  });

  it('should derive a 128 bit key from password', () => {
    const key = genKey('sha128', password);
    assert.ok(Buffer.isBuffer(key));
    assert.strictEqual(key.length, 16);
  });

  it('should encrypt and decrypt text correctly', () => {
    const iv = genIv();
    const key = genKey(algorithm, password);

    const encrypted = encryptText(algorithm, key, iv, plaintext);
    assert.ok(typeof encrypted === 'string');

    const decrypted = decryptText(algorithm, key, iv, encrypted);
    assert.strictEqual(decrypted, plaintext);
  });
});
