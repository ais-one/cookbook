## Description

This workspace contains all database migration and seed tooling for the project. It manages two separate databases:

- **db-sample** — the main application database (used by `apps/sample-api`)
- **db-iam** — the identity and access management database

Migration and seeding uses **drizzle-orm** / **drizzle-kit**. Knex has been removed from this package.

---

## Quick Start (local dev)

Run all commands from `scripts/dbdeploy/`.

### 1. Start the local database servers

```powershell
npm run serve
```

This starts two PGlite socket servers:
- `db-sample` on `127.0.0.1:5432`
- `db-iam` on `127.0.0.1:5433`

Leave this terminal open while running migrations or seeding.

### 2. Run migrations

```powershell
# db-sample
npm run db:migrate

# db-iam
npm run db:iam:migrate
```

### 3. Seed initial data

```powershell
# db-sample (users, RBAC, test data, OpenFGA config)
npm run db:seed

# db-iam (system roles)
npm run db:iam:seed
```

---

## All Scripts

| Script | What it does |
|---|---|
| `npm run serve` | Start both PGlite servers (db-sample :5432, db-iam :5433) |
| `npm run db:migrate` | Apply pending db-sample migrations |
| `npm run db:generate` | Generate new db-sample migration from schema changes |
| `npm run db:seed` | Run all db-sample seed files in order |
| `npm run db:iam:migrate` | Apply pending db-iam migrations |
| `npm run db:iam:generate` | Generate new db-iam migration from schema changes |
| `npm run db:iam:seed` | Run all db-iam seed files in order |

---

## Reverting and Retesting Migrations

PGlite stores its data as files (`db-sample/dev.db`, `db-iam/dev.db`). To reset to a clean slate:

```powershell
# Stop serve first (Ctrl+C), then delete the db files
Remove-Item -Recurse -Force db-sample/dev.db
Remove-Item -Recurse -Force db-iam/dev.db
```

Then restart and rerun:

```powershell
npm run serve           # in a separate terminal
npm run db:migrate      # apply db-sample migrations
npm run db:seed         # seed db-sample
npm run db:iam:migrate  # apply db-iam migrations
npm run db:iam:seed     # seed db-iam
```

---

## Folder Structure

```
scripts/dbdeploy/
├── serve-db.ts                  # starts both PGlite socket servers
├── package.json
├── db-sample/
│   ├── .env                     # local DATABASE_URL (gitignored)
│   ├── .gitignore
│   ├── drizzle.config.ts        # points to common/compiled/node/.../schema.ts
│   ├── seed.ts                  # seed runner
│   ├── drizzle/
│   │   ├── 0000_left_ben_grimm.sql       # all CREATE TABLE statements
│   │   ├── 0001_functions_and_triggers.sql  # PL/pgSQL functions + triggers
│   │   └── meta/_journal.json
│   └── seeds/
│       ├── initial_users.ts
│       ├── initial_rbac.ts
│       ├── initial_testdata.ts
│       └── initial_openfga.ts
└── db-iam/
    ├── .env                     # local DATABASE_URL (gitignored)
    ├── .gitignore
    ├── schema.ts                # drizzle schema for IAM tables
    ├── drizzle.config.ts        # points to ./schema.ts
    ├── seed.ts                  # seed runner
    ├── drizzle/
    │   ├── 0000_identity.sql              # all IAM CREATE TABLE statements
    │   ├── 0001_updated_at_triggers.sql   # updated_at trigger function + triggers
    │   └── meta/_journal.json
    └── seeds/
        └── initial_roles.ts
```

---

## Adding a New Migration

1. Modify the schema file:
   - **db-sample**: `common/compiled/node/services/db/schema.ts`
   - **db-iam**: `scripts/dbdeploy/db-iam/schema.ts`

2. Generate the migration SQL:
   ```powershell
   npm run db:generate       # db-sample
   npm run db:iam:generate   # db-iam
   ```

3. Review the generated SQL file in `drizzle/`.

4. Apply it:
   ```powershell
   npm run db:migrate        # db-sample
   npm run db:iam:migrate    # db-iam
   ```

For raw SQL (triggers, functions, REVOKE/GRANT) that drizzle-kit cannot generate, create a numbered SQL file manually (e.g. `0002_my_trigger.sql`) and add an entry to `drizzle/meta/_journal.json`.

---

## Connection Strings

| Database | Local (PGlite) | Instance / real postgres |
|---|---|---|
| db-sample | `postgresql://postgres:postgres@127.0.0.1:5432/db_express?sslmode=disable` | `postgresql://<user>:<pass>@<host>:5432/<db>` |
| db-iam | `postgresql://postgres:postgres@127.0.0.1:5433/db_iam?sslmode=disable` | `postgresql://<user>:<pass>@<host>:5433/<db>` |

Set `DATABASE_URL` in the respective `.env` file for local use. For CI/production, set `DATABASE_URL` as an environment variable.

