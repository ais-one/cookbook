const axios = require('axios')

const { FCM_SERVER_KEY } = require('../config')

const fcmSend = async (to, title, body) => { // send firebase push notification
  try {
    const rv = await axios.post('https://fcm.googleapis.com/fcm/send', {
      to, data: { notification: { title, body } }
    },{
      headers: {
        Authorization: 'key=' + FCM_SERVER_KEY,
        'Content-Type': 'application/json'
      }
    })
    return rv
  } catch (e) {
    console.error('Firebase Messaging Error', e.toString())
    return null
  }
}

module.exports = fcmSend
