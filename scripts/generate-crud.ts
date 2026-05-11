#!/usr/bin/env node
// scripts/generate-crud.ts
//
// Generates Zod schemas, Express routes, and controllers from a Drizzle schema.
// Strategy: Option C — generated/ folders are always overwritten; sidecar files
// (outside generated/) are created once and then owned by the developer.
//
// Usage (run from the target app directory):
//   node ../../scripts/generate-crud.ts \
//     --schema   ../../common/compiled/node/services/db/schema.ts \
//     --schema-module @common/node/services/db/schema \
//     --app      . \
//     --db       drizzle1 \
//     [--tables  categories,student] \
//     [--route-prefix /api/sample-api]
//
// Output layout (relative to --app):
//   schemas/generated/<table>.schema.js      ← ALWAYS overwritten (Zod schemas)
//   src/routes/generated/<table>.ts          ← ALWAYS overwritten (Express routes)
//   src/controllers/generated/<table>.ts     ← ALWAYS overwritten (CRUD handlers)
//   schemas/<table>.schema.js                ← created ONCE  (your sidecar)
//   src/controllers/<table>.ts               ← created ONCE  (your sidecar)

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

// ─── CLI argument parsing ─────────────────────────────────────────────────────

function parseArgs(argv: string[]): Record<string, string> {
  const result: Record<string, string> = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith('--')) {
      result[arg.slice(2)] = argv[i + 1] ?? '';
      i++;
    }
  }
  return result;
}

const args = parseArgs(process.argv.slice(2));
const schemaFilePath = args['schema'];
const schemaModule = args['schema-module'];
const appDir = args['app'];
const dbName = args['db'];
const tablesFilter = args['tables'] ? args['tables'].split(',').map(s => s.trim()) : null;
const routePrefix = args['route-prefix'] ?? '';

if (!schemaFilePath || !schemaModule || !appDir || !dbName) {
  console.error(`
Usage: node scripts/generate-crud.ts \\
  --schema         <path>    Path to Drizzle schema .ts file (relative to cwd)
  --schema-module  <spec>    Module import specifier for generated code
  --app            <dir>     App root directory (relative to cwd)
  --db             <name>    Drizzle service name passed to services.get()
  [--tables        <t1,t2>]  Comma-separated table variable names to process
  [--route-prefix  <prefix>] URL prefix printed in mount hint (e.g. /api/sample-api)
`);
  process.exit(1);
}

// ─── Drizzle internals (symbol-based — works across module instances) ─────────

const ENTITY_KIND = Symbol.for('drizzle:entityKind');
const TABLE_COLUMNS = Symbol.for('drizzle:Columns');

function isPgTable(obj: unknown): boolean {
  // entityKind is a static property on the constructor, not on the instance
  // biome-ignore lint/suspicious/noExplicitAny: drizzle table internals
  return typeof obj === 'object' && obj !== null && (obj as any)?.constructor?.[ENTITY_KIND] === 'PgTable';
}

// biome-ignore lint/suspicious/noExplicitAny: drizzle internals are untyped here
function getColumns(table: object): Record<string, any> {
  // biome-ignore lint/suspicious/noExplicitAny: drizzle internals
  return (table as any)[TABLE_COLUMNS] ?? {};
}

// ─── SQL type → Zod code mapping ─────────────────────────────────────────────

function sqlTypeToZodCode(sqlType: string): string {
  const base = sqlType.toLowerCase().split('(')[0].split(' ')[0].trim();
  switch (base) {
    case 'serial':
    case 'bigserial':
      return 'z.number().int().positive()';
    case 'integer':
    case 'int':
    case 'int2':
    case 'int4':
    case 'int8':
    case 'bigint':
      return 'z.number().int()';
    case 'varchar':
    case 'character':
    case 'char':
    case 'text':
      return 'z.string()';
    case 'boolean':
    case 'bool':
      return 'z.boolean()';
    case 'numeric':
    case 'decimal':
      return 'z.string()'; // drizzle-orm returns numeric as string
    case 'timestamp':
    case 'date':
    case 'time':
      return 'z.string()';
    case 'jsonb':
    case 'json':
      return 'z.record(z.unknown())';
    case 'uuid':
      return 'z.string().uuid()';
    case 'inet':
      return 'z.string()'; // custom inet type — underlying data is string
    case 'text[]':
      return 'z.array(z.string())'; // custom textArray type — underlying data is string[]
    default:
      return 'z.unknown()';
  }
}

// ─── Naming helpers ───────────────────────────────────────────────────────────

function toPascalCase(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/** camelCase / PascalCase → kebab-case. 'fgaConfig' → 'fga-config' */
function toKebabCase(str: string): string {
  return str.replace(/([A-Z])/g, m => `-${m.toLowerCase()}`).replace(/^-/, '');
}

// ─── File helpers ─────────────────────────────────────────────────────────────

function writeFile(filePath: string, content: string): void {
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, content, 'utf8');
}

/** Returns true if the file was created, false if it already existed. */
function writeIfAbsent(filePath: string, content: string): boolean {
  if (existsSync(filePath)) return false;
  writeFile(filePath, content);
  return true;
}

// ─── Config ───────────────────────────────────────────────────────────────────

interface CrudConfig {
  /** Tables to skip entirely — no Zod schema, no routes, no controllers generated. */
  exclude?: string[];
  /**
   * Tables to generate a Zod schema for, but NOT routes or controllers.
   * Useful for documenting table shapes in OpenAPI without exposing public CRUD endpoints.
   */
  schemaOnly?: string[];
  /** Per-table field-level exclusions, keyed by Drizzle table variable name. */
  tables?: Record<
    string,
    {
      /**
       * Column names to remove from BodySchema and UpdateSchema.
       * Use for server-managed fields that clients must never supply directly
       * (e.g. password hashes, OTP pins, security counters).
       */
      excludeFromBody?: string[];
      /**
       * Column names to omit from SELECT in generated controllers.
       * Produces an explicit column list so sensitive data is never returned
       * in API responses (e.g. password, salt, gaKey).
       */
      excludeFromResponse?: string[];
    }
  >;
}

// ─── Types ───────────────────────────────────────────────────────────────────

interface BodyField {
  name: string;
  zodCode: string;
  required: boolean;
}

interface TableInfo {
  varName: string; // 'categories'
  pascalName: string; // 'Categories'
  kebabName: string; // 'categories' or 'fga-config'
  pkColName: string; // 'id' or 'code'
  pkIsNumeric: boolean; // true → coerce.number(), false → string
  bodyFields: BodyField[];
  allColNames: string[]; // all column names, used for explicit SELECT when excludeFromResponse is set
  excludeFromResponse: string[]; // columns to omit from SELECT responses
}

// ─── Code generators ─────────────────────────────────────────────────────────

const AUTO_HEADER = (varName: string) => `\
// ─────────────────────────────────────────────────────────────────────────────
// AUTO-GENERATED — DO NOT EDIT
// Re-run \`npm run generate:crud\` to regenerate this file.
// Source table: ${varName}
// ─────────────────────────────────────────────────────────────────────────────
`;

function generateSchemaFile(info: TableInfo): string {
  const { varName, pascalName, kebabName, pkColName, pkIsNumeric, bodyFields } = info;

  const pkZodCode = pkIsNumeric ? 'z.coerce.number().int().positive()' : 'z.string().min(1)';
  const pkExample = pkIsNumeric ? '1' : "'example-id'";

  const bodyLines = bodyFields.map(f => `    ${f.name}: ${f.zodCode}${f.required ? '' : '.optional()'},`).join('\n');

  return `${AUTO_HEADER(varName)}import { z } from 'zod';

// Insert body — fields accepted on POST /${kebabName}
export const ${pascalName}BodySchema = z
  .object({
${bodyLines}
  })
  .meta({ id: '${pascalName}Body' });

// Partial update — all fields optional for PATCH /${kebabName}/:${pkColName}
export const ${pascalName}UpdateSchema = ${pascalName}BodySchema.partial().meta({ id: '${pascalName}Update' });

// URL params — :${pkColName} on /:${pkColName} routes
export const ${pascalName}ParamsSchema = z
  .object({
    ${pkColName}: ${pkZodCode}.meta({ example: ${pkExample} }),
  })
  .meta({ id: '${pascalName}Params' });

// Query params — pagination for GET /${kebabName}
export const ${pascalName}QuerySchema = z
  .object({
    limit: z.coerce.number().int().positive().max(100).default(10).meta({ example: 10 }),
    page: z.coerce.number().int().min(0).default(0).meta({ example: 0 }),
  })
  .meta({ id: '${pascalName}Query' });
`;
}

function generateRouteFile(info: TableInfo): string {
  const { varName, pascalName, kebabName, pkColName } = info;

  return `${AUTO_HEADER(varName)}import { authUser } from '@common/node/auth/jwt';
import { validate } from '@common/node/errors/validate';
import express from 'express';
import {
  ${pascalName}BodySchema,
  ${pascalName}ParamsSchema,
  ${pascalName}QuerySchema,
  ${pascalName}UpdateSchema,
} from '../../../schemas/generated/${kebabName}.schema.js';
// Imports from the sidecar controller so developer overrides are picked up automatically.
import ${varName}Controller from '../../controllers/${kebabName}.ts';

export default express
  .Router()
  .post('/', authUser, validate('body', ${pascalName}BodySchema), ${varName}Controller.create)
  .get('/', authUser, validate('query', ${pascalName}QuerySchema), ${varName}Controller.find)
  .get('/:${pkColName}', authUser, validate('params', ${pascalName}ParamsSchema), ${varName}Controller.findOne)
  .patch(
    '/:${pkColName}',
    authUser,
    validate('params', ${pascalName}ParamsSchema),
    validate('body', ${pascalName}UpdateSchema),
    ${varName}Controller.update,
  )
  .delete('/:${pkColName}', authUser, validate('params', ${pascalName}ParamsSchema), ${varName}Controller.remove);
`;
}

function generateControllerFile(info: TableInfo): string {
  const { varName, pkColName, pkIsNumeric, allColNames, excludeFromResponse } = info;
  const pkExpr = pkIsNumeric ? `Number(req.params.${pkColName})` : `req.params.${pkColName}`;

  // Build explicit column select when sensitive fields must be excluded from responses
  const safeColNames = allColNames.filter(c => !excludeFromResponse.includes(c));
  const hasExclusions = excludeFromResponse.length > 0;
  const selectArgLines = safeColNames.map(c => `      ${c}: table.${c},`).join('\n');
  const selectCall = hasExclusions ? `.select({\n${selectArgLines}\n    })` : '.select()';

  return `${AUTO_HEADER(varName)}import * as realServices from '@common/node/services';
import { ${varName} as table } from '${schemaModule}';
import { eq } from 'drizzle-orm';

// biome-ignore lint/suspicious/noExplicitAny: services interface varies by store type
let services: any = realServices;

// Allows unit tests to inject a mock without needing ESM module mocking
// biome-ignore lint/suspicious/noExplicitAny: test injection
export const _injectServices = (mock: any) => {
  services = mock;
};

const db = () => services.get('${dbName}');

const create = async (req, res) => {
  const result = await db().insert(table).values(req.body).returning({ ${pkColName}: table.${pkColName} });
  return res.status(201).json(result[0]);
};

const findOne = async (req, res) => {
  const rows = await db()
    ${selectCall}
    .from(table)
    .where(eq(table.${pkColName}, ${pkExpr}))
    .limit(1);
  if (rows.length) return res.status(200).json(rows[0]);
  return res.status(404).json({});
};

const update = async (req, res) => {
  const result = await db()
    .update(table)
    .set(req.body)
    .where(eq(table.${pkColName}, ${pkExpr}));
  const count = result.rowCount ?? 0;
  return res.status(count ? 200 : 404).json({ count });
};

const find = async (req, res) => {
  const limit = req.query.limit ? Number(req.query.limit) : 10;
  const page = req.query.page ? Number(req.query.page) : 0;
  const result = await db()
    ${selectCall}
    .from(table)
    .limit(limit)
    .offset((page > 0 ? page - 1 : 0) * limit);
  return res.status(200).json(result);
};

const remove = async (req, res) => {
  const result = await db()
    .delete(table)
    .where(eq(table.${pkColName}, ${pkExpr}));
  const count = result.rowCount ?? 0;
  return res.status(count ? 200 : 404).json({ count });
};

export default { create, findOne, update, find, remove };
`;
}

const SIDECAR_HEADER = `\
// ─────────────────────────────────────────────────────────────────────────────
// Sidecar — created once, then YOURS. Will NOT be overwritten by generate:crud.
// Extend or override the generated code below as needed.
// ─────────────────────────────────────────────────────────────────────────────
`;

function generateSidecarSchema(info: TableInfo): string {
  const { varName, kebabName, pascalName } = info;
  return `${SIDECAR_HEADER}// Re-export everything from generated — add custom schemas below.
export * from './generated/${kebabName}.schema.js';

// Example: add a custom search schema
// import { z } from 'zod';
// export const ${pascalName}SearchSchema = z.object({ q: z.string().min(1) }).meta({ id: '${pascalName}Search' });
`;
}

function generateSidecarController(info: TableInfo): string {
  const { kebabName, varName } = info;
  return `${SIDECAR_HEADER}// Re-export the generated controller as the default — override methods below.
export { default } from './generated/${kebabName}.ts';

// Example: override specific methods
// import generatedController from './generated/${kebabName}.ts';
// import type { Request, Response } from 'express';
//
// export default {
//   ...generatedController,
//   create: async (req: Request, res: Response) => {
//     // custom create logic for ${varName}
//   },
// };
`;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const appRoot = resolve(process.cwd(), appDir);
const schemaPath = resolve(process.cwd(), schemaFilePath);

// Load config file if present at app root
const configPath = resolve(appRoot, 'generate-crud.config.json');
let config: CrudConfig = {};
if (existsSync(configPath)) {
  config = JSON.parse(readFileSync(configPath, 'utf8')) as CrudConfig;
}

console.log(`\nGenerating CRUD from: ${schemaFilePath}`);
console.log(`App root:             ${appRoot}`);
if (existsSync(configPath)) console.log(`Config:               ${configPath}`);
console.log();

const schemaExports = await import(pathToFileURL(schemaPath).href);

const generated: string[] = [];
const schemaOnlyGenerated: string[] = [];
const skipped: string[] = [];
const sidecarsCreated: string[] = [];

for (const [varName, exported] of Object.entries(schemaExports)) {
  if (!isPgTable(exported)) continue;
  if (tablesFilter && !tablesFilter.includes(varName)) continue;

  // Config: skip excluded tables entirely — no files generated
  if (config.exclude?.includes(varName)) {
    skipped.push(`${varName} (excluded by config)`);
    continue;
  }

  // biome-ignore lint/suspicious/noExplicitAny: drizzle table internals
  const columns = getColumns(exported as any);

  // Only generate for tables with a single-column primary key
  // biome-ignore lint/suspicious/noExplicitAny: drizzle column internals
  const pkEntry = Object.entries(columns).find(([, col]) => (col as any).primary === true);
  if (!pkEntry) {
    skipped.push(`${varName} (no single-column primary key — skipped)`);
    continue;
  }

  const [pkColName, pkCol] = pkEntry;
  // biome-ignore lint/suspicious/noExplicitAny: drizzle column internals
  const pkSqlType: string = (pkCol as any).getSQLType?.() ?? 'unknown';
  const pkBase = pkSqlType.toLowerCase().split('(')[0].split(' ')[0].trim();
  const pkIsNumeric = ['serial', 'bigserial', 'integer', 'int', 'int2', 'int4', 'int8', 'bigint'].includes(pkBase);

  // Per-table config
  const tableConfig = config.tables?.[varName];
  const excludeFromBodySet = new Set(tableConfig?.excludeFromBody ?? []);
  const excludeFromResponse = tableConfig?.excludeFromResponse ?? [];

  // All column names — used for explicit SELECT when excludeFromResponse is set
  const allColNames = Object.keys(columns);

  // Build body fields — exclude PK, server-managed SQL-expression columns, and config-excluded columns
  const bodyFields: BodyField[] = Object.entries(columns)
    // biome-ignore lint/suspicious/noExplicitAny: drizzle column internals
    .filter(([colName, col]) => !(col as any).primary && !excludeFromBodySet.has(colName))
    .filter(([, col]) => {
      // biome-ignore lint/suspicious/noExplicitAny: drizzle column internals
      const c = col as any;
      // SQL expression defaults (e.g. sql`now()`, sql`session_user`, sql`inet_client_addr()`) are
      // server-managed — exclude them from body schemas so clients cannot supply them.
      const defaultVal = c.config?.default;
      const isSqlExpression = defaultVal !== undefined && typeof defaultVal?.getSQL === 'function';
      return !isSqlExpression;
    })
    .map(([colName, col]) => {
      // biome-ignore lint/suspicious/noExplicitAny: drizzle column internals
      const c = col as any;
      const sqlType: string = c.getSQLType?.() ?? 'unknown';
      const notNull: boolean = c.notNull ?? false;
      const hasDefault: boolean = c.hasDefault ?? false;
      return {
        name: colName,
        zodCode: sqlTypeToZodCode(sqlType),
        required: notNull && !hasDefault,
      };
    });

  const kebabName = toKebabCase(varName);
  const pascalName = toPascalCase(varName);
  const info: TableInfo = {
    varName,
    pascalName,
    kebabName,
    pkColName,
    pkIsNumeric,
    bodyFields,
    allColNames,
    excludeFromResponse,
  };

  // ── Always generate the Zod schema file ───────────────────────────────────
  writeFile(resolve(appRoot, 'schemas', 'generated', `${kebabName}.schema.js`), generateSchemaFile(info));

  // Config: schemaOnly — skip routes, controllers, and sidecars
  if (config.schemaOnly?.includes(varName)) {
    schemaOnlyGenerated.push(varName);
    continue;
  }

  // ── Generated route + controller files — always overwrite ─────────────────
  writeFile(resolve(appRoot, 'src', 'routes', 'generated', `${kebabName}.ts`), generateRouteFile(info));
  writeFile(resolve(appRoot, 'src', 'controllers', 'generated', `${kebabName}.ts`), generateControllerFile(info));

  // ── Sidecar files — create once, then developer owns them ─────────────────
  const sidecarSchemaPath = resolve(appRoot, 'schemas', `${kebabName}.schema.js`);
  const sidecarControllerPath = resolve(appRoot, 'src', 'controllers', `${kebabName}.ts`);

  const schemaNew = writeIfAbsent(sidecarSchemaPath, generateSidecarSchema(info));
  const controllerNew = writeIfAbsent(sidecarControllerPath, generateSidecarController(info));

  if (schemaNew || controllerNew) sidecarsCreated.push(varName);

  generated.push(varName);
}

// ─── Summary ─────────────────────────────────────────────────────────────────

if (generated.length === 0 && schemaOnlyGenerated.length === 0 && skipped.length === 0) {
  console.log('No pgTable exports found in the schema file.');
  process.exit(0);
}

console.log(`Generated (${generated.length}):`);
for (const name of generated) {
  const kebab = toKebabCase(name);
  const tCfg = config.tables?.[name];
  const bodyNote = tCfg?.excludeFromBody?.length ? ` [body: -${tCfg.excludeFromBody.length} fields]` : '';
  const responseNote = tCfg?.excludeFromResponse?.length
    ? ` [response: -${tCfg.excludeFromResponse.length} fields]`
    : '';
  console.log(`  ${name}${bodyNote}${responseNote}`);
  console.log(`    schemas/generated/${kebab}.schema.js    (overwritten)`);
  console.log(`    src/routes/generated/${kebab}.ts        (overwritten)`);
  console.log(`    src/controllers/generated/${kebab}.ts   (overwritten)`);
}

if (schemaOnlyGenerated.length) {
  console.log(`\nSchema only (${schemaOnlyGenerated.length}) — Zod schema generated, no routes/controllers:`);
  for (const name of schemaOnlyGenerated) {
    const kebab = toKebabCase(name);
    console.log(`  ${name}`);
    console.log(`    schemas/generated/${kebab}.schema.js    (overwritten)`);
  }
}

if (skipped.length) {
  console.log(`\nSkipped (${skipped.length}):`);
  for (const s of skipped) console.log(`  ${s}`);
}

if (sidecarsCreated.length) {
  console.log(`\nSidecars created (once — yours to edit):`);
  for (const name of sidecarsCreated) {
    const kebab = toKebabCase(name);
    console.log(`  schemas/${kebab}.schema.js`);
    console.log(`  src/controllers/${kebab}.ts`);
  }
}

if (generated.length) {
  const prefix = routePrefix ? `${routePrefix}` : '';
  console.log(`\nNext step — mount generated routes in src/routes/index.ts:`);
  for (const name of generated) {
    const kebab = toKebabCase(name);
    console.log(`  import ${name}Route from './generated/${kebab}.ts';`);
    console.log(`  router.use('/${kebab}', ${name}Route); // ${prefix}/${kebab}`);
  }
}

console.log();
