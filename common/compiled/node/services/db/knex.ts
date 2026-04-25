import Knex from 'knex';

/** Wraps a Knex connection, opened/closed by the services lifecycle. */
export default class StoreKnex {
  _KNEXFILE: Parameters<typeof Knex>[0] | null;
  _knex: ReturnType<typeof Knex> | null;
  name: string;

  constructor(optionName?: string) {
    const options = optionName ? globalThis.__config?.[optionName] : {};
    if (options) options.connection = process.env[optionName ?? ''];
    this._KNEXFILE = options ?? null;
    this._knex = null;
    this.name = optionName ?? '';
  }

  /** Connect to the database and verify connectivity with a `SELECT 1`. */
  async open(): Promise<void> {
    if (!this._KNEXFILE) {
      logger.info('KNEXFILE property empty or undefined - knex not started');
      return;
    }
    try {
      this._knex = Knex(this._KNEXFILE);
      await this._knex
        .raw('Select 1')
        .then(() => logger.info(`knex CONNECTED(${this.name})`))
        .catch(err => logger.info(`knex ERROR1(${this.name}): ${err.toString()}`));
    } catch (e) {
      logger.info(`knex ERROR2(${this.name}): ${String(e)}`);
    }
  }

  /** Returns the underlying Knex instance, or null if not yet connected. */
  get(): ReturnType<typeof Knex> | null {
    return this._knex;
  }

  /** Destroy the connection pool and release all resources. */
  async close(): Promise<void> {
    if (this._knex) await this._knex.destroy();
    logger.info(`knex CLOSED(${this.name})`);
  }
}
