let webPush
let vapidKeys

const { WEBPUSH_VAPID_URL } = global.CONFIG

if (!webPush) {
  webPush = require('web-push')

  // We use webpush to generate our public and private keys
  vapidKeys = webPush.generateVAPIDKeys()
  const { publicKey, privateKey } = vapidKeys

  // We are giving webpush the required information to encrypt our data
  webPush.setVapidDetails(WEBPUSH_VAPID_URL, publicKey, privateKey)
}

const allSubscriptions = {} // for testing only

const send = (req, res) => { // POST /send
  try {
    const { subId, payload } = req.body
    const subscription = allSubscriptions[subId]
    sendNotification(subscription, payload) // payload is string?  
    res.json({ status: 'ok' })
  } catch (e) {
    res.status(400).json({ error: e.toString() })
  }
}

const test = asyncWrapper(async (req, res) => { // GET /test
  // try {
  const subscription = allSubscriptions['test']
  const payload = JSON.stringify({ payload: 'Testing ABCdef 1234'})
  await sendNotification(subscription, payload) // payload is string or node buffer  
  res.json({ status: 'ok' })
  // } catch (e) {
  //   const { message, code } = errorFormatHttp(e)
  //   res.status(code).json({ message })
  // }
})

// This function takes a subscription object and a payload as an argument. It will try to encrypt the payload
// then attempt to send a notification via the subscription's endpoint
const sendNotification = async (subscription, payload) => {
  // This means we won't resend a notification if the client is offline
  const options = { TTL: 60 } // what if TTL = 0 ?
  // web-push's sendNotification function does all the work for us
  if (!subscription.keys) { payload = payload || null }
  const res = await webPush.sendNotification(subscription, payload, options);
  // console.log('sent!', res.statusCode, res.body)
}

// GET /vapid-public-key - Send our public key to the client
const vapidPubKey = (req, res) => res.json({ publicKey: vapidKeys.publicKey })

// POST /subscribe Allows our client to subscribe
let sub =  (req, res) => {
  const { subId } = req.query
  const subscription = req.body // { endpoint, keys, expirationTime }
  // TBD also have old subscription and delete it
  if (!allSubscriptions[subId]) allSubscriptions[subId] = subscription
  res.json({ status: 'subscribed'})
}

let unsub = (req, res) => { // POST /unsubscribe 
  const { subId } = req.query
  // const subscription = req.body
  // We find the client's endpoint and clear the interval associated with it
  if (allSubscriptions[subId]) delete allSubscriptions[subId]
  res.json({ status: 'unsubscribed'})
}

module.exports = { vapidPubKey, sub, unsub, send, test }
