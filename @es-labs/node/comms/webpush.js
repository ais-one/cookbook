'use strict'

let webPush
let vapidKeys

const setup = (options = global.CONFIG) => {
  const { WEBPUSH_VAPID_URL } = options || {}
  if (!webPush) {
    webPush = require('web-push')
  
    // We use webpush to generate our public and private keys
    vapidKeys = webPush.generateVAPIDKeys()
    const { publicKey, privateKey } = vapidKeys
  
    // We are giving webpush the required information to encrypt our data
    webPush.setVapidDetails(WEBPUSH_VAPID_URL, publicKey, privateKey)
  }  
}

// This function takes a subscription object and a payload as an argument. It will try to encrypt the payload
// then attempt to send a notification via the subscription's endpoint
const send = async (subscription, payload, TTL=60) => {
  // This means we won't resend a notification if the client is offline
  const options = { TTL } // what if TTL = 0 ?
  // web-push's sendNotification function does all the work for us
  if (!subscription.keys) { payload = payload || null }
  return webPush.sendNotification(subscription, payload, options)
}

const getPubKey = () => vapidKeys.publicKey

module.exports = { getPubKey, send, setup }
