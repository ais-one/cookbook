import type { CheckResult } from '../types.ts';

const WARN_THRESHOLD_MB = 400;
const FATAL_THRESHOLD_MB = 700;

/** Check Node.js heap usage. Returns degraded above 400 MB, unhealthy above 700 MB. */
export async function checkMemory(): Promise<CheckResult> {
  const { rss, heapUsed, heapTotal, external } = process.memoryUsage();

  const toMB = (b: number): number => Math.round(b / 1024 / 1024);
  const usedMB = toMB(heapUsed);
  const status = usedMB > FATAL_THRESHOLD_MB ? 'unhealthy' : usedMB > WARN_THRESHOLD_MB ? 'degraded' : 'ok';

  return {
    name: 'checkMemory',
    status,
    message: `Heap used: ${usedMB} MB`,
    meta: {
      heapUsedMB: usedMB,
      heapTotalMB: toMB(heapTotal),
      rssMB: toMB(rss),
      externalMB: toMB(external),
    },
  };
}
