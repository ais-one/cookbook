/**
 * AWS S3 connection verification — run manually with credentials in .env.local
 *
 * Setup: add to common/compiled/node/.env.local:
 *   AWS_ACCESS_ID=<your-access-key-id>
 *   AWS_ACCESS_KEY=<your-secret-access-key>
 *   AWS_REGION=<e.g. ap-southeast-1>
 *   AWS_BUCKET=<your-bucket-name>
 *
 * Run: node --test __test__/aws-connection.test.ts
 */
import '../config.ts';
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { countBucketObjects, listObjects } from '../services/aws.ts';

const RUN_TEST = !!(process.env.AWS_ACCESS_ID && process.env.AWS_ACCESS_KEY && process.env.AWS_REGION);

describe('AWS S3 — connection', { skip: !RUN_TEST ? 'AWS env vars not set' : false }, () => {
  it('lists objects in bucket', async () => {
    const result = await listObjects({ maxKeys: 5 });
    assert.ok([200, 204].includes(result.status), `unexpected status: ${result.status} — ${result.statusMessage}`);
  });

  it('counts objects in bucket', async () => {
    const result = await countBucketObjects();
    assert.ok([200, 204].includes(result.status), `unexpected status: ${result.status}`);
  });
});
