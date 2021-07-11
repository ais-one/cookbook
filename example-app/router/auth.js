'use strict'
const { revokeToken, logout, login, otp } = require('@es-labs/node/auth')

const express = require('express')
const { authUser, authRefresh } = require('@es-labs/node/auth')

module.exports = express.Router()
  .post('/login', login)
  .post('/otp', otp)
  .post('/refresh', authRefresh)
  .get('/logout', logout)
  .get('/verify', authUser, asyncWrapper( async (req, res) => res.json({}) ))
  .get('/me', authUser, (req, res) => {
    try {
      const { id } = req.decoded
      // you can also get more user information from here from a datastore
      return res.status(200).json({ user: id, ts: Date.now() })
    } catch (e) {
      return res.status(500).json({ message: e.toString() })
    }
  })
  .post('/signup', (req, res) => {
    // let encryptedPassword = bcrypt.hashSync(clearPassword, SALT_ROUNDS)
    res.status(201).end()
  })
