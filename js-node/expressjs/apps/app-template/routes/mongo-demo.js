'use strict'

// cookbook for mongoDB
const express = require('express')
const s = require('../services')

module.exports = express.Router()
  .get('/test', async (req,res) => {
    let results = { error: 'no mongo' }
    try {
      if (s.mongo1.mongo.db) results = await s.mongo1.mongo.db.collection('mongo-test').find({}).toArray()
    } catch (e) {
      results = { error: e.toString() }
    }
    res.status(200).json(results)
  })

  .get('/transaction-core-api', async (req,res) => {
    // Using Core API - startTransaction()
    const { defaultTransactionOptions, client } = s.mongo1.mongo
    const session = client.startSession({ defaultTransactionOptions }) // for transactions
    session.startTransaction()
    try {
      // const rv0 =
      await s.mongo1.mongo.db.collection('mongo-test').insertOne({ name: 'Hello 1', ts: Date.now() }, { session })
      // const rv1 =
      await s.mongo1.mongo.db.collection('mongo-test').insertOne({ name: 'Hello 2', ts: Date.now() }, { session })
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
    // TBD - TOTEST
    // Using Callback API - withTransaction()
    // Starts a transaction, executes the specified operations, and commits (or aborts on error).
    // Automatically incorporates error handling logic for "TransientTransactionError" and "UnknownTransactionCommitResult".
    let transactionResults = null
    let error = null
    const { defaultTransactionOptions, client } = s.mongo1.mongo
    const transactionOptions = {
      readPreference: 'primary',
      readConcern: { level: 'local' },
      writeConcern: { w: 'majority' }
    }
    const session = client.startSession({ defaultTransactionOptions: transactionOptions});
  
    try {
      transactionResults = await session.withTransaction(async () => {
        // Important:: You must pass the session to the operations
        await s.mongo1.mongo.db.collection('mongo-test').insertOne({ name: 'Hello 3', ts: Date.now() }, { session })
        const error = true //  force an error to test
        if (error) {
          await session.abortTransaction()
          return
        }
        await s.mongo1.mongo.db.collection('mongo-test').insertOne({ name: 'Hello 4', ts: Date.now() }, { session })
      }, transactionOptions) // you can set your own transaction options here also
    } catch(e){
      error = e.toString()
      console.error("Transaction aborted due unexpected error: " + e);
    } finally {
      await session.endSession()
    }
    return transactionResults ? res.json({ msg: 'transaction successful' }) : res.status(500).json({ msg: 'transaction aborted', error })
  })
