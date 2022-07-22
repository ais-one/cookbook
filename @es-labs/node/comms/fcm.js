'use strict'

const axios = require('axios')

exports.send = async (to, title, body) => { // send firebase push notification
  // console.log('FCM TEST @es-labs/node/fcm.js', to, body, title, key)
  try {
    const rv = await axios.post('https://fcm.googleapis.com/fcm/send', {
      to,
      data: { 
        notification: {
          // icon: 'firebase-logo.png', click_action: 'http://localhost:8081'
          title,
          body
        }
      }
    },{
      headers: {
        Authorization: 'key=' + process.env.FCM_SERVER_KEY,
        'Content-Type': 'application/json'
      }
    })
    console.log('done', rv.data)
  } catch (e) {
    console.error('Firebase Messaging Error', e.toString())
    return null
  }
}
