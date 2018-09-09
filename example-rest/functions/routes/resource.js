const uuidv4 = require('uuid/v4')

const express = require('express')
const resourceRoutes = express.Router()

const {db} = require('../firebase')
const {authUser} = require('../helpers')
const {getById} = require('../models')
const getTime = require('date-fns/get_time')
const parse = require('date-fns/parse')

// var FieldValue = admin.FieldValue;
// console.log('aa', admin.firestore())
const Timestamp = require("firebase-admin").firestore.Timestamp

// const abc = new Timestamp(getTime('2018-08-24'), 0)
// console.log(abc)

resourceRoutes
  .get('/:id', authUser, async (req,res) => { // to test...
    const {id} = req.params
    const rv = await getById('resource', id, req.uid, req.adminUid)
    return res.status(rv.status).json(rv.data)
  })
  .get('/', authUser, async (req,res) => { // to test...
    try {
      let records = []
      let query = db.collection('resource')
      if (!req.isAdmin) {
        query = query.where('uid', '==', req.uid)
      } else {
        query = query.where('adminUid', '==', req.adminUid)
        // query = query.where('uid', '==', some UID) // additional filter
      }
      if (req.query.from && req.query.to) {
        const From = parse(req.query.from + 'T00:00:00.000Z')
        const To = parse(req.query.to + 'T23:59:59.999Z')
        query = query.where('createdDate', '>=', From)
        query = query.where('createdDate', '<=', To)
      }
      const rv = await query.limit(50).get()
      rv.forEach(record => {
        let tmp = record.data()
        records.push({id: record.id, ...tmp})
      })
      return res.status(200).json(records)
    } catch (e) {
      // console.log(e)
      return res.status(500).end()
    }
  })
  .post('/', authUser, async (req,res) => {
    try {
      await db.runTransaction(async t => {
        let _uid = req.uid // assume user created first
        if (req.isAdmin && req.body.uid) { // admin created check info
          _uid = req.body.uid
        }
 
        // const resourceRef = db.collection('resource').doc(id)
        const userRef = db.collection('user').doc(_uid)
        const userDoc = await t.get(userRef)
        if (!userDoc.exists) throw new Error(404)
        const user = userDoc.data()

        if (req.isAdmin && req.body.uid) { // admin created check info
          if (!(req.body.uid === userDoc.id && req.adminUid === user.adminUid)) throw new Error(403)
        }

        // console.log(user.quotaUsed, user.quotaAllocated, user)
        if (user.quotaUsed >= user.quotaAllocated) {
          throw new Error(422)
        }

        const newResourceRef = db.collection('resource').doc()
        await t.set(newResourceRef, {
          uid: _uid,
          adminUid: req.adminUid,
          resourceId: uuidv4(),
          createdDate: new Date()
        })
        await t.update(userRef, { quotaUsed: user.quotaUsed + 1  })
      })
      return res.status(201).end()
    } catch (e) {
      const code = parseInt(e.message)
      if (code === 404 || code === 403 || code === 422)
        res.status(code).end()
      else
        res.status(500).end()
    }
  })
  .put('/:id', async (req,res) => { // Not Needed
    const {id} = req.params
    res.status(404).json({})
  })
  .delete('/:id', authUser, async (req,res) => { // To Test
    try {
      const {id} = req.params
      // remove if is owner or is admin of the owner
      await db.runTransaction(async t => {
        const resourceRef = db.collection('resource').doc(id)
        const resourceDoc = await t.get(resourceRef)
        if (!resourceDoc.exists) throw new Error(404)
        const resource = resourceDoc.data()

        const userRef = db.collection('user').doc(resource.uid)
        const userDoc = await t.get(userRef)
        if (!userDoc.exists) throw new Error(404)

        if (req.isAssetAdmin(resource.adminUid) || req.isAssetOwner(resource.uid))
          await t.delete(resourceRef)
        else
          throw new Error(403) // forbidden
        await t.update(userRef, { quotaUsed:  userDoc.data().quotaUsed - 1 });
      })
      return res.status(200).end()  
    } catch (e) {
      return res.status(500).end()
    }
  })

module.exports = resourceRoutes
