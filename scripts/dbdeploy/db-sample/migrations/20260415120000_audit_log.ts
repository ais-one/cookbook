import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('audit_log', table => {
    table.bigIncrements('id').primary();
    table.timestamp('changed_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.text('table_name').notNullable();
    table.text('operation').notNullable();

    // Application-layer identity (injected via SET LOCAL)
    table.text('app_user_id');
    table.text('tenant_id');
    table.text('session_id');
    table.uuid('transaction_id');

    // Database-layer identity
    table.text('db_user').notNullable().defaultTo(knex.raw('session_user'));
    table.specificType('ip_addr', 'INET').defaultTo(knex.raw('inet_client_addr()'));
    table.text('app_name').defaultTo(knex.raw("current_setting('application_name', true)"));

    // Change data
    table.jsonb('old_data');
    table.jsonb('new_data');
    table.specificType('changed_fields', 'TEXT[]');
  });

  await knex.raw(
    `ALTER TABLE audit_log ADD CONSTRAINT chk_audit_log_operation CHECK (operation IN ('INSERT', 'UPDATE'))`,
  );

  // Indexes for common audit queries (changed_at DESC matches query patterns)
  await knex.raw(`CREATE INDEX idx_audit_user        ON audit_log (app_user_id,   changed_at DESC)`);
  await knex.raw(`CREATE INDEX idx_audit_table       ON audit_log (table_name,    changed_at DESC)`);
  await knex.raw(`CREATE INDEX idx_audit_tenant      ON audit_log (tenant_id,     changed_at DESC)`);
  await knex.raw(`CREATE INDEX idx_audit_transaction ON audit_log (transaction_id)`);

  // Append-only: revoke mutating permissions from all application roles
  await knex.raw(`REVOKE UPDATE, DELETE ON audit_log FROM PUBLIC`);
  await knex.raw(`REVOKE UPDATE, DELETE ON audit_log FROM api_role`);

  // Dedicated read-only role for auditors (idempotent via DO block)
  await knex.raw(`
    DO $$ BEGIN
      IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'audit_reader') THEN
        CREATE ROLE audit_reader;
      END IF;
    END $$
  `);
  await knex.raw(`GRANT SELECT ON audit_log TO audit_reader`);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`REVOKE SELECT ON audit_log FROM audit_reader`);
  await knex.schema.dropTableIfExists('audit_log');
}
