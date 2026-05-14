#!/usr/bin/env node
// scripts/generators/generate-openapi.ts
//
// Generates an OpenAPI 3.1 YAML document from Zod v4 schemas.
// Scans the --schemas directory for *.schema.js files. For each table that has:
//   (a) a sidecar file directly in --schemas (e.g. schemas/categories.schema.js), AND
//   (b) the standard four CRUD schema exports (*BodySchema, *UpdateSchema, *ParamsSchema, *QuerySchema),
// it generates full CRUD path definitions. Tables that only exist in --schemas/generated/
// (schemaOnly tables) are imported so their shapes appear in components, but get no paths.
//
// Usage — from an app directory:
//   node ../../scripts/generators/generate-openapi.ts \
//     --schemas    ./schemas \
//     --out        ./docs/openapi/openapi.yaml \
//     --prefix     /api/sample-api \
//     --title      "Sample API" \
//     --version    1.0.0 \
//     [--routes-dir ./src/routes/generated]   ← optional extra guard: only generate paths when route file exists
//     [--server    http://localhost:8080]
//
// Usage — from repo root (shared schemas, components only, no CRUD paths):
//   node scripts/generators/generate-openapi.ts \
//     --schemas    ./common/schemas \
//     --out        ./docs/openapi/openapi.merged.yaml \
//     --title      "Shared Schemas" \
//     --version    1.0.0

import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, relative, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import yaml from 'js-yaml';
import { z } from 'zod';
import { createDocument } from 'zod-openapi';

// ─── CLI args ─────────────────────────────────────────────────────────────────

/**
 * Parses `--key value` pairs from the given argv array into a plain object.
 * Each `--key` consumes the next element as its value.
 *
 * @param argv - Argument array (typically `process.argv.slice(2)`).
 * @returns A record mapping each flag name (without `--`) to its string value.
 */
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

if (!args['schemas'] || !args['out']) {
  console.error(`
Usage: node scripts/generators/generate-openapi.ts \\
  --schemas    <dir>     Directory containing *.schema.js files (relative to cwd)
  --out        <file>    Output YAML file path (relative to cwd)
  [--prefix    <prefix>] URL prefix for all CRUD route paths (e.g. /api/sample-api)
  [--title     <title>]  OpenAPI info.title (default: API)
  [--version   <ver>]    OpenAPI info.version (default: 1.0.0)
  [--server    <url>]    Server URL (default: http://localhost:8080)
  [--routes-dir <dir>]   When provided, only generate CRUD paths for tables that also
                         have a route file in this directory (e.g. ./src/routes/generated)
`);
  process.exit(1);
}

const schemasDir = resolve(process.cwd(), args['schemas']);
const outFile = resolve(process.cwd(), args['out']);
const prefix = (args['prefix'] ?? '').replace(/\/$/, '');
const title = args['title'] || 'API';
const apiVersion = args['version'] || '1.0.0';
const serverUrl = args['server'] || 'http://localhost:8080';
const routesDir = args['routes-dir'] ? resolve(process.cwd(), args['routes-dir']) : null;

// ─── Naming helpers ───────────────────────────────────────────────────────────

/** Converts a kebab-case string to PascalCase. e.g. `'audit-log'` → `'AuditLog'`. */
function kebabToPascal(kebab: string): string {
  return kebab
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

/** Converts a PascalCase string to space-separated words. e.g. `'AuditLog'` → `'Audit Log'`. */
function pascalToWords(pascal: string): string {
  return pascal.replace(/([A-Z])/g, ' $1').trim();
}

// ─── Schema file discovery ────────────────────────────────────────────────────

const generatedDir = resolve(schemasDir, 'generated');
const sidecarKebabs = new Set<string>();

const filesToProcess: { kebab: string; filePath: string; isSidecar: boolean }[] = [];

if (existsSync(schemasDir)) {
  for (const entry of readdirSync(schemasDir, { withFileTypes: true })) {
    if (entry.isFile() && entry.name.endsWith('.schema.js')) {
      const kebab = entry.name.replace(/\.schema\.js$/, '');
      sidecarKebabs.add(kebab);
      filesToProcess.push({ kebab, filePath: resolve(schemasDir, entry.name), isSidecar: true });
    }
  }
}

// Generated-only files: schemas in generated/ that have NO corresponding sidecar.
// These are schemaOnly tables — components only, no paths.
if (existsSync(generatedDir)) {
  for (const entry of readdirSync(generatedDir, { withFileTypes: true })) {
    if (entry.isFile() && entry.name.endsWith('.schema.js')) {
      const kebab = entry.name.replace(/\.schema\.js$/, '');
      if (!sidecarKebabs.has(kebab)) {
        filesToProcess.push({ kebab, filePath: resolve(generatedDir, entry.name), isSidecar: false });
      }
    }
  }
}

if (filesToProcess.length === 0) {
  console.error(`No *.schema.js files found in ${schemasDir}`);
  process.exit(1);
}

// ─── Import all schema files ──────────────────────────────────────────────────

// biome-ignore lint/suspicious/noExplicitAny: dynamic schema imports
type SchemaModule = Record<string, any>;

const loaded: {
  kebab: string;
  mod: SchemaModule;
  isSidecar: boolean;
}[] = [];

for (const { kebab, filePath, isSidecar } of filesToProcess) {
  const mod: SchemaModule = await import(pathToFileURL(filePath).href);
  loaded.push({ kebab, mod, isSidecar });
}

// ─── Shared response schemas ──────────────────────────────────────────────────

// Used as the response body for PATCH and DELETE operations.
const CountResponseSchema = z.object({ count: z.number().int().meta({ example: 1 }) }).meta({ id: 'CountResponse' });

// Reusable error content block — plain JSON Schema (not Zod) to avoid serialisation issues
// biome-ignore lint/suspicious/noExplicitAny: openapi inline schema
const errorContent: any = {
  'application/json': {
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Error message' },
        error: { type: 'string', example: 'Error detail' },
      },
    },
  },
};

const r401 = { description: 'Unauthorized — valid JWT required', content: errorContent };
const r404 = { description: 'Not found', content: errorContent };
const r422 = { description: 'Validation error', content: errorContent };

// ─── Build CRUD paths ─────────────────────────────────────────────────────────

// Pagination parameters as plain JSON Schema — always the same shape (limit + page).
// Using plain objects avoids Zod-object-as-parameter serialisation edge cases.
const paginationParameters = [
  {
    name: 'limit',
    in: 'query',
    required: false,
    description: 'Maximum number of records to return (1–100)',
    schema: { type: 'integer', default: 10, minimum: 1, maximum: 100, example: 10 },
  },
  {
    name: 'page',
    in: 'query',
    required: false,
    description: 'Zero-based page offset',
    schema: { type: 'integer', default: 0, minimum: 0, example: 0 },
  },
];

// biome-ignore lint/suspicious/noExplicitAny: openapi path definitions
const paths: Record<string, any> = {};
const crudTables: string[] = [];
const componentOnlyTables: string[] = [];

for (const { kebab, mod, isSidecar } of loaded) {
  // Use suffix-based export lookup so hand-written sidecars with non-kebab naming
  // (e.g. CategoryBodySchema in categories.schema.js) are correctly detected.
  const bodySchemaKey = Object.keys(mod).find(k => k.endsWith('BodySchema'));
  const updateSchemaKey = Object.keys(mod).find(k => k.endsWith('UpdateSchema'));
  const paramsSchemaKey = Object.keys(mod).find(k => k.endsWith('ParamsSchema'));
  const responseSchemaKey = Object.keys(mod).find(k => k.endsWith('ResponseSchema'));

  const bodySchema = bodySchemaKey ? mod[bodySchemaKey] : undefined;
  const updateSchema = updateSchemaKey ? mod[updateSchemaKey] : undefined;
  const paramsSchema = paramsSchemaKey ? mod[paramsSchemaKey] : undefined;
  const responseSchema = responseSchemaKey ? mod[responseSchemaKey] : undefined;

  // Derive the pascal name from the BodySchema export key (strips the 'BodySchema' suffix).
  // Falls back to kebab-derived name when the sidecar has no CRUD exports.
  const pascalName = bodySchemaKey ? bodySchemaKey.replace(/BodySchema$/, '') : kebabToPascal(kebab);

  // A table gets CRUD paths when:
  //   1. It has a sidecar (full CRUD tables have sidecars; schemaOnly tables do not)
  //   2. The three standard CRUD exports are present (BodySchema, UpdateSchema, ParamsSchema)
  //   3. If --routes-dir was given, a route file must also exist there
  const hasCrudExports = !!(bodySchema && updateSchema && paramsSchema);
  const routeFileExists = !routesDir || existsSync(resolve(routesDir, `${kebab}.ts`));
  const isCrud = isSidecar && hasCrudExports && routeFileExists;

  if (!isCrud) {
    componentOnlyTables.push(kebab);
    continue;
  }

  crudTables.push(kebab);

  // Extract PK column name from ParamsSchema shape (it has exactly one key)
  // biome-ignore lint/suspicious/noExplicitAny: zod schema shape access
  const paramsShape = (paramsSchema as any).shape ?? {};
  const pkColName = Object.keys(paramsShape)[0] ?? 'id';
  const humanName = pascalToWords(pascalName);

  // Create response schema: z.object with just the PK — what INSERT ... RETURNING returns
  const pkFieldSchema = paramsShape[pkColName];
  const createResponseSchema = z.object({ [pkColName]: pkFieldSchema }).meta({ id: `${pascalName}CreateResponse` });

  // List response: z.array wrapping the response schema (avoids mixing Zod + plain-object schemas)
  const listResponseSchema = responseSchema
    ? z.array(responseSchema).meta({ id: `${pascalName}ListResponse` })
    : z.array(z.record(z.unknown()));

  const responseContent = responseSchema ? { 'application/json': { schema: responseSchema } } : errorContent;

  const listPath = `${prefix}/${kebab}`;
  const itemPath = `${prefix}/${kebab}/{${pkColName}}`;

  paths[listPath] = {
    post: {
      tags: [pascalName],
      summary: `Create a ${humanName}`,
      description: `Insert a new row into the ${humanName} table. Server-managed fields (primary key, audit timestamps, etc.) are excluded from the request body.`,
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: { 'application/json': { schema: bodySchema } },
      },
      responses: {
        201: {
          description: `${humanName} created — returns the primary key of the new record`,
          content: { 'application/json': { schema: createResponseSchema } },
        },
        401: r401,
        422: r422,
      },
    },
    get: {
      tags: [pascalName],
      summary: `List ${humanName} records`,
      description: `Returns a paginated array of ${humanName} rows. Use \`limit\` and \`page\` query parameters to control pagination.`,
      security: [{ bearerAuth: [] }],
      parameters: paginationParameters,
      responses: {
        200: {
          description: `Paginated list of ${humanName} records`,
          content: { 'application/json': { schema: listResponseSchema } },
        },
        401: r401,
      },
    },
  };

  paths[itemPath] = {
    get: {
      tags: [pascalName],
      summary: `Get a ${humanName} by ${pkColName}`,
      description: `Returns a single ${humanName} row matching the given primary key. Returns 404 if not found.`,
      security: [{ bearerAuth: [] }],
      requestParams: { path: paramsSchema },
      responses: {
        200: { description: `${humanName} found`, content: responseContent },
        401: r401,
        404: r404,
      },
    },
    patch: {
      tags: [pascalName],
      summary: `Update a ${humanName}`,
      description: `Partially updates a ${humanName} row. All body fields are optional (PATCH semantics). Returns \`{ count: 1 }\` on success or 404 if the record does not exist.`,
      security: [{ bearerAuth: [] }],
      requestParams: { path: paramsSchema },
      requestBody: {
        required: true,
        content: { 'application/json': { schema: updateSchema } },
      },
      responses: {
        200: { description: 'Row updated', content: { 'application/json': { schema: CountResponseSchema } } },
        401: r401,
        404: r404,
        422: r422,
      },
    },
    delete: {
      tags: [pascalName],
      summary: `Delete a ${humanName}`,
      description: `Permanently deletes a ${humanName} row. Returns \`{ count: 1 }\` on success or 404 if the record does not exist.`,
      security: [{ bearerAuth: [] }],
      requestParams: { path: paramsSchema },
      responses: {
        200: { description: 'Row deleted', content: { 'application/json': { schema: CountResponseSchema } } },
        401: r401,
        404: r404,
      },
    },
  };
}

// ─── Build document ───────────────────────────────────────────────────────────

// Collect all Zod *Schema exports from every loaded module so that schemaOnly
// tables (which are never referenced in paths) still appear in components.schemas.
// The component name is derived by stripping the 'Schema' suffix, which matches
// the .meta({ id }) value set by generate-crud.ts (e.g. AuditLogBodySchema → AuditLogBody).
// biome-ignore lint/suspicious/noExplicitAny: openapi component schemas
const explicitComponents: Record<string, any> = {};

for (const { mod } of loaded) {
  for (const [key, value] of Object.entries(mod)) {
    if (key.endsWith('Schema') && value !== null && typeof value === 'object' && '_def' in value) {
      explicitComponents[key.replace(/Schema$/, '')] = value;
    }
  }
}

const document = createDocument({
  openapi: '3.1.0',
  info: {
    title,
    description: 'Auto-generated from Zod v4 schemas via scripts/generators/generate-openapi.ts. Do not edit manually.',
    version: apiVersion,
  },
  servers: [{ url: serverUrl }],
  components: {
    schemas: explicitComponents,
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT obtained from the authentication endpoint',
      },
    },
  },
  paths,
});

// ─── Write output ─────────────────────────────────────────────────────────────

mkdirSync(dirname(outFile), { recursive: true });
writeFileSync(outFile, yaml.dump(document, { lineWidth: 120 }));

const rel = relative(process.cwd(), outFile);
console.log(`\nOpenAPI spec written to ${rel}`);
console.log(`  Title:      ${title} v${apiVersion}`);
console.log(`  CRUD paths: ${crudTables.length} tables — ${Object.keys(document.paths ?? {}).length} path entries`);
if (componentOnlyTables.length) {
  console.log(`  Components: ${componentOnlyTables.length} schema-only tables (no paths)`);
}
console.log(`  Schemas:    ${Object.keys(document.components?.schemas ?? {}).length} components\n`);
