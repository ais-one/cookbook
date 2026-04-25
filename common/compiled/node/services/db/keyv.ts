import { Keyv } from 'keyv';

/** Wraps a Keyv cache instance, opened/closed by the services lifecycle. */
export default class StoreKeyV {
  _KEYV_CACHE: Record<string, unknown>;
  _keyv: Keyv | null;

  constructor(options: Record<string, unknown> = globalThis.__config?.KEYV_CACHE ?? {}) {
    this._KEYV_CACHE = options;
    this._keyv = null;
  }

  /** Initialise the Keyv instance and attach an error handler. */
  open(): void {
    this._keyv = this._KEYV_CACHE ? new Keyv(this._KEYV_CACHE) : new Keyv();
    this._keyv.on('error', (err: unknown) => {
      logger.error('keyv Connection Error', { err });
    });
  }

  /** Returns the underlying Keyv instance, or null if not yet initialised. */
  get(): Keyv | null {
    return this._keyv;
  }

  /** Release the Keyv instance. */
  close(): void {
    this._keyv = null;
  }
}
