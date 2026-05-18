-- updated_at_func: sets updated_at to now() on every UPDATE
CREATE OR REPLACE FUNCTION updated_at_func()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
--> statement-breakpoint

CREATE TRIGGER set_updated_at_users
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION updated_at_func();
--> statement-breakpoint

CREATE TRIGGER set_updated_at_user_credentials
  BEFORE UPDATE ON user_credentials
  FOR EACH ROW EXECUTE FUNCTION updated_at_func();
--> statement-breakpoint

CREATE TRIGGER set_updated_at_user_federated_identities
  BEFORE UPDATE ON user_federated_identities
  FOR EACH ROW EXECUTE FUNCTION updated_at_func();
--> statement-breakpoint

CREATE TRIGGER set_updated_at_roles
  BEFORE UPDATE ON roles
  FOR EACH ROW EXECUTE FUNCTION updated_at_func();
