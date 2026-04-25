import type { CheckResult } from '../types.ts';

/** Placeholder database health check. Replace the body with a real query. */
export async function checkDatabase(): Promise<CheckResult> {
  // await db.raw('SELECT 1');
  return {
    name: 'checkDatabase',
    status: 'ok',
    message: 'Database reachable',
  };
}
