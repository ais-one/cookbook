'use strict'
const express = require('express')
const auth = require('@es-labs/node/auth')
const own = require('@es-labs/node/express/controller/auth/own')
const oauth = require('@es-labs/node/express/controller/auth/oauth')
const oidc = require('@es-labs/node/express/controller/auth/oidc')
const saml = require('@es-labs/node/express/controller/auth/oidc')

exports.myauthRoute = express.Router()
  .post('/login', own.login)
  .post('/otp', own.otp)
  .post('/refresh', auth.authRefresh)
  .get('/logout', own.logout)
  .get('/verify', auth.authUser, async (req, res) => res.json({}))
  .get('/me', auth.authUser, (req, res) => {
    try {
      const { id } = req.decoded
      // you can also get more user information from here from a datastore
      return res.status(200).json({ user: id, ts: Date.now() })
    } catch (e) {
      return res.status(500).json({ message: e.toString() })
    }
  })
  .post('/signup', (req, res) => {
    // NOSONAR let encryptedPassword = bcrypt.hashSync(clearPassword, process.env.SALT_ROUNDS)
    res.status(201).end()
  })


exports.oauthRoute = express.Router().get('/callback', oauth.callbackOAuth)

exports.oidcRoute = express.Router()
  .get('/login', oidc.login)
  .get('/auth', oidc.auth)
  .get('/refresh', oidc.refresh)

exports.samlRoute = express.Router()
  .get('/login', saml.login)
  .post('/callback', saml.auth)

