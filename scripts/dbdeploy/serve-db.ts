import { PGlite } from '@electric-sql/pglite';
import { PGLiteSocketServer } from '@electric-sql/pglite-socket';

const db = new PGlite('./db-sample/dev.db');
const server = new PGLiteSocketServer({
  db,
  port: 5432,
  host: '127.0.0.1',
});

await server.start();

process.on('SIGINT', async () => {
  await server.stop();
  await db.close();
  process.exit(0);
});
