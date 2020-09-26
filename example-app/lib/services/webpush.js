let webPush
let vapidKeys

if (!webPush) {
  webPush = require('web-push')
  // const publicVapidKey = process.env.VAPID_KEY_PUBLIC
  // const privateVapidKey = process.env.VAPID_KEY_PRIVATE
  // const pushEmail = process.env.PUSH_EMAIL
  // webPush.setVapidDetails(pushEmail, publicVapidKey, privateVapidKey)

  // We use webpush to generate our public and private keys
  vapidKeys = webPush.generateVAPIDKeys()
  const { publicKey, privateKey } = vapidKeys

  // We are giving webpush the required information to encrypt our data
  webPush.setVapidDetails(
    // 'https://app.ahop.co',
    'http://127.0.0.1:3000',
    publicKey,
    privateKey
  )
}

const allSubscriptions = {}

const registerTasks = (subscription) => {
  const endpoint = subscription.endpoint;

  // the endpoints are the keys of our subscriptions object
  // Every 5 seconds we will send a notification with the message 'hey this is a push!'
  const intervalID = setInterval(()=>{
    sendNotification(subscription, 'Hey this is a push!')
  }, 5000);
  allSubscriptions[endpoint] = intervalID;
}

// This function takes a subscription object and a payload as an argument
// It will try to encrypt the payload
// then attempt to send a notification via the subscription's endpoint
const sendNotification = async (subscription, payload) => {
  // This means we won't resend a notification if the client is offline
  const options = {
    TTL: 0
  };

  if (!subscription.keys) {
    payload = payload || null;
  }

  // web-push's sendNotification function does all the work for us
  try {
    const res = await webPush.sendNotification(subscription, payload, options);
    console.log(res, 'sent!');
  } catch (e) {
    console.log('error sending', e);
  }
}

// GET /vapid-public-key - Send our public key to the client
const vapidPubKey = (req, res) => res.send({ publicKey: vapidKeys.publicKey })

// POST /subscribe Allows our client to subscribe
const sub =  (req, res) => {
  const subscription = req.body;
  registerTasks(subscription);
  res.send('subscribed!');
}

const unsub = (req, res) => { // POST /unsubscribe 
  const endpoint = req.body.endpoint;
  // We find the client's endpoint and clear the interval associated with it
  const intervalID = allSubscriptions[endpoint];
  clearInterval(intervalID);
  // We delete the key
  delete allSubscriptions[endpoint];
}

module.exports = { vapidPubKey, sub, unsub }
