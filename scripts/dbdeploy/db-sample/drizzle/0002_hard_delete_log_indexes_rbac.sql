-- Indexes for hard_delete_log (common query patterns)
CREATE INDEX idx_hard_delete_table      ON hard_delete_log (table_name,  deleted_at DESC);
--> statement-breakpoint
CREATE INDEX idx_hard_delete_record     ON hard_delete_log (record_id,   deleted_at DESC);
--> statement-breakpoint
CREATE INDEX idx_hard_delete_deleted_by ON hard_delete_log (deleted_by,  deleted_at DESC);
--> statement-breakpoint

-- RBAC: only admin_role may insert; audit_reader may select; nobody else
REVOKE ALL ON hard_delete_log FROM PUBLIC;
--> statement-breakpoint

DO $$ BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'admin_role') THEN
    CREATE ROLE admin_role;
  END IF;
END $$;
--> statement-breakpoint
GRANT INSERT ON hard_delete_log TO admin_role;
--> statement-breakpoint

DO $$ BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'audit_reader') THEN
    CREATE ROLE audit_reader;
  END IF;
END $$;
--> statement-breakpoint
GRANT SELECT ON hard_delete_log TO audit_reader;
