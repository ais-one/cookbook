const express = require('express')
const { vapidPubKey, sub, unsub, send, test } = require(LIB_PATH + '/services/webpush')

module.exports = express.Router()
  .get('/vapid-public-key', vapidPubKey)
  .post('/sub', sub)
  .post('/unsub', unsub)
  .post('/send', send)
  .get('/test', test)
