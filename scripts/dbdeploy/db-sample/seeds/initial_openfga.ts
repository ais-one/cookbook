/**
 * OpenFGA seed — creates the store, writes the authorization model, and
 * populates initial relationship tuples that mirror the seed users in
 * initial_users.ts.
 *
 * Prerequisites
 * ─────────────
 * 1. OpenFGA server must be running and reachable (default: http://127.0.0.1:8080).
 *    Quick start: docker run -p 8080:8080 openfga/openfga run
 * 2. The `fga_config` table must exist (run migration 20260416000000_fga_config).
 *
 * What this seed does
 * ───────────────────
 * 1. Creates an OpenFGA store named "sample-app" (idempotent via label check).
 * 2. Writes an authorization model with types: user, role.
 * 3. Writes tuples that assign seed users to their roles:
 *      user:1  → role:TestGroup
 *      user:2  → role:TestGithub
 *      user:3  → role:TestGmail, role:TestGroup
 * 4. Saves store_id and auth_model_id to the fga_config table.
 *
 * Authorization model
 * ───────────────────
 * type user
 * type role
 *   relations
 *     define assignee: [user]
 */
import type { Knex } from 'knex';

const FGA_API_URL = process.env.FGA_API_URL || 'http://127.0.0.1:8080';

// ── helpers ──────────────────────────────────────────────────────────────────

const fgaFetch = async (path: string, method = 'GET', body?: unknown) => {
  const res = await fetch(`${FGA_API_URL}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    ...(body !== undefined && { body: JSON.stringify(body) }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenFGA ${method} ${path} → ${res.status}: ${text}`);
  }
  return res.json();
};

// ── authorization model DSL (JSON) ────────────────────────────────────────────

const AUTHORIZATION_MODEL = {
  schema_version: '1.1',
  type_definitions: [
    {
      type: 'user',
    },
    {
      type: 'role',
      relations: {
        assignee: {
          this: {},
        },
      },
      metadata: {
        relations: {
          assignee: {
            directly_related_user_types: [{ type: 'user' }],
          },
        },
      },
    },
  ],
};

// ── initial role assignments (mirrors initial_users.ts) ───────────────────────

const INITIAL_TUPLES = [
  { user: 'user:1', relation: 'assignee', object: 'role:TestGroup' },
  { user: 'user:2', relation: 'assignee', object: 'role:TestGithub' },
  { user: 'user:3', relation: 'assignee', object: 'role:TestGmail' },
  { user: 'user:3', relation: 'assignee', object: 'role:TestGroup' },
];

// ── seed ──────────────────────────────────────────────────────────────────────

export async function seed(knex: Knex): Promise<void> {
  // ── 1. Resolve or create the FGA store ──────────────────────────────────────
  let storeId: string;

  try {
    const { stores = [] } = (await fgaFetch('/stores?page_size=50')) as { stores: Array<{ id: string; name: string }> };
    const existing = stores.find(s => s.name === 'sample-app');

    if (existing) {
      storeId = existing.id;
      console.log(`OpenFGA: using existing store "${existing.name}" (${storeId})`);
    } else {
      const created = (await fgaFetch('/stores', 'POST', { name: 'sample-app' })) as { id: string };
      storeId = created.id;
      console.log(`OpenFGA: created store "sample-app" (${storeId})`);
    }
  } catch (err) {
    console.error('OpenFGA seed skipped — could not reach FGA server:', (err as Error).message);
    console.error('Start OpenFGA with: docker run -p 8080:8080 openfga/openfga run');
    return;
  }

  // ── 2. Write the authorization model ────────────────────────────────────────
  const { authorization_model_id: authModelId } = (await fgaFetch(
    `/stores/${storeId}/authorization-models`,
    'POST',
    AUTHORIZATION_MODEL,
  )) as { authorization_model_id: string };
  console.log(`OpenFGA: wrote authorization model (${authModelId})`);

  // ── 3. Write initial relationship tuples ────────────────────────────────────
  await fgaFetch(`/stores/${storeId}/write`, 'POST', {
    writes: { tuple_keys: INITIAL_TUPLES },
    authorization_model_id: authModelId,
  });
  console.log(`OpenFGA: wrote ${INITIAL_TUPLES.length} tuples`);

  // ── 4. Persist store_id + model_id to fga_config ───────────────────────────
  try {
    await knex('fga_config').where({ label: 'default' }).delete();
    await knex('fga_config').insert({
      store_id: storeId,
      auth_model_id: authModelId,
      label: 'default',
      api_url: FGA_API_URL,
      is_active: true,
    });
    console.log('OpenFGA: saved config to fga_config table');
  } catch (err) {
    // fga_config table may not exist in all environments; non-fatal
    console.warn('OpenFGA: could not write to fga_config table:', (err as Error).message);
  }
}
