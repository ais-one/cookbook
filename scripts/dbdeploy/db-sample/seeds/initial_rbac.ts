/**
 * RBAC seed — populates tenants, roles, permissions and user-role assignments
 * that mirror the seed users in initial_users.ts.
 *
 * Prerequisites
 * ─────────────
 * 1. The RBAC tables must exist (run migration 20260416000001_rbac_tables).
 * 2. The users table must already be populated (run initial_users seed first).
 *
 * What this seed does
 * ───────────────────
 * 1. Creates one tenant: "Default" (id=1, slug="default").
 * 2. Creates four permissions:
 *      users:read, users:write, reports:read, reports:export
 * 3. Creates three roles scoped to tenant 1:
 *      TestGroup   — users:read, reports:read
 *      TestGithub  — users:read
 *      TestGmail   — users:read, reports:read, reports:export
 * 4. Assigns roles to seed users (mirrors initial_users.ts and initial_openfga.ts):
 *      user:1 → TestGroup
 *      user:2 → TestGithub
 *      user:3 → TestGmail, TestGroup
 */
import type { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // ── 1. Clean up in reverse FK order ────────────────────────────────────────
  await knex('user_tenant_roles').del();
  await knex('role_permissions').del();
  await knex('roles').del();
  await knex('permissions').del();
  await knex('tenants').del();

  // ── 2. Tenants ──────────────────────────────────────────────────────────────
  await knex('tenants').insert([{ id: 1, name: 'Default', slug: 'default', is_active: true }]);

  // ── 3. Permissions (global, not scoped to a tenant) ─────────────────────────
  await knex('permissions').insert([
    { id: 1, name: 'users:read', description: 'Read user records' },
    { id: 2, name: 'users:write', description: 'Create and update users' },
    { id: 3, name: 'reports:read', description: 'View reports' },
    { id: 4, name: 'reports:export', description: 'Export report data' },
  ]);

  // ── 4. Roles (scoped to tenant 1) ───────────────────────────────────────────
  await knex('roles').insert([
    { id: 1, tenant_id: 1, name: 'TestGroup', description: 'Standard group role' },
    { id: 2, tenant_id: 1, name: 'TestGithub', description: 'GitHub SSO users' },
    { id: 3, tenant_id: 1, name: 'TestGmail', description: 'Gmail SSO users' },
  ]);

  // ── 5. Role → permission grants ─────────────────────────────────────────────
  await knex('role_permissions').insert([
    // TestGroup: read users and reports
    { role_id: 1, permission_id: 1 },
    { role_id: 1, permission_id: 3 },
    // TestGithub: read users only
    { role_id: 2, permission_id: 1 },
    // TestGmail: read users and reports, plus export
    { role_id: 3, permission_id: 1 },
    { role_id: 3, permission_id: 3 },
    { role_id: 3, permission_id: 4 },
  ]);

  // ── 6. User → tenant → role assignments ────────────────────────────────────
  await knex('user_tenant_roles').insert([
    { user_id: 1, tenant_id: 1, role_id: 1 }, // user:1  → TestGroup
    { user_id: 2, tenant_id: 1, role_id: 2 }, // user:2  → TestGithub
    { user_id: 3, tenant_id: 1, role_id: 3 }, // user:3  → TestGmail
    { user_id: 3, tenant_id: 1, role_id: 1 }, // user:3  → TestGroup
  ]);

  console.log('RBAC: seeded 1 tenant, 4 permissions, 3 roles, 4 user-role assignments');
}
