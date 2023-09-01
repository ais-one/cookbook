# MongoDB Community Edition Installation

## Docker (WSL or Linux)

Reference : [../../docker-devenv/mongodb](../../docker-devenv/mongodb)

## Client

Use VSCode mongodb oficial plugin

## Mongo DB Notes

## Dump & Restore - For Non Replica Set or Local development backups

mongodump --zip --archive=<file> --db <db-name> --collection <collection-name>
mongorestore --zip --archive=<file> --db <db-name> --collection <collection-name>

```bash
mongodump --gzip --archive=db.gz
mongorestore --gzip --archive=db.gz

mongodump --gzip --archive=db.archive --db ahop
mongorestore --gzip --archive=db.archive --db ahop

mongodump --gzip --archive=mdh.gz --db ahop --collection mdh-snapshot
mongorestore --gzip --archive=mdh.gz --db ahop --collection mdh-snapshot
```

## Import & Export - Non Production

mongoimport --db ahop --collection mdh-snapshot --file mdh-snapshot.json
mongoexport --db ahop --collection mdh-snapshot --out mdh-snapshot.json --jsonArray
mongoexport --db ahop --collection vts-hist --out vts-hist.json --jsonArray
mongoexport --db ahop --collection job --out job.json --jsonArray

--type=csv
--fields=f1,f2,f3

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
mongo.stream = db.db("mm").collection("exchangeUsers").watch();
mongo.stream.on("change", (change) => {
  console.log(change); // You could parse out the needed info and send only that data.
  // use websocket to listen to changes
});
```

## TRANSACTIONS

https://docs.mongodb.com/manual/core/transactions/
https://www.mongodb.com/blog/post/quick-start-nodejs--mongodb--how-to-implement-transactions

```js
const transactionOptions = {
  readPreference: "primary",
  readConcern: { level: "local" },
  writeConcern: { w: "majority" },
};
const session = client.startSession({
  defaultTransactionOptions: transactionOptions,
});

// Using Callback API - withTransaction()
// Starts a transaction, executes the specified operations, and commits (or aborts on error).
// Automatically incorporates error handling logic for "TransientTransactionError" and "UnknownTransactionCommitResult".
try {
  const transactionResults = await session.withTransaction(async () => {
    // Important:: You must pass the session to the operations
    await client
      .db("mydb1")
      .collection("foo")
      .insertOne({ abc: 1 }, { session });

    const error = true; //  force an error to test
    if (error) {
      await session.abortTransaction();
      return;
    }
    await client
      .db("mydb2")
      .collection("bar")
      .insertOne({ xyz: 999 }, { session });
  }, transactionOptions); // you can set your own transaction options here also
  if (transactionResults) {
    console.log("transaction successful");
  } else {
    console.log("transaction intentionally aborted");
  }
} catch (e) {
  console.log("transaction aborted due unexpected error: " + e);
} finally {
  await session.endSession();
  await client.close();
}

// Using Core API - startTransaction()
// Requires explicit call to start the transaction and commit the transacdtion.
// Does not incorporate error handling logic for "TransientTransactionError" and "UnknownTransactionCommitResult", and instead provides the flexibility to incorporate custom error handling for these errors.
session.startTransaction();
try {
  await client.db("mydb1").collection("foo").insertOne({ abc: 1 }, { session });
  const error = true; //  force an error to test
  if (error) throw new Error("Force an error");
  await client
    .db("mydb2")
    .collection("bar")
    .insertOne({ xyz: 999 }, { session });
  await session.commitTransaction();
} catch (e) {
  await session.abortTransaction();
} finally {
  await session.endSession();
}
```

## Relations And Using Aggregate

### Create the collections

```js
db.getCollection("dd_author").insertMany([
  {
    _id: ObjectID("5cdb5249525a06edd9634e1f"),
    name: "aaron",
    code: "aa",
  },
  {
    _id: ObjectID("5cdb5258525a06edd9634e23"),
    name: "ben",
    code: "bb",
  },
]);

db.getCollection("dd_cat").insertMany([
  {
    name: "cat1",
    code: "c1",
  },
  {
    name: "cat2",
    code: "c2",
  },
]);

db.getCollection("dd_book").insertMany([
  {
    _id: ObjectID("5cdb5282525a06edd9634e2f"),
    name: "book a",
    author: ObjectID("5cdb5249525a06edd9634e1f"),
    authorCode: "bb",
    "catCode:": "c1",
  },
  {
    _id: ObjectID("5cdb52a0525a06edd9634e36"),
    name: "book b",
    author: ObjectID("5cdb5258525a06edd9634e23"),
    authorCode: "bb",
    "catCode:": "c2",
  },
  {
    _id: ObjectID("5cdb5359525a06edd9634e4e"),
    name: "book c",
    author: ObjectID("5cdb5249525a06edd9634e1f"),
    authorCode: "bb",
    "catCode:": "c1",
  },
]);
```

### The Queries

```js
db.getCollection("dd_book").aggregate([
  {
    $lookup: {
      from: "dd_author",
      localField: "author",
      foreignField: "_id",
      as: "in_common",
    },
  },
]);

db.getCollection("dd_book").aggregate([
  {
    $lookup: {
      from: "dd_author",
      localField: "authorCode",
      foreignField: "code",
      as: "author_info",
    },
  },
  {
    $lookup: {
      from: "dd_cat",
      localField: "catCode",
      foreignField: "code",
      as: "cat_info",
    },
  },
]);

// in pipeline{ $replaceRoot: { newRoot: "$date" } },

db.getCollection("dd_book").aggregate([
  {
    $lookup: {
      from: "dd_author",
      let: { author_code: "$authorCode" },
      pipeline: [
        {
          $match: {
            $expr: { $eq: ["$code", "$$author_code"] },
          },
        },
        { $project: { _id: 0, code: 0 } },
      ],
      as: "author_details",
    },
  },
  {
    $lookup: {
      from: "dd_cat",
      let: { cat_code: "$catCode" },
      pipeline: [
        {
          $match: {
            $expr: { $eq: ["$code", "$$cat_code"] },
          },
        },
        { $project: { _id: 0, code: 0 } },
      ],
      as: "cat_details",
    },
  },
]);
```

## Search

```js
const { start, end, page = 1, limit = 50 } = req.query;
const filter = {
  userId: req.decoded.id,
  txTs: {
    // $gte: new Date(start + 'T00:00:00.000Z'),
    // $lte: new Date(end + 'T23:59:59.999Z')
    $gte: parseInt(start),
    $lte: parseInt(end),
  },
};
if (filename) filter.filename = { $regex: filename, $options: "i" };
try {
  const total = await mongo.db.collection("aaa").find(filter).count();
  const results = await mongo.db
    .collection("aaa")
    .find(filter, { userId: 1, txTs: 1 })
    // .project({ item: 1, status: 1 });
    .sort({ txTs: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray();
  res.status(200).json({ results, total });
} catch (e) {
  res.status(500).json({ e: e.toString() });
}
```

## field update operators

https://docs.mongodb.com/manual/reference/operator/update-field/

## Bulk Write

Two methods available (method 1 seems more intuitive)

- http://mongodb.github.io/node-mongodb-native/3.5/tutorials/crud/#bulkwrite

  - http://mongodb.github.io/node-mongodb-native/3.5/api/Collection.html#bulkWrite

- http://mongodb.github.io/node-mongodb-native/3.5/tutorials/crud/#bulk-write-operations

- bulkWrite can have the following 6 operations: insertOne, updateOne, updateMany, deleteOne, deleteMany, replaceOne
- up to 1000 operations allowed, ordered flag true aborts on error

```js
const writeOps = facilities.map((facility) => {
  const createdAt = new Date(facility.createdAt + " +0800");
  const op = {
    updateOne: {
      filter: { spaceoutId: facility.id, createdAt },
      update: {
        $set: {
          spaceoutId: facility.id,
          trend: facility.trend,
          band: facility.band,
          createdAt,
        },
      },
      upsert: true,
    },
  };
  return op;
});
const dbRv = await db.collection("crowdlevels").bulkWrite(writeOps);
```

# Schema Validation

- https://developer.mongodb.com/article/mongoose-versus-nodejs-driver
- https://stackoverflow.com/questions/36439780/mongoose-schema-vs-mongo-validator
- https://www.mongodb.com/blog/post/json-schema-validation--locking-down-your-model-the-smart-way
- https://docs.mongodb.com/manual/core/schema-validation/

```js
db.createCollection("contacts2", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["phone", "name"],
      additionalProperties: false,
      properties: {
        _id: {},
        phone: {
          bsonType: "string",
          description: "must be a string and is required",
        },
        email: {
          bsonType: "string",
          pattern: "@mongodb.com$",
          description:
            "must be a string and match the regular expression pattern",
        },
        status: {
          enum: ["Unknown", "Incomplete"],
          description: "can only be one of the enum values",
        },

        name: {
          bsonType: "string",
          description: "must be a string and is required",
        },
        year: {
          bsonType: "int",
          minimum: 2017,
          maximum: 3017,
          description: "must be an integer in [ 2017, 3017 ] and is required",
        },
        major: {
          enum: ["Math", "English", "Computer Science", "History", null],
          description: "can only be one of the enum values and is required",
        },
        gpa: {
          bsonType: ["double"],
          description: "must be a double if the field exists",
        },
        address: {
          bsonType: "object",
          required: ["city"],
          properties: {
            street: {
              bsonType: "string",
              description: "must be a string if the field exists",
            },
            city: {
              bsonType: "string",
              description: "must be a string and is required",
            },
          },
        },
      },
    },
  },
  validationAction: "error", // warn
  validationLevel: "strict", // moderate
});
```

```js
db.createCollection("recipes", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["servings", "ingredients"],
      additionalProperties: false,
      properties: {
        _id: {},
        servings: {
          bsonType: ["int", "double"],
          minimum: 0,
          description:
            "'servings' is required and must be an integer with a minimum of zero.",
        },
        ingredients: {
          bsonType: ["array"],
          minItems: 1,
          maxItems: 50,
          items: {
            bsonType: ["object"],
            required: ["quantity", "measure", "ingredient"],
            additionalProperties: false,
            description: "'ingredients' must contain the stated fields.",
            properties: {
              quantity: {
                bsonType: ["int", "double", "decimal"],
                description:
                  "'quantity' is required and is of double or decimal type",
              },
              measure: {
                enum: ["tsp", "Tbsp", "cup", "ounce", "pound", "each"],
                description:
                  "'measure' is required and can only be one of the given enum values",
              },
            },
          },
        },
      },
    },
  },
});
```
