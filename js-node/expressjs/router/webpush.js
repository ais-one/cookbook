'use strict'

// TBD rename service to pn
const express = require('express')
const { 
  // authUser,
  userOps
} = require('@es-labs/node/auth')
const fcm = require('@es-labs/node/comms/fcm')
const webpush = require('@es-labs/node/comms/webpush')

const authUser = (req, res, next) => {
  req.decoded = { id: 1 }
  next()
}

module.exports = express.Router()
  .get('/vapid-public-key', (req, res) => res.json({ publicKey: webpush.getPubKey() }))
  .post('/sub', authUser, asyncWrapper(async (req, res) => {
    const { id } = req.decoded
    const { subscription } = req.body // should be a string
    await userOps.updateUser({ id }, { pnToken: subscription })
    res.json({ status: 'sub'})
  }))
  .post('/unsub', authUser, asyncWrapper(async (req, res) => {
    const { id } = req.decoded
    await userOps.updateUser({ id }, { pnToken: '' })
    res.json({ status: 'unsub'})
  }))
  .post('/send/:id', /* authUser */ async (req, res) => {
    // sending...
    try {
      const { id } = req.params
      const { mode, data = {} } = req.body
      const user = await userOps.findUser({ id })
      let rv = null

      // console.log('FCM TEST', user.pnToken, data.title, data.body)
      if (user && user.pnToken) {
        if (mode === 'FCM') {
          rv = await fcm.send(user.pnToken, data.title || '', data.body || '')
        } else if (mode === 'Webpush') { // Use Webpush
          const options = {
            TTL: 60
            // headers: {
            //   'Access-Control-Allow-Origin': 'http://127.0.0.1:8080',
            //   'Content-type': 'application/json'
            // }
          } 
          const subscription = JSON.parse(user.pnToken)
          rv = await webpush.send(subscription, data, options)
        }
        res.json({ status: 'sent', mode, rv })
      } else {
        res.status(404).json({ status: 'no user or token'})
      }
    } catch (e) {
      console.log('ERROR >>>>>')
      console.log(e) // need more info
      res.status(500).json({ error: process.env.NODE_ENV === 'production' ? 'Send Error: contact admin' : e })
    }
  })
