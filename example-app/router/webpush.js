const express = require('express')
const { vapidPubKey, send } = require(LIB_PATH + '/services/webpush')
const fcmSend = require(LIB_PATH + '/comms/fcm')
const { authUser, findUser, updateUser } = require('../middlewares/auth')

module.exports = express.Router()
  .get('/vapid-public-key', (req, res) => res.json({ publicKey: vapidPubKey }))
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
      if (user && user.pnToken) {
        if (mode === 'FCM') {
          // Use FCM
          fcmSend(user.pnToken, data.title || '', data.body || '')
        } else if (mode === 'Webpush') {
          // Use Webpush
          const subscription = JSON.parse(user.pnToken)
          const rv = await send(subscription, data)
          console.log('pn send', rv)
        }
        res.json({ status: 'sent '})
      } else {
        res.status(404).json({ status: 'no user or token'})
      }
    } catch (e) {
      console.log(e.toString())
      res.status(500).json({ error: process.env.NODE_ENV === 'production' ? 'Send Error: contact admin' : e.toString() })
    }
  })
