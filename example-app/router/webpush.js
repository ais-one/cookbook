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
          send(subscription, data)  
        }
        res.json({ status: 'sent '})
      } else {
        res.status(404).json({ status: 'no user or token'})
      }
    } catch (e) {
      console.log(e)
    }

  })

  // TOREMOVE
  // test FCM push notification when device registers... 
  // .post('/send-fcm/:id', async (req, res) => {
  //   try {
  //     console.log('PN token received: ' + req.params.pnToken, req.query)
  //     if (req.query.reply === 'yes') {
  //       const rv = await fcmSend(req.params.pnToken, 'FCM Message', 'Received from My Server ' + Date.now())
  //       console.log('send rv', rv.status)
  //       res.status(200).json({ status: rv.status })  
  //     } else {
  //       res.status(200).json({ pnToken: req.params.pnToken })  
  //     }
  //   } catch (e) {
  //     res.status(500).json({ e: e.toString() })
  //   }
  // })
