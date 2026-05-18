import { PGlite } from '@electric-sql/pglite';
import { PGLiteSocketServer } from '@electric-sql/pglite-socket';

const dbSample = new PGlite('./db-sample/dev.db');
const serverSample = new PGLiteSocketServer({
  db: dbSample,
  port: 5432,
  host: '127.0.0.1',
});

const dbIam = new PGlite('./db-iam/dev.db');
const serverIam = new PGLiteSocketServer({
  db: dbIam,
  port: 5433,
  host: '127.0.0.1',
});

await serverSample.start();
console.log('[serve-db] db-sample listening on 127.0.0.1:5432');

await serverIam.start();
console.log('[serve-db] db-iam    listening on 127.0.0.1:5433');

process.on('SIGINT', async () => {
  await serverSample.stop();
  await dbSample.close();
  await serverIam.stop();
  await dbIam.close();
  process.exit(0);
});
