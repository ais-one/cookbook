/**
 * OpenFGA client wrapper for fine-grained authorization.
 *
 * Wraps @openfga/sdk to provide:
 *  - Role listing at token creation time (replaces DB roles column)
 *  - Per-request permission checks for route-level authorization
 *  - Tuple management (write / delete) for admin operations
 *
 * Authorization model used here:
 *   type  user    — principals
 *   type  role    — named roles; relation "assignee" links users to roles
 *
 * Tuple examples:
 *   { user: 'user:1', relation: 'assignee', object: 'role:admin' }
 *   { user: 'user:1', relation: 'assignee', object: 'role:viewer' }
 *
 * Usage:
 *   import * as fga from '@common/node/auth/openfga.ts';
 *   fga.setup({ apiUrl, storeId, authorizationModelId });
 *
 *   // In createToken — fetch roles from FGA instead of DB column
 *   const roles = await fga.listUserRoles(userId);
 *
 *   // In a route — fine-grained object check
 *   router.delete('/docs/:id', authUser, fga.requireFga('owner', req => `document:${req.params.id}`), handler);
 */

import { OpenFgaClient } from '@openfga/sdk';

/** @type {OpenFgaClient | null} */
let fgaClient = null;

/**
 * Initialise the FGA client. Call once during app startup (e.g. from auth setup).
 *
 * @param {{ apiUrl: string, storeId: string, authorizationModelId?: string }} config
 */
const setup = config => {
  if (!config?.apiUrl || !config?.storeId) return;
  fgaClient = new OpenFgaClient({
    apiUrl: config.apiUrl,
    storeId: config.storeId,
    ...(config.authorizationModelId && { authorizationModelId: config.authorizationModelId }),
  });
};

/**
 * List all roles assigned to a user via the `assignee` relation on type `role`.
 * Returns an empty array when FGA is not configured or if the call fails.
 *
 * @param {string|number} userId
 * @returns {Promise<string[]>} role names without the `role:` prefix
 */
const listUserRoles = async userId => {
  if (!fgaClient) return [];
  try {
    const { objects } = await fgaClient.listObjects({
      user: `user:${userId}`,
      relation: 'assignee',
      type: 'role',
    });
    return objects.map(obj => obj.replace('role:', ''));
  } catch (err) {
    logger.error({ err, userId }, 'fga: listUserRoles failed');
    return [];
  }
};

/**
 * Check whether a user has a specific relation on an object.
 *
 * @param {string|number} userId
 * @param {string} relation
 * @param {string} object - fully-qualified FGA object, e.g. `role:admin` or `document:42`
 * @returns {Promise<boolean>}
 */
const check = async (userId, relation, object) => {
  if (!fgaClient) return false;
  try {
    const { allowed } = await fgaClient.check({
      user: `user:${userId}`,
      relation,
      object,
    });
    return allowed ?? false;
  } catch (err) {
    logger.error({ err, userId, relation, object }, 'fga: check failed');
    return false;
  }
};

/**
 * Write a relationship tuple to the FGA store.
 *
 * @param {string} user   - e.g. `user:1`
 * @param {string} relation
 * @param {string} object - e.g. `role:admin`
 */
const writeTuple = async (user, relation, object) => {
  if (!fgaClient) throw new Error('OpenFGA client not initialised');
  await fgaClient.write({ writes: [{ user, relation, object }] });
};

/**
 * Delete a relationship tuple from the FGA store.
 *
 * @param {string} user
 * @param {string} relation
 * @param {string} object
 */
const deleteTuple = async (user, relation, object) => {
  if (!fgaClient) throw new Error('OpenFGA client not initialised');
  await fgaClient.write({ deletes: [{ user, relation, object }] });
};

/**
 * Express middleware factory — performs an OpenFGA `check` for the authenticated user.
 * Must be used after `authUser` so that `req.user.sub` is available.
 *
 * @param {string} relation
 * @param {string | ((req: import('express').Request) => string)} objectFn
 *   A fixed FGA object string OR a function that derives it from the request.
 * @returns {import('express').RequestHandler}
 *
 * @example
 * // Anyone with 'reader' relation on the specific document
 * router.get('/docs/:id', authUser, requireFga('reader', req => `document:${req.params.id}`), handler);
 *
 * @example
 * // Anyone assigned to the 'admin' role
 * router.delete('/users/:id', authUser, requireFga('assignee', 'role:admin'), handler);
 */
const requireFga = (relation, objectFn) => async (req, res, next) => {
  const userId = req.user?.sub;
  if (!userId) return res.status(401).json({ error: 'Not authenticated' });
  const object = typeof objectFn === 'function' ? objectFn(req) : objectFn;
  const allowed = await check(userId, relation, object);
  if (!allowed) {
    logger.warn({ userId, relation, object }, 'fga: access denied');
    return res.status(403).json({ error: 'Access denied' });
  }
  return next();
};

export { check, deleteTuple, listUserRoles, requireFga, setup, writeTuple };
