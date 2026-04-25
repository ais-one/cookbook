import { generateKeyPairSync, randomUUID } from 'node:crypto';

import type { KeyEntry } from './types.ts';

const keys = new Map<string, KeyEntry>();
let currentKid: string | null = null;

const generateKey = (): string => {
  const { privateKey, publicKey } = generateKeyPairSync('ec', {
    namedCurve: 'P-256',
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  });

  const kid = randomUUID();
  keys.set(kid, { kid, privateKey, publicKey, createdAt: new Date() });
  currentKid = kid;
  return kid;
};

/**
 * Generate a new EC P-256 key pair, set it as the active signing key,
 * and prune key pairs older than 2 hours.
 * Returns the new kid.
 */
export const rotateKey = (): string => {
  const newKid = generateKey();

  const cutoff = Date.now() - 2 * 60 * 60 * 1000;
  for (const [kid, key] of keys.entries()) {
    if (kid !== newKid && key.createdAt.getTime() < cutoff) {
      keys.delete(kid);
    }
  }

  return newKid;
};

// generate initial key on startup
generateKey();

/** Returns the PEM-encoded private key for the current active kid. */
export const getPrivateKey = (): string => {
  const entry = currentKid ? keys.get(currentKid) : undefined;
  if (!entry) throw new Error('keystore: no active key');
  return entry.privateKey;
};

/** Returns the PEM-encoded public key for the current active kid. */
export const getPublicKey = (): string => {
  const entry = currentKid ? keys.get(currentKid) : undefined;
  if (!entry) throw new Error('keystore: no active key');
  return entry.publicKey;
};

/** Returns the current active key ID (kid). */
export const getKid = (): string => {
  if (!currentKid) throw new Error('keystore: no active key');
  return currentKid;
};

/** Returns all stored public keys as `{ kid, publicKey }` entries (for JWKS). */
export const getAllPublicKeys = (): Array<{ kid: string; publicKey: string }> =>
  [...keys.values()].map(k => ({ kid: k.kid, publicKey: k.publicKey }));
