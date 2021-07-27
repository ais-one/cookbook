'use strict'

const express = require('express')
const { authUser, findUser, updateUser } = require('@es-labs/node/auth')
const fcm = require('@es-labs/node/comms/fcm')
const webpush = require('@es-labs/node/comms/webpush')

fcm.setup(global.CONFIG)
webpush.setup(global.CONFIG)

module.exports = express.Router()
  .get('/vapid-public-key', (req, res) => res.json({ publicKey: webpush.getPubKey() }))
  .post('/sub', authUser, asyncWrapper(async (req, res) => {
    const { id } = req.decoded
    const { subscription } = req.body // should be a string
    await updateUser({ id }, { pnToken: subscription })
    res.json({ status: 'sub'})
  }))
  .post('/unsub', authUser, asyncWrapper(async (req, res) => {
    const { id } = req.decoded
    await updateUser({ id }, { pnToken: '' })
    res.json({ status: 'unsub'})
  }))
  .post('/send/:id', async (req, res) => {
    // sending...
    try {
      const { id } = req.params
      const { mode, data = {} } = req.body
      const user = await findUser({ id })
      let rv = null
      if (user && user.pnToken) {
        if (mode === 'FCM') {
          rv = await fcm.send(user.pnToken, data.title || '', data.body || '')
        } else if (mode === 'Webpush') { // Use Webpush
          const subscription = JSON.parse(user.pnToken)
          rv = await webpush.send(subscription, data)
        }
        res.json({ status: 'sent', mode, rv })
      } else {
        res.status(404).json({ status: 'no user or token'})
      }
    } catch (e) {
      res.status(500).json({ error: process.env.NODE_ENV === 'production' ? 'Send Error: contact admin' : e.toString() })
    }
  })
