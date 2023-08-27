'use strict'
// working SAML ADFS example
// no refresh token, issue own OAuth2 like JWT server
const express = require('express')
const { login, auth } = require('@es-labs/node/express/controller/auth/oidc')

module.exports = express.Router()
  .get('/login', login)
  // .get('/fail', (req, res) => res.status(401).send('Login Fail')
  .post('/callback', auth)

