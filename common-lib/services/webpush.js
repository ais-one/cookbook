let webPush

if (!webPush) {
  webPush = require('web-push')
  const publicVapidKey = process.env.VAPID_KEY_PUBLIC
  const privateVapidKey = process.env.VAPID_KEY_PRIVATE
  const pushEmail = process.env.PUSH_EMAIL
  webPush.setVapidDetails(pushEmail, publicVapidKey, privateVapidKey);
}

module.exports = webPush
