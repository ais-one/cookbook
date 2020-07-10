# Mongo DB - WORK IN PROGRESS

## Docker Installation (With Replica Set) on WSL2 Ubuntu

Reference : https://github.com/ais-one/docker-devenv

## Import & Export - Non Production

mongoimport --db ahop --collection mdh-snapshot --file mdh-snapshot.json
mongoexport --db ahop --collection mdh-snapshot --out mdh-snapshot.json --jsonArray
mongoexport --db ahop --collection vts-hist --out vts-hist.json --jsonArray
mongoexport --db ahop --collection job --out job.json --jsonArray


mongodump --archive=mdh.gz --gzip --db ahop --collection mdh-snapshot
mongodump --db ahop --collection mdh-snapshot
mongorestore --db ahop --collection mdh-snapshot --archive=mdh.gz --gzip
mongorestore --db ahop --collection mdh-snapshot dump/ahop/mdh-snapshot.bson --writeConcern '{w:0}'
mongodump --db ahop --archive=db.archive
mongorestore --db ahop --archive=db.archive

mongodump --archive=db.gz --gzip
mongorestore --archive=db.gz --gzip


## Outstanding Issues

1. Cannot reconnect if there is no initial connection
- If there is no connection initially, connection failure will not result in reconnection
- does happen, to test out. shutdown mongo server, wait awhile then start up. CRUD will take effect and updates will take effect also...

2. See if InMemory storage to replace redis
- how to handle memory limit? remove oldest?

3. Design and code for high availability and scalability

## Change Streams

https://docs.mongodb.com/manual/changeStreams/

## watch changes

in mongo client, run rs.initiate() - but how to start mongo rs without calling this command?

```
.\bin\mongod.exe --dbpath .\bin\data --port 27017 --replSet rs0
```

```js
mongo.stream = db.db('mm').collection('exchangeUsers').watch()
    mongo.stream.on('change', (change) => {
    console.log(change); // You could parse out the needed info and send only that data.
    // use websocket to listen to changes
})
```

## replace

```js
{
  _id: { 
    _data: '825D07B9C7000000012B022C0100296E5A10046D79825AAFE447EE93D29D46B0D1AF5846645F696400645CE20EDD520C352CBCF453E80004'
  },
  operationType: 'replace',
  clusterTime: Timestamp { _bsontype: 'Timestamp', low_: 1, high_: 1560787399 },
  fullDocument: {
    _id: 5ce20edd520c352cbcf453e8,
    username: 'user5a',
    email: 'user5',
    clientId: '5c9b1eb8cb3521eccb35431b',
    password: '$2a$12$1K.MWGt6Ez30WJ05mYAK6u/dvjoce0O.IATL2TYxLGxCv2rju9ccS',
    gaKey: 'IZDXCUDYNQ4ESMZZNY4HGZSDJRAVGZCO',
    sms: '',
    smsLastSent: null,
    smsOtpPin: '',
    smsVerified: 0,
    telegramId: '',
    telegramUsername: '',
    role: 'user'
  },
  ns: { db: 'mm', coll: 'exchangeUsers' },
  documentKey: { _id: 5ce20edd520c352cbcf453e8 }
}
```

## insert

```js
{ _id:
   { _data:
      '825D07BBBC000000012B022C0100296E5A10046D79825AAFE447EE93D29D46B0D1AF5846645F696400645D07BBBCCAABD31DCDB648950004' },
  operationType: 'insert',
  clusterTime:
   Timestamp { _bsontype: 'Timestamp', low_: 1, high_: 1560787900 },
  fullDocument:
   { _id: 5d07bbbccaabd31dcdb64895,
     username: 'user6aa',
     email: 'user6aa',
     clientId: '5c9b1eb8cb3521eccb35431b',
     password:
      '$2a$12$1K.MWGt6Ez30WJ05mYAK6u/dvjoce0O.IATL2TYxLGxCv2rju9ccS',
     gaKey: 'IZDXCUDYNQ4ESMZZNY4HGZSDJRAVGZCO',
     sms: '',
     smsLastSent: null,
     smsOtpPin: '',
     smsVerified: 0,
     telegramId: '',
     telegramUsername: '',
     role: 'user' },
  ns: { db: 'mm', coll: 'exchangeUsers' },
  documentKey: { _id: 5d07bbbccaabd31dcdb64895 } }
```

## delete

```js
{ _id:
   { _data:
      '825D07BBEF000000012B022C0100296E5A10046D79825AAFE447EE93D29D46B0D1AF5846645F696400645D07BBBCCAABD31DCDB648950004' },
  operationType: 'delete',
  clusterTime:
   Timestamp { _bsontype: 'Timestamp', low_: 1, high_: 1560787951 },
  ns: { db: 'mm', coll: 'exchangeUsers' },
  documentKey: { _id: 5d07bbbccaabd31dcdb64895 }
}
```

```json
{
  "_id":{
  "_data":"825C5D51F70000000129295A1004E83608EE8F1B4FBABDCEE73D5BF31FC946645F696400645C5D51F73ACA83479B48DE6E0004"},
  "operationType":"insert",
  "clusterTime":"6655565945622233089",
  "fullDocument":{
  "_id":"5c5d51f73aca83479b48de6e",
  "ticker":"AAPL",
  "Price":300
  },
  "ns":{"db":"mydb","coll":"Stocks"},
  "documentKey":{"_id":"5c5d51f73aca83479b48de6e"}
}
```

# TRANSACTIONS

https://docs.mongodb.com/manual/core/transactions/
https://www.mongodb.com/blog/post/quick-start-nodejs--mongodb--how-to-implement-transactions


```js
  const transactionOptions = {
    readPreference: 'primary',
    readConcern: { level: 'local' },
    writeConcern: { w: 'majority' }
  }
  const session = client.startSession({ defaultTransactionOptions: transactionOptions});

  // Using Callback API - withTransaction()
  // Starts a transaction, executes the specified operations, and commits (or aborts on error).
  // Automatically incorporates error handling logic for "TransientTransactionError" and "UnknownTransactionCommitResult".
  try {
    const transactionResults = await session.withTransaction(async () => {
      // Important:: You must pass the session to the operations
      await client.db('mydb1').collection('foo').insertOne({ abc: 1 }, { session })

      const error = true //  force an error to test
      if (error) {
        await session.abortTransaction()
        return
      }
      await client.db('mydb2').collection('bar').insertOne({ xyz: 999 }, { session })
    }, transactionOptions) // you can set your own transaction options here also
    if (transactionResults) {
      console.log("transaction successful");
    } else {
      console.log("transaction intentionally aborted");
    }
  } catch(e){
    console.log("transaction aborted due unexpected error: " + e);
  } finally {
    await session.endSession()
    await client.close()
  }

  // Using Core API - startTransaction()
  // Requires explicit call to start the transaction and commit the transacdtion.
  // Does not incorporate error handling logic for "TransientTransactionError" and "UnknownTransactionCommitResult", and instead provides the flexibility to incorporate custom error handling for these errors.
  session.startTransaction()
  try {
    await client.db('mydb1').collection('foo').insertOne({ abc: 1 }, { session })
    const error = true //  force an error to test
    if (error) throw new Error('Force an error')
    await client.db('mydb2').collection('bar').insertOne({ xyz: 999 }, { session })
    await session.commitTransaction()
  } catch(e) {
    await session.abortTransaction()
  } finally {
    await session.endSession()
  }

```


## Relations And Using Aggregate

### Create the collections

```js
db.getCollection('dd_author').insertMany([
  {
    "_id" : ObjectId("5cdb5249525a06edd9634e1f"),
    "name" : "aaron",
    "code" : "aa"
  },
  {
    "_id" : ObjectId("5cdb5258525a06edd9634e23"),
    "name" : "ben",
    "code" : "bb"
  }
])

db.getCollection('dd_cat').insertMany([
  {
    name: "cat1",
    code: "c1"
  },
  {
    name: "cat2",
    code: "c2"
  }
])

db.getCollection('dd_book').insertMany([
  {
      "_id" : ObjectId("5cdb5282525a06edd9634e2f"),
      "name" : "book a",
      "author" : ObjectId("5cdb5249525a06edd9634e1f"),
      "authorCode" : "bb",
      "catCode:": "c1"
  },
  {
      "_id" : ObjectId("5cdb52a0525a06edd9634e36"),
      "name" : "book b",
      "author" : ObjectId("5cdb5258525a06edd9634e23"),
      "authorCode" : "bb",
      "catCode:": "c2"
  },
  {
      "_id" : ObjectId("5cdb5359525a06edd9634e4e"),
      "name" : "book c",
      "author" : ObjectId("5cdb5249525a06edd9634e1f"),
      "authorCode" : "bb",
      "catCode:": "c1"
  }
])
```

### The Queries

```js
db.getCollection('dd_book').aggregate([ { $lookup: {from: "dd_author", localField:"author", foreignField:"_id", as: "in_common" }}])

db.getCollection('dd_book').aggregate([
  { $lookup: {from: "dd_author", localField:"authorCode", foreignField:"code", as: "author_info" }},
  { $lookup: {from: "dd_cat", localField:"catCode", foreignField:"code", as: "cat_info" }}
])

// in pipeline{ $replaceRoot: { newRoot: "$date" } },

db.getCollection('dd_book').aggregate([
  {
    $lookup: {
      from: "dd_author",
      let: { author_code: "$authorCode" },
      pipeline: [
        {
          $match: { 
            $expr: { $eq: [ "$code",  "$$author_code" ] },
          }
        },
        { $project: { _id: 0, code: 0 } }
      ],
      as: "author_details"
    }
  },
  {
    $lookup: {
      from: "dd_cat",
      let: { cat_code: "$catCode" },
      pipeline: [
        {
          $match: { 
            $expr: { $eq: [ "$code",  "$$cat_code" ] },
          }
        },
        { $project: { _id: 0, code: 0 } }
      ],
      as: "cat_details"
    }
  }
]) 
```


## Search

```js
const { start, end, page = 1, limit = 50 } = req.query
const filter = {
  userId: req.decoded.id,
  txTs: {
    // $gte: new Date(start + 'T00:00:00.000Z'),
    // $lte: new Date(end + 'T23:59:59.999Z')
    $gte: parseInt(start),
    $lte: parseInt(end)
  }
}
if (filename) filter.filename = { $regex: filename, $options: 'i' }
try {
  const total = await mongo.db.collection('aaa').find(filter).count()
  const results = await mongo.db.collection('aaa').find(filter, { userId: 1, txTs: 1 })
    // .project({ item: 1, status: 1 });
    .sort({ txTs: -1 }).skip( (page - 1) * limit ).limit(limit).toArray()
  res.status(200).json({ results, total })
} catch (e) {
  res.status(500).json({ e: e.toString() })
}
```

## field update operators

https://docs.mongodb.com/manual/reference/operator/update-field/
