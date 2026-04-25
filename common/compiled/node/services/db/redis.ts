import { Redis } from 'ioredis';
import type { RedisConfig } from '../types.ts';

/** Wraps an ioredis connection, opened/closed by the services lifecycle. */
export default class StoreRedis {
  _REDIS_CONFIG: RedisConfig;
  _redis: Redis | null;

  constructor(options: RedisConfig = globalThis.__config?.REDIS_CONFIG ?? { opts: {} }) {
    this._REDIS_CONFIG = options;
    this._redis = null;
  }

  /** Open the Redis connection, applying retry and reconnect strategies if configured. */
  open(): void {
    const redisOpts = this._REDIS_CONFIG.opts;
    if (this._REDIS_CONFIG.retry) {
      const { step, max } = this._REDIS_CONFIG.retry;
      redisOpts.retryStrategy = (times: number) => Math.min(times * step, max);
    }
    if (this._REDIS_CONFIG.reconnect) {
      const { targetError } = this._REDIS_CONFIG.reconnect;
      redisOpts.reconnectOnError = (err: Error) => err.message.includes(targetError);
    }
    this._redis = new Redis(redisOpts);
  }

  /** Returns the underlying ioredis instance, or null if not yet connected. */
  get(): Redis | null {
    return this._redis;
  }

  /** Disconnect and release the Redis connection. */
  close(): void {
    if (this._redis) {
      this._redis.disconnect();
      this._redis = null;
    }
  }
}
