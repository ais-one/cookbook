## Scripts

Repository release automation is handled by the `release-please` job in [ci.yml](../.github/workflows/ci.yml), not by local scripts.

This folder keeps repository utility scripts.

### generators/

All code and document generation scripts live here. Each generator produces files
that are safe to re-run at any time — output files inside `generated/` directories
are always overwritten, while sidecar files created outside `generated/` are written
once and then owned by the developer.

#### generate-crud.ts

Generates Zod schemas, Express routes, and controllers from a Drizzle schema.

Run from an app directory:

```sh
npm run generate:crud
```

Or directly with custom options:

```sh
node ../../scripts/generators/generate-crud.ts \
  --schema         ../../common/compiled/node/services/db/schema.ts \
  --schema-module  @common/node/services/db/schema \
  --app            . \
  --db             drizzle1 \
  --tables         categories,student \
  --route-prefix   /api/sample-api
```

| Flag | Required | Description |
|---|---|---|
| `--schema` | yes | Path to the Drizzle schema `.ts` file |
| `--schema-module` | yes | Module import specifier used in generated controller imports |
| `--app` | yes | App root directory (relative to cwd) |
| `--db` | yes | Drizzle service name passed to `services.get()` |
| `--tables` | no | Comma-separated table variable names to process (default: all) |
| `--route-prefix` | no | URL prefix shown in the mount hint at the end |

Skips tables with composite primary keys or no primary key.

**Config file** (`generate-crud.config.json` at the app root)

Optionally place a `generate-crud.config.json` next to `package.json` to control
which tables and fields are included or excluded:

```json
{
  "$schema": "../../scripts/generators/generate-crud.config.schema.json",
  "exclude": ["fgaConfig"],
  "schemaOnly": ["auditLog"],
  "tables": {
    "users": {
      "excludeFromBody": ["password", "salt"],
      "excludeFromResponse": ["password", "salt"]
    }
  }
}
```

| Key | Description |
|---|---|
| `exclude` | Tables to skip entirely — no schema, no routes, no controllers |
| `schemaOnly` | Tables to generate a Zod schema for, but no routes or controllers |
| `tables.<name>.excludeFromBody` | Columns removed from `BodySchema` and `UpdateSchema` (POST/PATCH) |
| `tables.<name>.excludeFromResponse` | Columns omitted from `SELECT` in generated controllers |

The companion `generate-crud.config.schema.json` provides VS Code IntelliSense for the config file.

#### generate-openapi.ts

Generates an OpenAPI 3.1 YAML document from Zod v4 schemas by scanning a `schemas/` directory.

Tables that have a sidecar schema file (e.g. `schemas/student.schema.js`) get full CRUD path definitions.
Tables that only exist under `schemas/generated/` (schema-only tables) are included as components only — no paths.

Run from an app directory:

```sh
npm run docs:generate
```

Or directly with custom options:

```sh
node ../../scripts/generators/generate-openapi.ts \
  --schemas    ./schemas \
  --out        ./docs/openapi/openapi.yaml \
  --prefix     /api/sample-api \
  --title      "Sample API" \
  --version    1.0.0 \
  --server     http://localhost:8080 \
  --routes-dir ./src/routes/generated
```

| Flag | Required | Description |
|---|---|---|
| `--schemas` | yes | Directory containing `*.schema.js` files |
| `--out` | yes | Output YAML file path |
| `--prefix` | no | URL prefix prepended to all CRUD paths (e.g. `/api/sample-api`) |
| `--title` | no | `info.title` in the OpenAPI document (default: `API`) |
| `--version` | no | `info.version` in the OpenAPI document (default: `1.0.0`) |
| `--server` | no | Server URL in the OpenAPI document (default: `http://localhost:8080`) |
| `--routes-dir` | no | When provided, only generates CRUD paths for tables that also have a `.ts` file in this directory |

The `*ResponseSchema` export from each schema file is used as the GET response body shape.
Tables without a `ResponseSchema` export fall back to a generic object schema.

### test-schemas.ts

Validates Zod schema exports in a given directory.

Run from an app directory: `npm run test:schema`
