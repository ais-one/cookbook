/**
 * Identity & User Management migration.
 *
 * Covers: users, credentials, TOTP MFA, SMS/email OTP challenges,
 * federated identities (OAuth2/OIDC/SAML), JWT sessions with RSA key
 * rotation, RBAC roles, and an append-only auth audit log.
 *
 * Primary DB: PostgreSQL
 * Secondary DB: MySQL
 * CHECK constraints and foreign keys are parsed but not enforced by
 * default (run `PRAGMA foreign_keys = ON` at connection open).
 */
import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  const isPg = knex.client.config.client === 'postgresql' || knex.client.config.client === 'pg';

  // ── users ─────────────────────────────────────────────────────────────────
  await knex.schema.createTable('users', t => {
    t.uuid('id').primary().defaultTo(knex.fn.uuid());
    t.string('username', 50).unique().nullable();
    t.string('email', 255).unique().nullable();
    t.timestamp('email_verified_at', { useTz: true }).nullable();
    t.string('phone', 20).unique().nullable(); // E.164 format
    t.timestamp('phone_verified_at', { useTz: true }).nullable();
    t.string('display_name', 100).nullable();
    t.text('avatar_url').nullable();
    t.string('status', 20).notNullable().defaultTo('pending'); // pending|active|suspended|deleted
    t.string('locale', 10).notNullable().defaultTo('en');
    t.string('timezone', 50).nullable();
    t.json('metadata').notNullable().defaultTo('{}');
    t.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    t.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    t.timestamp('deleted_at', { useTz: true }).nullable();
    t.index(['status']);
  });

  // ── user_credentials ──────────────────────────────────────────────────────
  await knex.schema.createTable('user_credentials', t => {
    t.uuid('id').primary().defaultTo(knex.fn.uuid());
    t.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    t.string('credential_type', 20).notNullable().defaultTo('password'); // password|passkey
    t.text('credential_hash').notNullable(); // argon2id / bcrypt output
    t.boolean('must_change').notNullable().defaultTo(false);
    t.timestamp('last_changed_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    t.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    t.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    t.unique(['user_id', 'credential_type']);
  });

  // ── user_mfa_totp ─────────────────────────────────────────────────────────
  await knex.schema.createTable('user_mfa_totp', t => {
    t.uuid('id').primary().defaultTo(knex.fn.uuid());
    t.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    t.string('label', 100).nullable(); // shown in authenticator app
    t.text('secret_encrypted').notNullable(); // app-layer encrypted base32 secret
    t.string('algorithm', 10).notNullable().defaultTo('SHA1'); // SHA1|SHA256|SHA512
    t.integer('digits').notNullable().defaultTo(6); // 6 or 8
    t.integer('period').notNullable().defaultTo(30); // seconds
    t.boolean('is_active').notNullable().defaultTo(false); // false until first verify
    t.timestamp('verified_at', { useTz: true }).nullable();
    t.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    t.index(['user_id']);
  });

  // ── user_mfa_recovery_codes ───────────────────────────────────────────────
  await knex.schema.createTable('user_mfa_recovery_codes', t => {
    t.uuid('id').primary().defaultTo(knex.fn.uuid());
    t.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    t.text('code_hash').notNullable(); // hashed backup code
    t.timestamp('used_at', { useTz: true }).nullable();
    t.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    t.index(['user_id']);
  });

  // ── user_otp_challenges ───────────────────────────────────────────────────
  await knex.schema.createTable('user_otp_challenges', t => {
    t.uuid('id').primary().defaultTo(knex.fn.uuid());
    t.uuid('user_id').nullable().references('id').inTable('users').onDelete('CASCADE'); // nullable for pre-signup flows
    t.string('channel', 10).notNullable(); // sms|email
    t.text('recipient').notNullable(); // phone (E.164) or email
    t.string('purpose', 30).notNullable(); // login|register|verify_email|verify_phone|password_reset|mfa|transaction
    t.text('code_hash').notNullable(); // hashed PIN — never store plaintext
    t.integer('attempts').notNullable().defaultTo(0);
    t.integer('max_attempts').notNullable().defaultTo(5);
    t.string('ip_address', 45).nullable(); // IPv4 or IPv6 as string
    t.timestamp('expires_at', { useTz: true }).notNullable();
    t.timestamp('used_at', { useTz: true }).nullable();
    t.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    t.index(['expires_at']);
  });

  // ── user_federated_identities ─────────────────────────────────────────────
  await knex.schema.createTable('user_federated_identities', t => {
    t.uuid('id').primary().defaultTo(knex.fn.uuid());
    t.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    t.string('provider', 80).notNullable(); // google|github|microsoft|apple|saml:<entity>
    t.string('provider_user_id', 255).notNullable(); // stable ID from provider
    t.string('provider_email', 255).nullable();
    t.string('provider_display_name', 100).nullable();
    t.text('access_token_encrypted').nullable(); // optional; encrypted at app layer
    t.text('refresh_token_encrypted').nullable(); // optional; encrypted at app layer
    t.timestamp('token_expires_at', { useTz: true }).nullable();
    t.json('scopes').notNullable().defaultTo('[]'); // granted OAuth scopes
    t.json('metadata').notNullable().defaultTo('{}'); // raw provider claims
    t.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    t.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    t.unique(['provider', 'provider_user_id']);
    t.index(['user_id']);
  });

  // ── rsa_signing_keys ──────────────────────────────────────────────────────
  // id is referenced by user_sessions, so create it first
  await knex.schema.createTable('rsa_signing_keys', t => {
    t.uuid('id').primary().defaultTo(knex.fn.uuid());
    t.string('kid', 64).unique().notNullable(); // JWT `kid` header value
    t.string('algorithm', 10).notNullable().defaultTo('RS256'); // RS256|RS384|RS512
    t.string('key_use', 5).notNullable().defaultTo('sig'); // sig|enc
    t.text('public_key_pem').notNullable(); // PEM — safe to expose in JWKS endpoint
    t.text('private_key_encrypted').notNullable(); // app-layer encrypted PEM
    t.integer('key_size_bits').notNullable().defaultTo(2048); // 2048|3072|4096
    t.boolean('is_active').notNullable().defaultTo(true);
    t.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    t.timestamp('valid_from', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    t.timestamp('valid_until', { useTz: true }).nullable(); // stop signing after this
    t.timestamp('rotated_at', { useTz: true }).nullable(); // when a newer key took over
    t.timestamp('revoked_at', { useTz: true }).nullable(); // hard revoke
    t.index(['is_active']);
  });

  // ── user_sessions ─────────────────────────────────────────────────────────
  // id == JWT JTI claim; look up on every token verification to check revocation
  await knex.schema.createTable('user_sessions', t => {
    t.uuid('id').primary(); // set by app = JTI claim in JWT
    t.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    t.uuid('signing_key_id').notNullable().references('id').inTable('rsa_signing_keys');
    t.text('refresh_token_hash').nullable(); // hashed refresh token
    t.timestamp('refresh_expires_at', { useTz: true }).nullable();
    t.string('ip_address', 45).nullable();
    t.text('user_agent').nullable();
    t.string('device_id', 64).nullable(); // client-supplied stable device ID
    t.timestamp('issued_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    t.timestamp('expires_at', { useTz: true }).notNullable();
    t.timestamp('last_active_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    t.timestamp('revoked_at', { useTz: true }).nullable();
    t.string('revoke_reason', 30).nullable(); // logout|admin|password_change|mfa_change|suspicious|expired
    t.index(['user_id']);
    t.index(['expires_at']);
  });

  // ── roles ─────────────────────────────────────────────────────────────────
  await knex.schema.createTable('roles', t => {
    t.uuid('id').primary().defaultTo(knex.fn.uuid());
    t.string('name', 50).unique().notNullable();
    t.text('description').nullable();
    t.json('permissions').notNullable().defaultTo('[]'); // ["resource:action", ...]
    t.boolean('is_system').notNullable().defaultTo(false);
    t.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    t.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
  });

  await knex('roles').insert([
    { name: 'superadmin', description: 'Full access', permissions: JSON.stringify(['*:*']), is_system: true },
    { name: 'admin', description: 'Administrative access', permissions: JSON.stringify(['admin:*']), is_system: true },
    {
      name: 'user',
      description: 'Standard user',
      permissions: JSON.stringify(['profile:read', 'profile:write']),
      is_system: true,
    },
  ]);

  // ── user_roles ────────────────────────────────────────────────────────────
  await knex.schema.createTable('user_roles', t => {
    t.uuid('id').primary().defaultTo(knex.fn.uuid());
    t.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    t.uuid('role_id').notNullable().references('id').inTable('roles').onDelete('RESTRICT');
    t.uuid('granted_by').nullable().references('id').inTable('users').onDelete('SET NULL');
    t.timestamp('granted_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    t.timestamp('expires_at', { useTz: true }).nullable(); // null = permanent
    t.unique(['user_id', 'role_id']);
    t.index(['user_id']);
  });

  // ── auth_audit_log ────────────────────────────────────────────────────────
  await knex.schema.createTable('auth_audit_log', t => {
    t.bigIncrements('id').primary();
    t.uuid('user_id').nullable().references('id').inTable('users').onDelete('SET NULL');
    t.uuid('actor_id').nullable().references('id').inTable('users').onDelete('SET NULL');
    t.string('event_type', 50).notNullable(); // e.g. auth.login.success
    t.string('channel', 20).nullable(); // password|totp|sms|email|oauth|saml|system
    t.string('provider', 80).nullable(); // for federation events
    t.uuid('session_id').nullable().references('id').inTable('user_sessions').onDelete('SET NULL');
    t.string('ip_address', 45).nullable();
    t.text('user_agent').nullable();
    t.json('metadata').notNullable().defaultTo('{}');
    t.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    t.index(['user_id', 'created_at']);
    t.index(['event_type', 'created_at']);
    t.index(['created_at']);
  });

  void isPg; // used for dialect detection; suppress unused variable warning
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('auth_audit_log');
  await knex.schema.dropTableIfExists('user_roles');
  await knex.schema.dropTableIfExists('roles');
  await knex.schema.dropTableIfExists('user_sessions');
  await knex.schema.dropTableIfExists('rsa_signing_keys');
  await knex.schema.dropTableIfExists('user_federated_identities');
  await knex.schema.dropTableIfExists('user_otp_challenges');
  await knex.schema.dropTableIfExists('user_mfa_recovery_codes');
  await knex.schema.dropTableIfExists('user_mfa_totp');
  await knex.schema.dropTableIfExists('user_credentials');
  await knex.schema.dropTableIfExists('users');
}
