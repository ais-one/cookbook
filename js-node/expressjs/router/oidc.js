'use strict'

const express = require('express')
const { login, auth, refresh } = require('@es-labs/node/express/controller/auth/oidc')

module.exports = express.Router()
  .get('/login', login)
  .get('/auth', auth)
  .get('/refresh', refresh)

