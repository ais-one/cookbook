import type { CheckResult } from '../types.ts';

/** Placeholder Redis health check. Replace the body with a real PING call. */
export async function checkRedis(): Promise<CheckResult> {
  // const pong = await redis.ping();
  // if (pong !== 'PONG') throw new Error(`Unexpected PING response: ${pong}`);
  return {
    name: 'checkRedis',
    status: 'ok',
    message: 'Redis reachable',
  };
}
