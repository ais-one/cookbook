import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // audit_trigger_func()
  await knex.raw(`
    CREATE TRIGGER audit_users
      AFTER INSERT OR UPDATE ON users
      FOR EACH ROW EXECUTE FUNCTION audit_trigger_func()
  `);

  // enforce_append_only()
  // await knex.raw(`
  //   CREATE TRIGGER enforce_append_only_notifications
  //     BEFORE UPDATE OR DELETE ON notifications
  //     FOR EACH ROW EXECUTE FUNCTION enforce_append_only()
  // `);
}

export async function down(knex: Knex): Promise<void> {
  // await knex.raw(`DROP TRIGGER IF EXISTS enforce_append_only_notifications ON notifications`);
  await knex.raw(`DROP TRIGGER IF EXISTS audit_users ON users`);
}
