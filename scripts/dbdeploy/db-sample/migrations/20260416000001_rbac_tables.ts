/**
 * RBAC tables — tenant-scoped roles and permissions.
 *
 * Schema:
 *   tenants           — registered tenants
 *   roles             — named roles, each scoped to a tenant
 *   permissions       — global permission strings (e.g. "users:read")
 *   role_permissions  — M:N join: which permissions belong to a role
 *   user_tenant_roles — M:N:N join: which roles a user holds within a tenant
 */
import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('tenants', t => {
    t.increments('id').primary();
    t.string('name', 100).notNullable();
    t.string('slug', 100).notNullable();
    t.string('plan', 50).nullable();
    t.boolean('is_active').notNullable().defaultTo(true);
    t.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    t.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    t.unique(['slug']);
  });

  await knex.schema.createTable('roles', t => {
    t.increments('id').primary();
    t.integer('tenant_id').unsigned().notNullable().references('id').inTable('tenants').onDelete('CASCADE');
    t.string('name', 100).notNullable();
    t.string('description', 255);
    t.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    t.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    t.unique(['tenant_id', 'name']);
  });

  await knex.schema.createTable('permissions', t => {
    t.increments('id').primary();
    // Dot-namespaced strings e.g. "users:read", "reports:export"
    t.string('name', 100).notNullable();
    t.string('description', 255);
    t.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    t.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    t.unique(['name']);
  });

  await knex.schema.createTable('role_permissions', t => {
    t.integer('role_id').unsigned().notNullable().references('id').inTable('roles').onDelete('CASCADE');
    t.integer('permission_id').unsigned().notNullable().references('id').inTable('permissions').onDelete('CASCADE');
    t.primary(['role_id', 'permission_id']);
  });

  // Composite join: which roles a user holds within a specific tenant.
  // A user can hold multiple roles in the same tenant.
  await knex.schema.createTable('user_tenant_roles', t => {
    t.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
    t.integer('tenant_id').unsigned().notNullable().references('id').inTable('tenants').onDelete('CASCADE');
    t.integer('role_id').unsigned().notNullable().references('id').inTable('roles').onDelete('CASCADE');
    t.primary(['user_id', 'tenant_id', 'role_id']);
    t.index(['user_id', 'tenant_id']); // primary lookup pattern at token creation time
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('user_tenant_roles');
  await knex.schema.dropTableIfExists('role_permissions');
  await knex.schema.dropTableIfExists('permissions');
  await knex.schema.dropTableIfExists('roles');
  await knex.schema.dropTableIfExists('tenants');
}
