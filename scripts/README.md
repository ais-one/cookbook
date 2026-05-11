## Scripts

Repository release automation is handled by the `release-please` job in [ci.yml](../.github/workflows/ci.yml), not by local scripts.

This folder keeps repository utility scripts.

### generate-crud.ts

Generates Zod schemas, Express routes, and controllers from a Drizzle schema.
Uses **Option C**: `generated/` directories are always overwritten; sidecar files
outside `generated/` are created once and then owned by the developer.

Run from an app directory:

```sh
npm run generate:crud
```

Or directly with custom options:

```sh
node ../../scripts/generate-crud.ts \
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

### generate-openapi.ts

Generates `docs/openapi/openapi.merged.yaml` from Zod v4 schemas.

Run from the repo root: `npm run docs:generate`

### test-schemas.ts

Validates Zod schema exports in a given directory.

Run from an app directory: `npm run test:schema`
