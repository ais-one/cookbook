let _tokenServiceName: string;
let _tokenServiceType: string;
let _userServiceName: string;
let _userServiceType: string;
// biome-ignore lint/suspicious/noExplicitAny: lookup returns the underlying store instance (knex or keyv)
let _lookup: ((name: string) => any) | null = null;

const { JWT_REFRESH_STORE_NAME = '' } = globalThis.__config.JWT;

const { AUTH_USER_STORE_NAME } = process.env;

const tokenStore = () => _lookup?.(_tokenServiceName); // knex or keyv instance for token storage
const knex = () => _lookup?.(_userServiceName); // knex instance for user table

/**
 * Wire up the backing stores.
 *   tokenServiceName — service name from SERVICES_CONFIG (e.g. 'keyv')
 *   userServiceName  — service name from SERVICES_CONFIG (e.g. 'knex1')
 *   lookup           — services.get — resolves a name to the underlying store instance
 */
// biome-ignore lint/suspicious/noExplicitAny: lookup returns different service instance types (knex, redis, keyv)
export const setup = (tokenServiceName: string, userServiceName: string, lookup: (name: string) => any) => {
  _tokenServiceName = tokenServiceName;
  _tokenServiceType = globalThis.__config?.SERVICES_CONFIG?.[tokenServiceName]?.type ?? 'keyv';
  _userServiceName = userServiceName;
  _userServiceType = globalThis.__config?.SERVICES_CONFIG?.[userServiceName]?.type ?? 'knex';
  _lookup = lookup;
};

/** Persist or replace a user's refresh token. Uses upsert for knex, set for keyv. */
export const setRefreshToken = async (id: string | number, refresh_token: string) => {
  if (_tokenServiceType === 'knex')
    await tokenStore()(JWT_REFRESH_STORE_NAME).insert({ id, refresh_token }).onConflict('id').merge();
  else await tokenStore().set(id, refresh_token);
};

/** Retrieve the stored refresh token for a user. */
export const getRefreshToken = async (id: string | number) => {
  if (_tokenServiceType === 'knex')
    return (await tokenStore()(JWT_REFRESH_STORE_NAME).where({ id }).first()).refresh_token;
  else return tokenStore().get(id);
};

/** Delete a user's refresh token, effectively invalidating their session. */
export const revokeRefreshToken = async (id: string | number) => {
  if (_tokenServiceType === 'knex') await tokenStore()(JWT_REFRESH_STORE_NAME).where({ id }).delete();
  else await tokenStore().delete(id);
};

/** Find a single user record matching the given fields. Returns null if not found. */
export const findUser = async (where: Record<string, unknown>) => {
  if (_userServiceType === 'knex') return knex()(AUTH_USER_STORE_NAME).where(where).first();
  return null;
};

/** Update fields on a user record matching the given fields. */
export const updateUser = async (where: Record<string, unknown>, payload: Record<string, unknown>) => {
  if (_userServiceType === 'knex') return knex()(AUTH_USER_STORE_NAME).where(where).update(payload);
};
