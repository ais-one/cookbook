// Update with your config settings.

import type { Knex } from 'knex';
import ClientPgLite from 'knex-pglite';

const config: Record<string, Knex.Config> = {
  development: {
    client: ClientPgLite,
    dialect: 'postgres',
    connection: { connectionString: './dev.db' },
  },

  staging: {
    client: 'mysql', // postgresql
    connection: {
      database: 'my_db',
      user: 'username',
      password: 'password',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },
  production: {
    // information for this should be from a secrets file or env
  },
};

export default config;
