'use strict'

const express = require('express')

module.exports = express.Router()
  .get('/', (req, res) => res.send('app-template/ OK'))
  .get('/healthcheck', (req, res) => res.send('app-template/healthcheck OK'))
