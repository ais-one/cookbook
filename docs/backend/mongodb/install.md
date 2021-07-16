# MongoDB Community Edition Installation


## Linux

Follow instructions in https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu

## WSL

Follow instructions in https://dev.to/zenika/setup-mongodb-on-wsl-ubuntu-18-04-167

## Windows

Download and unzip from https://www.mongodb.com/try/download/community

Create **data** folder in mongodb root folder

Create a batch file (e.g. run.bat) to start up mongodb

```bat
.\bin\mongod.exe --dbpath .\data --port 27017 --replSet rs0 --bind_ip 127.0.0.1
```

Do one-time initilization of Replica Set

```
rs.initiate()
rs.status()
```

Commands to import or export your data

```
.\bin\mongodump.exe --archive=dump-mongo
.\bin\mongorestore.exe --archive=dump-mongo
```

## Docker (WSL or Linux)

Reference : [../../docker-devenv/mongodb](../../docker-devenv/mongodb)


https://github.com/microsoft/WSL/issues/796
https://raw.githubusercontent.com/mongodb/mongo/master/debian/init.d

sudo nano /etc/init.d/mongod
sudo chmod +x /etc/init.d/mongod
sudo service mongod start

/etc/mongod.conf
replication:
   oplogSizeMB: <int>
   replSetName: <string>
   enableMajorityReadConcern: <boolean>



## Mongo Atlas

### Setup

1. User & Password
2. IP Whitelist

### NodeJS Connection

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://<user>:<password>@<cluster-name>-<random-5-letters>.gcp.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});

### Robomongo / Robo3T Connection To Replica Set

1. Get connection string
2. At Connection Tab, Select Type: Replica Set
3. Paste connection string to text box next to **From SRV** button, then click that button

