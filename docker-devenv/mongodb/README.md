## MongoDB

> pre-requisite: you must have run docker-compose up -d

If you are on VS Code, use the Docker extension

**NOTE:** Remember to initiate replica set in new mongodb installs

### Restore
- copy my-mongo-dump.gz to OS folder data/db1
- attach shell to mongo1 container and cd /data/db
- mongorestore --archive=my-mongo-dump.gz --gzip

### Backup
- attach shell to mongo1 container and cd /data/db
- mongodump --archive=my-mongo-dump.gz --gzip
- copy my-mongo-dump.gz from OS folder data/db1

### fixing lost primary

Run the following command in mongo shell

```
cfg = rs.conf();
cfg.members[0].host = "127.0.0.1:27017";
rs.reconfig(cfg, { force: true });
```

### Client Connection String

```
mongodb://127.0.0.1:27017/testdb-development?readPreference=primary&ssl=false
```
