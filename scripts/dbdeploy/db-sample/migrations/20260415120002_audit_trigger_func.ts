import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    CREATE OR REPLACE FUNCTION audit_trigger_func()
    RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
    DECLARE
      changed TEXT[];
    BEGIN
      -- Compute which columns changed (UPDATE only)
      IF TG_OP = 'UPDATE' THEN
        SELECT array_agg(key) INTO changed
        FROM jsonb_each(row_to_json(NEW)::jsonb) n
        JOIN jsonb_each(row_to_json(OLD)::jsonb) o USING (key)
        WHERE n.value IS DISTINCT FROM o.value;
      END IF;

      INSERT INTO audit_log (
        table_name,
        operation,
        app_user_id,
        tenant_id,
        session_id,
        transaction_id,
        old_data,
        new_data,
        changed_fields
      ) VALUES (
        TG_TABLE_NAME,
        TG_OP,
        current_setting('app.current_user_id',   true),
        current_setting('app.current_tenant_id', true),
        current_setting('app.session_id',        true),
        nullif(current_setting('app.transaction_id', true), '')::uuid,
        CASE WHEN TG_OP = 'UPDATE' THEN row_to_json(OLD)::jsonb END,
        row_to_json(NEW)::jsonb,
        changed
      );

      RETURN NEW;
    END;
    $$
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`DROP FUNCTION IF EXISTS audit_trigger_func()`);
}
