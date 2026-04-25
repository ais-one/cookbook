import type { Request, Response } from 'express';
import { checkDisk } from './checks/disk.ts';
import { checkMemory } from './checks/memory.ts';
import type { CheckResult, CheckStatus } from './types.ts';

const VERSION = process.env.npm_package_version ?? '0.0.0';
const SERVICE = process.env.npm_package_name ?? 'api';
const START_AT = Date.now();

type CheckFn = () => Promise<CheckResult>;

/**
 * GET /health
 * Lightweight liveness probe — no external checks.
 * Use this for load balancer / k8s liveness probes.
 */
export async function liveness(_req: Request, res: Response): Promise<void> {
  res.status(200).json({
    status: 'ok',
    service: SERVICE,
    version: VERSION,
    uptime: getUptime(),
  });
}

/**
 * GET /health/ready
 * Full readiness probe — checks all dependencies.
 * Use this for k8s readiness probes and monitoring dashboards.
 */
export async function readiness(_req: Request, res: Response): Promise<void> {
  const checks = await runChecks([checkDisk, checkMemory]);

  const degraded = checks.some(c => c.status === 'degraded');
  const unhealthy = checks.some(c => c.status === 'unhealthy');
  const overall: CheckStatus = unhealthy ? 'unhealthy' : degraded ? 'degraded' : 'ok';
  const statusCode = unhealthy ? 503 : degraded ? 207 : 200;

  res.status(statusCode).json({
    status: overall,
    service: SERVICE,
    version: VERSION,
    uptime: getUptime(),
    timestamp: new Date().toISOString(),
    checks: formatChecks(checks),
  });
}

// ─── Runner ───────────────────────────────────────────────────────────────────

async function runChecks(fns: CheckFn[]): Promise<(CheckResult & { latencyMs: number })[]> {
  return Promise.all(
    fns.map(async fn => {
      const start = Date.now();
      try {
        const result = await Promise.race([fn(), timeout(5_000, fn.name)]);
        return { ...result, latencyMs: Date.now() - start };
      } catch (err) {
        return {
          name: fn.name,
          status: 'unhealthy' as CheckStatus,
          message: (err as Error).message,
          latencyMs: Date.now() - start,
        };
      }
    }),
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatChecks(checks: (CheckResult & { latencyMs: number })[]): Record<string, unknown> {
  return Object.fromEntries(
    checks.map(({ name, status, message, latencyMs, meta }) => [
      name,
      { status, message, latencyMs, ...(meta && { meta }) },
    ]),
  );
}

function getUptime(): string {
  const ms = Date.now() - START_AT;
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  return `${h}h ${m % 60}m ${s % 60}s`;
}

function timeout(ms: number, name: string): Promise<never> {
  return new Promise((_, reject) => setTimeout(() => reject(new Error(`${name} timed out after ${ms}ms`)), ms));
}
