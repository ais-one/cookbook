// test for mongoDB
const express = require('express')
const jobRoutes = express.Router()

const mongo = require('../services/mongo')
const { ObjectID } = require('mongodb')

/*
jobId
boatNumber: []
company: [cash, ...]
contact: []
master: []
vessel
location: []
remarks
pax
orderDateTime
jobType: [up, down, 2way]
base: [WCP, MSP]
purpose
updatedBy
updatedTime
*/

jobRoutes
  .get('/mongo-test', async (req,res) => {
    try {
      const results = mongo ? await mongo.db.collection('jobs').find({}).toArray() : []
      console.log(results)
    } catch (e) {
      console.log(e)
    }
    // console.log('mongo connected:', !!mongo)
    res.status(200).json({ message: 'mongo test' })
  })

  .post('/jobs', authUser, async (req, res) => {
    try {
      const { insertedId } = await mongo.db.collection('jobs').insertOne({
        ...req.body
      })
      return res.status(201).json({ _id: insertedId, ...req.body })
    } catch (e) { }
    return res.status(500).json()
  })
  .patch('/jobs/:id', authUser, async (req, res) => {
    try {
      await mongo.db.collection('jobs').updateOne( // findOneAndUpdate
        {
          _id: new ObjectID(req.params.id)
        },{
          $set: req.body
        },
        // { returnNewDocument : true }
      )
      return res.status(200).json({ _id: req.params.id, ...req.body })
    } catch (e) { }
    return res.status(500).json()
  })
  .delete('/jobs/:id', authUser, async (req, res) => {
    try {
      const { deletedCount } = await mongo.db.collection('jobs').deleteOne({ _id: new ObjectID(req.params.id) })
      return res.status(200).json({ _id: req.params.id })
    } catch (e) { }
    return res.status(500).json()
  }) 
  .get('/jobs/:id', authUser, async (req, res) => {
    try {
      let result = {}
      result = await mongo.db.collection('coins').findOne({c_id: new ObjectID(req.params.id) })
      return res.status(200).json(result)
    } catch (e) { }
    return res.status(500).json()
  })
  .get('/jobs', authUser, async (req, res) => {
    try {
      // const limit = req.query.limit ? req.query.limit : 2
      // const page = req.query.page ? req.query.page : 0
      // const categories = await Category.query()
      //   // .orderBy('created_at', 'desc')
      //   .page(page, limit)
      // return res.status(200).json(categories)  
    } catch (e) { }
    return res.status(500).json()
  })

module.exports = jobRoutes
