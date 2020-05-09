// cookbook for mongoDB
const express = require('express')
const mongo = require('../../common-app/mongo')
const { ObjectID } = require('mongodb')
// const { authUser } = require('../../middlewares/auth')

module.exports = express.Router()
  .get('/test', async (req,res) => {
    try {
      const results = mongo ? await mongo.db.collection('mongo-test').find({}).toArray() : []
      console.log(results)
    } catch (e) {
      console.log(e)
    }
    // console.log('mongo connected:', !!mongo)
    res.status(200).json({ message: 'mongo test' })
  })

  .get('/transaction-core-api', async (req,res) => {
    // Using Core API - startTransaction()
    const { defaultTransactionOptions, client } = mongo
    const session = client.startSession({ defaultTransactionOptions }) // for transactions
    session.startTransaction()
    try {
      const rv0 = await mongo.db.collection('mongo-test').insertOne({ name: 'Hello 1', ts: Date.now() }, { session })
      const rv1 = await mongo.db.collection('mongo-test').insertOne({ name: 'Hello 2', ts: Date.now() }, { session })
      // if (!rv0.result.ok || !rv1.result.ok) throw new Error('DB Update Failed')
      await session.commitTransaction()
      res.status(200).json() // success
    } catch (e) {
      await session.abortTransaction()
      res.status(500).json({ e: e.toString() })
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
