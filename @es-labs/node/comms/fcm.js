'use strict'

const axios = require('axios')
let key

exports.setup = (options = global.CONFIG) => {
  const { FCM_SERVER_KEY } = options || {}
  key = FCM_SERVER_KEY
}

exports.send = async (to, title, body) => { // send firebase push notification
  try {
    return await axios.post('https://fcm.googleapis.com/fcm/send', {
      to, data: { notification: { title, body } }
    },{
      headers: {
        Authorization: 'key=' + key,
        'Content-Type': 'application/json'
      }
    })
  } catch (e) {
    console.error('Firebase Messaging Error', e.toString())
    return null
  }
}
