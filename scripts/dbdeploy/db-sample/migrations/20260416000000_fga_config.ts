/**
 * OpenFGA configuration table.
 *
 * Stores the OpenFGA store ID and the active authorization model ID so the
 * application knows which store/model to use at runtime without hard-coding
 * them in environment variables (though env vars remain the recommended
 * approach for secrets and production config).
 *
 * OpenFGA manages its own internal tables separately — this table is purely
 * an application-layer pointer to the FGA store.
 */
import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('fga_config', t => {
    t.increments('id').primary();
    // The OpenFGA store ID returned by POST /stores
    t.string('store_id', 64).notNullable();
    // The authorization model ID returned by POST /stores/{storeId}/authorization-models
    t.string('auth_model_id', 64).notNullable();
    // Human-readable label — e.g. 'default', 'tenant-acme'
    t.string('label', 80).notNullable().defaultTo('default');
    // The FGA server URL this config points to
    t.string('api_url', 255).notNullable().defaultTo('http://127.0.0.1:8080');
    t.boolean('is_active').notNullable().defaultTo(true);
    t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    t.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

    t.index(['is_active']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('fga_config');
}
