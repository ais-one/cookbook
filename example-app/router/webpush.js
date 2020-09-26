const express = require('express')
const { vapidPubKey, sub, unsub } = require(LIB_PATH + '/services/webpush')

module.exports = express.Router()
  .get('/vapid-public-key', vapidPubKey)
  .post('/sub', sub)
  .post('/unsub', unsub)
