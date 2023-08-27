'use strict'

const express = require('express')
const { callbackOAuth } = require('@es-labs/node/express/controller/auth/oauth')

module.exports = express.Router()
  .get('/callback', callbackOAuth)
