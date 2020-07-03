## MongoDB

> pre-requisite: you must have run docker-compose up -d

If you are on VS Code, use the Docker extension

### Restore
- copy my-mongo-dump.gz to OS folder data/db1
- attach shell to mongo1 container and cd /data/db
- mongorestore --archive=my-mongo-dump.gz --gzip

### Backup
- attach shell to mongo1 container and cd /data/db
- mongodump --archive=my-mongo-dump.gz --gzip
- copy my-mongo-dump.gz from OS folder data/db1
