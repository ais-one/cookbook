import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('hard_delete_log', table => {
    table.bigIncrements('id').primary();
    table.timestamp('deleted_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.text('table_name').notNullable();
    table.text('record_id').notNullable();
    table.text('deleted_by').notNullable();
    table.text('reason').notNullable();
    table.jsonb('deleted_data').notNullable();
  });

  // Indexes for common queries
  await knex.raw(`CREATE INDEX idx_hard_delete_table     ON hard_delete_log (table_name,  deleted_at DESC)`);
  await knex.raw(`CREATE INDEX idx_hard_delete_record    ON hard_delete_log (record_id,   deleted_at DESC)`);
  await knex.raw(`CREATE INDEX idx_hard_delete_deleted_by ON hard_delete_log (deleted_by, deleted_at DESC)`);

  // Only admin_role may insert; nobody may update or delete
  await knex.raw(`REVOKE ALL ON hard_delete_log FROM PUBLIC`);

  // Dedicated admin role (idempotent via DO block)
  await knex.raw(`
    DO $$ BEGIN
      IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'admin_role') THEN
        CREATE ROLE admin_role;
      END IF;
    END $$
  `);
  await knex.raw(`GRANT INSERT ON hard_delete_log TO admin_role`);

  // Dedicated read-only role for auditors (idempotent via DO block)
  await knex.raw(`
    DO $$ BEGIN
      IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'audit_reader') THEN
        CREATE ROLE audit_reader;
      END IF;
    END $$
  `);
  await knex.raw(`GRANT SELECT ON hard_delete_log TO audit_reader`);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`REVOKE INSERT ON hard_delete_log FROM admin_role`);
  await knex.raw(`REVOKE SELECT ON hard_delete_log FROM audit_reader`);
  await knex.schema.dropTableIfExists('hard_delete_log');
}
