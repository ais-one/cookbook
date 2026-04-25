import type { RedisOptions } from 'ioredis';

// ─── Service registry config ──────────────────────────────────────────────────

export type ServiceConfig = { type: string; options: string };

// ─── Redis connection config ──────────────────────────────────────────────────

export interface RedisConfig {
  opts: RedisOptions;
  retry?: { step: number; max: number };
  reconnect?: { targetError: string };
}
