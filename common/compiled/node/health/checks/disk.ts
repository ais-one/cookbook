import { statfs } from 'node:fs/promises';
import type { CheckResult } from '../types.ts';

const WARN_THRESHOLD = 0.8;
const FATAL_THRESHOLD = 0.95;

/** Check disk usage on the root filesystem. Returns degraded above 80%, unhealthy above 95%. */
export async function checkDisk(): Promise<CheckResult> {
  const { bsize, blocks, bfree } = await statfs('/');

  const total = blocks * bsize;
  const free = bfree * bsize;
  const usedPct = (total - free) / total;

  const toGB = (b: number): string => (b / 1024 ** 3).toFixed(1);
  const status = usedPct > FATAL_THRESHOLD ? 'unhealthy' : usedPct > WARN_THRESHOLD ? 'degraded' : 'ok';

  return {
    name: 'checkDisk',
    status,
    message: `Disk used: ${(usedPct * 100).toFixed(1)}%`,
    meta: {
      totalGB: toGB(total),
      freeGB: toGB(free),
      usedPct: `${(usedPct * 100).toFixed(1)}%`,
    },
  };
}
