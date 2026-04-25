import type { NextFunction, Request, Response } from 'express';
import type { Knex } from 'knex';
import { v4 as uuidv4 } from 'uuid';

/**
 * Express middleware that attaches `req.dbTransaction(callback)` to the request.
 * The callback receives a Knex transaction pre-loaded with session variables
 * (`app.current_user_id`, `app.current_tenant_id`, `app.session_id`, `app.transaction_id`)
 * so that PostgreSQL audit triggers can read the calling user's context.
 *
 * @param db - A connected Knex instance.
 */
export const auditMiddleware = (db: Knex) => {
  return async (
    req: Request & { dbTransaction?: (cb: (trx: Knex.Transaction) => Promise<unknown>) => Promise<unknown> },
    _res: Response,
    next: NextFunction,
  ) => {
    const userId = req.user?.sub ?? null;
    const tenantId = req.user?.tenant_id ?? null;
    const sessionId = req.headers['x-request-id'] ?? null;

    req.dbTransaction = (callback: (trx: Knex.Transaction) => Promise<unknown>) =>
      db.transaction(async trx => {
        const txId = uuidv4();

        await trx.raw(
          `
          SELECT
            set_config('app.current_user_id',   ?, true),
            set_config('app.current_tenant_id', ?, true),
            set_config('app.session_id',        ?, true),
            set_config('app.transaction_id',    ?, true)
        `,
          [userId ?? '', tenantId ?? '', sessionId ?? '', txId],
        );

        return callback(trx);
      });

    next();
  };
};

type RecordId = number | string | Record<string, number | string>;

/**
 * Hard-delete records from a table, writing a deletion audit log entry for each row.
 * Supports both simple primary keys and composite keys.
 *
 * @param trx - Active Knex transaction (use inside `req.dbTransaction`).
 * @param tableName - Target table name.
 * @param recordId - Single id, array of ids, or array of composite key objects.
 * @param reason - Human-readable reason for the deletion (stored in `hard_delete_log`).
 *
 * @example
 * // simple id
 * await hardDelete(trx, 'orders', 42, 'user requested account deletion')
 * // composite key
 * await hardDelete(trx, 'order_items', [{ order_id: 1, product_id: 7 }], 'cleanup')
 */
export const hardDelete = async (
  trx: Knex.Transaction,
  tableName: string,
  recordId: RecordId | RecordId[],
  reason: string,
): Promise<void> => {
  const { rows } = await trx.raw(`SELECT current_setting('app.current_user_id', true) AS uid`);
  const deletedBy: string = rows[0].uid;

  const ids = Array.isArray(recordId) ? recordId : [recordId];
  const isComposite = ids[0] !== null && typeof ids[0] === 'object';

  const buildWhereIn = (q: Knex.QueryBuilder) => {
    if (isComposite) {
      const keys = Object.keys(ids[0] as Record<string, unknown>);
      return q.whereIn(
        keys,
        (ids as Record<string, number | string>[]).map(id => keys.map(k => id[k])),
      );
    }
    return q.whereIn('id', ids as (number | string)[]);
  };

  const records: Record<string, unknown>[] = await buildWhereIn(trx(tableName));

  if (isComposite) {
    const keys = Object.keys(ids[0] as Record<string, unknown>);
    const toKey = (obj: Record<string, unknown>) => JSON.stringify(keys.map(k => obj[k]));
    const foundKeys = new Set(records.map(toKey));
    const missing = (ids as Record<string, unknown>[]).filter(id => !foundKeys.has(toKey(id)));
    if (missing.length > 0)
      throw new Error(`Records not found in ${tableName}: ${missing.map(id => JSON.stringify(id)).join(', ')}`);
  } else {
    const foundIds = new Set(records.map(r => r.id));
    const missing = (ids as (number | string)[]).filter(id => !foundIds.has(id));
    if (missing.length > 0) throw new Error(`Records not found in ${tableName}: ${missing.join(', ')}`);
  }

  const toRecordIdStr = isComposite
    ? (record: Record<string, unknown>) => {
        const keys = Object.keys(ids[0] as Record<string, unknown>);
        return JSON.stringify(Object.fromEntries(keys.map(k => [k, record[k]])));
      }
    : (record: Record<string, unknown>) => String(record.id);

  await trx('hard_delete_log').insert(
    records.map(record => ({
      table_name: tableName,
      record_id: toRecordIdStr(record),
      deleted_by: deletedBy,
      reason,
      deleted_data: JSON.stringify(record),
    })),
  );

  await buildWhereIn(trx(tableName)).delete();
};
