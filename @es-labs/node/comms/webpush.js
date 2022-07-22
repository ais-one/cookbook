'use strict'

const webPush = require('web-push')
const vapidKeys = webPush.generateVAPIDKeys() // We use webpush to generate our public and private keys
const { publicKey, privateKey } = vapidKeys
webPush.setVapidDetails(process.env.WEBPUSH_VAPID_URL, publicKey, privateKey) // We are giving webpush the required information to encrypt our data

// This function takes a subscription object and a payload as an argument. It will try to encrypt the payload
// then attempt to send a notification via the subscription's endpoint
exports.send = async (subscription, payload, TTL=60) => {
  // This means we won't resend a notification if the client is offline
  const options = { TTL } // what if TTL = 0 ?
  // web-push's sendNotification function does all the work for us
  if (!subscription.keys) { payload = payload || null }
  return webPush.sendNotification(subscription, payload, options)
}

exports.getPubKey = () => vapidKeys.publicKey
