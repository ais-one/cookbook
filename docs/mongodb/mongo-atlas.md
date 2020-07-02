# Mongo Atlas

## Setup

1. User & Password

2. IP Whitelist

## NodeJS Connection

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://<user>:<password>@<cluster-name>-<random-5-letters>.gcp.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});

## Robomongo / Robo3T Connection

1. Goto a cluster and find primary shard

<cluster-name>-shard-00-01-<random-5-letters>.gcp.mongodb.net:27017

2. Connection Tab

- Type: Direct Connection

- Name: <something-meaningful>

- Address: <cluster-name>-shard-00-01-<random-5-letters>.gcp.mongodb.net

- Port: 27017

3. Authentication Tab

- Perform Authentication: ticked

- Database: admin

- User Name:

- Password:

- Auth Mechanism: SCRAM-SHA-1 / 256 (usually 1)

4. SSL Tab

- Use SSL protocol: ticked

- Authentication Method: Self-signed Certificate
