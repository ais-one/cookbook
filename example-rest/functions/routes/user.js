const express = require('express')
const userRoutes = express.Router()

const {db, auth} = require('../firebase')
const {authUser} = require('../helpers')

const {createUser, getById} = require('../models')

userRoutes
  .get('/:id', authUser, async (req,res) => { // to test...
    const {id} = req.params
    const rv = await getById('user', id, req.uid, req.adminUid)
    if (rv.status === 200)
      return res.status(rv.status).json(rv.data)
    else
      return res.status(rv.status).end()
  })
  .get('/', authUser, async (req,res) => { // to test
    try {
      let records = []
      let query = db.collection('user')
      if (req.isAdmin) {
        query = query.where('adminUid', '==', req.adminUid)
        if (req.query.email) {
          query = query.where('email', '==', req.query.email)
        }
        const rv = await query.limit(50).get()
        rv.forEach(record => {
          let tmp = record.data()
          records.push({id: record.id, ...tmp})
        })
      }
      return res.status(200).json(records)
    } catch (e) {
      return res.status(500).end()
    }
  })
  .post('/', authUser, async (req,res) => {
    let rv = 403
    if (req.isAdmin) { // must be admin
      const {email, password} = req.body
      rv = await createUser(email, password, req.uid)
    }
    res.status(rv).end()
  })
  .put('/:id', authUser, async (req,res) => {
    try {
      const {id} = req.params
      const {quotaAllocated} = req.body
      await db.runTransaction(async t => {
        const docRef = db.collection('user').doc(id)
        const doc = await t.get(docRef)
        if (!doc.exists) throw new Error(404)
        const tmp = doc.data()
        if (req.isAssetAdmin(tmp.adminUid) || req.isAssetOwner(tmp.uid)) {
          if (quotaAllocated > tmp.quotaUsed) {
            tmp.quotaAllocated = quotaAllocated // Change Quota
            await t.set(docRef, tmp)
          } else throw new Error(422) // some error
        } else throw new Error(403) // forbidden
      })
      res.status(200).end()
    } catch (e) {
      const code = parseInt(e.message)
      if (code === 403 || code === 422) res.status(code).end()
      else res.status(500).end()
    }
  })
  .delete('/:id', authUser, async (req,res) => { // to test
    // TBD only admin can do so
    const {id} = req.params
    try {
      if (req.isAdmin) { // must be admin
        const docRef = db.collection('user').doc(id)
        const doc = await docRef.get()
        if (!doc.exists) throw new Error(404) // user not found
        let tmp = doc.data()
        if (tmp.uid === req.uid) throw new Error(403) // cannot delete ownself
        if (req.isAssetAdmin(tmp.adminUid)) {
          await auth.deleteUser(id)
          await docRef.delete()
          // Delete All Resources - may have a timeout problem if running on lambda, and many things to delete
          const batch = db.batch()
          const docs = await db.collection('resource').where('uid', '==', id).limit(500).get()
          docs.forEach(async (doc) => {
            await batch.delete( db.collection('resource').doc(doc.id) );
          })
          await batch.commit()
          return res.status(200).end()
        }
      }
      throw new Error(403)
    } catch (e) {
      const code = parseInt(e.message)
      if (code === 403 || code === 404 || code === 422)
        res.status(code).end()
      else
        res.status(500).end()
    }
  })

module.exports = userRoutes
