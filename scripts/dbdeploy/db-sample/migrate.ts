import { resolve } from 'node:path';
import { PGlite } from '@electric-sql/pglite';
import { drizzle } from 'drizzle-orm/pglite';
import { migrate } from 'drizzle-orm/pglite/migrator';

async function main() {
  const client = new PGlite('./db-sample/dev.db');
  const db = drizzle(client);

  const migrationFolder = resolve(process.cwd(), 'db-sample/drizzle');

  await migrate(db, { migrationsFolder: migrationFolder });

  console.log('Migrations complete.');
  process.exit(0);
}

main().catch(err => {
  console.error('Migration failed.');
  console.error(err);
  process.exit(1);
});
