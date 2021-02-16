// cookbook for mongoDB
const express = require('express')
const mongo = require('@eslab/node/services/db/mongodb').get()

module.exports = express.Router()
  .get('/test', async (req,res) => {
    let results = { error: 'no mongo' }
    try {
      if (mongo && mongo.db) results = await mongo.db.collection('mongo-test').find({}).toArray()
    } catch (e) {
      results = { error: e.toString() }
    }
    res.status(200).json(results)
  })

  .get('/transaction-core-api', async (req,res) => {
    // Using Core API - startTransaction()
    const { defaultTransactionOptions, client } = mongo
    const session = client.startSession({ defaultTransactionOptions }) // for transactions
    session.startTransaction()
    try {
      // const rv0 =
      await mongo.db.collection('mongo-test').insertOne({ name: 'Hello 1', ts: Date.now() }, { session })
      // const rv1 =
      await mongo.db.collection('mongo-test').insertOne({ name: 'Hello 2', ts: Date.now() }, { session })
      // if (!rv0.result.ok || !rv1.result.ok) throw new Error('DB Update Failed')
      await session.commitTransaction()
      res.status(200).json() // success
    } catch (e) {
      await session.abortTransaction()
      res.status(500).json({ error: e.toString() })
    } finally {
      session.endSession()
    }
  })
  .get('/transaction-callback-api', async (req,res) => {
    // TBD
    // Using Callback API - withTransaction()
    // Starts a transaction, executes the specified operations, and commits (or aborts on error).
    // Automatically incorporates error handling logic for "TransientTransactionError" and "UnknownTransactionCommitResult".
    const { defaultTransactionOptions, client } = mongo
    console.log(defaultTransactionOptions)
    const transactionOptions = {
      readPreference: 'primary',
      readConcern: { level: 'local' },
      writeConcern: { w: 'majority' }
    }
    const session = client.startSession({ defaultTransactionOptions: transactionOptions});
  
    try {
      const transactionResults = await session.withTransaction(async () => {
        // Important:: You must pass the session to the operations
        await mongo.db.collection('mongo-test').insertOne({ name: 'Hello 3', ts: Date.now() }, { session })
        const error = true //  force an error to test
        if (error) {
          await session.abortTransaction()
          return
        }
        await mongo.db.collection('mongo-test').insertOne({ name: 'Hello 4', ts: Date.now() }, { session })
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
    }
  })
