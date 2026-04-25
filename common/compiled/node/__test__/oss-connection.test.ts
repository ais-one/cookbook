/**
 * OSS connection verification — run manually with credentials in .env.local
 *
 * Setup: create common/compiled/node/.env.local with:
 *   OSS_ACCESS_ID=<your-access-id>
 *   OSS_ACCESS_KEY=<your-access-key>
 *   OSS_REGION=<e.g. oss-ap-southeast-1>
 *   OSS_BUCKET=<your-bucket-name>
 *
 * Run: node --test --test-only __test__/oss-connection.test.ts
 */
import '../config.ts';
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { countBucketObjects, listObjects } from '../services/ali.ts';

const RUN_TEST = !!(process.env.OSS_ACCESS_ID && process.env.OSS_ACCESS_KEY && process.env.OSS_REGION);

describe('Alibaba OSS — connection', { skip: !RUN_TEST ? 'OSS env vars not set' : false }, () => {
  it('lists objects in bucket', async () => {
    const result = await listObjects({ maxKeys: 5 });
    assert.ok([200, 204].includes(result.status), `unexpected status: ${result.status} — ${result.statusMessage}`);
  });

  it('counts objects in bucket', async () => {
    const result = await countBucketObjects();
    assert.ok([200, 204].includes(result.status), `unexpected status: ${result.status}`);
  });
});
