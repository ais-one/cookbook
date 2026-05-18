-- Indexes for audit_log (common query patterns)
CREATE INDEX idx_audit_user        ON audit_log (app_user_id,    changed_at DESC);
--> statement-breakpoint
CREATE INDEX idx_audit_table       ON audit_log (table_name,     changed_at DESC);
--> statement-breakpoint
CREATE INDEX idx_audit_tenant      ON audit_log (tenant_id,      changed_at DESC);
--> statement-breakpoint
CREATE INDEX idx_audit_transaction ON audit_log (transaction_id);
--> statement-breakpoint

-- Enforce that only INSERT and UPDATE events are ever written
ALTER TABLE audit_log ADD CONSTRAINT chk_audit_log_operation
  CHECK (operation IN ('INSERT', 'UPDATE'));
--> statement-breakpoint

-- RBAC: audit_log is append-only — revoke mutating permissions
REVOKE UPDATE, DELETE ON audit_log FROM PUBLIC;
--> statement-breakpoint
DO $$ BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'api_role') THEN
    CREATE ROLE api_role;
  END IF;
END $$;
--> statement-breakpoint
REVOKE UPDATE, DELETE ON audit_log FROM api_role;
--> statement-breakpoint

-- audit_reader role may SELECT audit_log (role created idempotently)
DO $$ BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'audit_reader') THEN
    CREATE ROLE audit_reader;
  END IF;
END $$;
--> statement-breakpoint
GRANT SELECT ON audit_log TO audit_reader;
--> statement-breakpoint

-- Index for fga_config active-row lookups
CREATE INDEX idx_fga_config_active ON fga_config (is_active);
