
## References

- https://dba.stackexchange.com/questions/278943/how-to-pass-application-user-names-to-the-database-server-for-audit-purposes
- https://dbfiddle.uk/n8cJjMvU


## Postgresql

https://medium.com/israeli-tech-radar/postgresql-trigger-based-audit-log-fd9d9d5e412c

```
CREATE TABLE IF NOT EXISTS audit_log (
    id serial PRIMARY KEY,
    table_name TEXT,
    record_id TEXT,
    operation_type TEXT,
    changed_at TIMESTAMP DEFAULT now(),
    changed_by TEXT,
    original_values jsonb,
    new_values jsonb,
);
```

```
CREATE OR REPLACE FUNCTION audit_trigger() RETURNS TRIGGER AS $$
DECLARE
    new_data jsonb;
    old_data jsonb;
    key text;
    new_values jsonb;
    old_values jsonb;
    user_id text;
BEGIN

    user_id := current_setting('audit.user_id', true);

    IF user_id IS NULL THEN
        user_id := current_user;
    END IF;

    new_values := '{}';
    old_values := '{}';

    IF TG_OP = 'INSERT' THEN
        new_data := to_jsonb(NEW);
        new_values := new_data;

    ELSIF TG_OP = 'UPDATE' THEN
        new_data := to_jsonb(NEW);
        old_data := to_jsonb(OLD);

        FOR key IN SELECT jsonb_object_keys(new_data) INTERSECT SELECT jsonb_object_keys(old_data)
        LOOP
            IF new_data ->> key != old_data ->> key THEN
                new_values := new_values || jsonb_build_object(key, new_data ->> key);
                old_values := old_values || jsonb_build_object(key, old_data ->> key);
            END IF;
        END LOOP;

    ELSIF TG_OP = 'DELETE' THEN
        old_data := to_jsonb(OLD);
        old_values := old_data;

        FOR key IN SELECT jsonb_object_keys(old_data)
        LOOP
            old_values := old_values || jsonb_build_object(key, old_data ->> key);
        END LOOP;

    END IF;

    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        INSERT INTO audit_log (table_name, record_id, operation_type, changed_by, original_values, new_values)
        VALUES (TG_TABLE_NAME, NEW.id, TG_OP, user_id, old_values, new_values);

        RETURN NEW;
    ELSE
        INSERT INTO audit_log (table_name, record_id, operation_type, changed_by, original_values, new_values)
        VALUES (TG_TABLE_NAME, OLD.id, TG_OP, user_id, old_values, new_values);

        RETURN OLD;
    END IF;
END;
$$ LANGUAGE plpgsql;
```

```
SELECT set_config('audit.user_id', 'test user', true);
```




## MySQL

https://medium.com/@rajeshkumarraj82/mysql-table-audit-trail-using-triggers-bd32b772cce5

```
create table persons_audit_trail(id int NOT NULL AUTO_INCREMENT, 
Personid int NOT NULL,
column_name varchar(255),
old_value varchar(255),
new_value varchar(255),
done_by varchar(255) NOT NULL,
done_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY (id));
```

Insert

```
DELIMITER $$
CREATE TRIGGER persons_create
AFTER INSERT
ON persons FOR EACH ROW
BEGIN
    insert into persons_audit_trail(Personid, column_name, new_value, done_by) values(NEW.Personid,'FirstName',NEW.FirstName,NEW.created_by);
	insert into persons_audit_trail(Personid, column_name, new_value, done_by) values(NEW.Personid,'LastName',NEW.LastName,NEW.created_by);
	insert into persons_audit_trail(Personid, column_name, new_value, done_by) values(NEW.Personid,'Age',NEW.Age,NEW.created_by);
	
END$$
DELIMITER ;
```

```
DELIMITER $$
CREATE TRIGGER persons_update
AFTER UPDATE
ON persons FOR EACH ROW
BEGIN
    IF OLD.FirstName <> new.FirstName THEN
        insert into persons_audit_trail(Personid, column_name, old_value, new_value, done_by) values(NEW.Personid,'FirstName',OLD.FirstName,NEW.FirstName,NEW.updated_by);
    END IF;
	IF OLD.LastName <> new.LastName THEN
        insert into persons_audit_trail(Personid, column_name, old_value, new_value, done_by) values(NEW.Personid,'LastName',OLD.LastName,NEW.LastName,NEW.updated_by);
    END IF;
	IF OLD.Age <> new.Age THEN
        insert into persons_audit_trail(Personid, column_name, old_value, new_value, done_by) values(NEW.Personid,'Age',OLD.Age,NEW.Age,NEW.updated_by);
    END IF;
	IF OLD.is_deleted <> new.is_deleted THEN
        insert into persons_audit_trail(Personid, column_name, old_value, new_value, done_by) values(NEW.Personid,'is_deleted',OLD.is_deleted,NEW.is_deleted,NEW.updated_by);
    END IF;
END$$
DELIMITER ;
```