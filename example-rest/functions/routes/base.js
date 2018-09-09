const express = require('express')
const baseRoutes = express.Router()
const jwt = require('jsonwebtoken')
// const passport = require('passport')
const bcrypt = require('bcrypt')

const {db, auth} = require('../firebase')
const {authUser, processError} = require('../helpers')

const {createUser} = require('../models')


baseRoutes
  .post('/signup', async (req,res) => {
    const {email, password} = req.body
    // password = bcrypt.hashSync(password, 8)
    const rv = await createUser(email, password)
    res.status(rv).end()
  })
  .post('/login', async (req,res) => {
    const {email, password} = req.body
    try {
      let token = ''
      const user = await auth.getUserByEmail(email)
      await db.runTransaction(async t => {
        const docRef = db.collection('user').doc(user.uid)
        const doc = await t.get(docRef)
        if (!doc.exists) throw new Error(404)
        let tmp = doc.data()
        if (tmp.hash === password) { // bcrypt.compareSync(req.body.password, user.user_pass)
          token = jwt.sign({ uid: user.uid }, 'secret') // , { expiresIn: 10 * 60 } 10 minutes
          tmp.token = token
          await t.set(docRef, tmp)
        }
      })
      if (token) return res.status(200).json({token})
      else throw new Error(500)
    } catch(e) {
      return res.status(500).end()
    }
  })
  .get('/logout', authUser, async (req,res) => {
    try {
      const {uid} = req
      await db.runTransaction(async t => {
        const docRef = db.collection('user').doc(uid)
        const doc = await t.get(docRef)
        if (!doc.exists) throw new Error(404)
        let tmp = doc.data()
        tmp.token = ''
        await t.set(docRef, tmp)
      })
      return res.status(200).end()
    } catch (e) {
      return res.status(500).end()
    }
  })

module.exports = baseRoutes
