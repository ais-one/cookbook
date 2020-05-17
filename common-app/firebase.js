'use strict'
const admin = require('firebase-admin')
const axios = require('axios')

const  { FIREBASE_KEY, FCM_SERVER_KEY } = require('./config')

if (admin.apps.length === 0 && FIREBASE_KEY) {
  console.log('Init Firebase')
  const credential = admin.credential.cert(FIREBASE_KEY) // for Firebase Functions
  // const credential = admin.credential.applicationDefault() // if hosted on Firebase Functions
  admin.initializeApp({
    credential
  })
  admin.firestore().settings({ timestampsInSnapshots: true })
}

const firestore = admin ? admin.firestore() : null
const auth = admin ? admin.auth() : null
const bucket = admin ? admin.storage().bucket(FIREBASE_KEY.project_id + '.appspot.com') : null

const fcmSend = async (to, title, body) => { // send firebase push notification
  try { // using post instead
    const rv = await axios.post('https://fcm.googleapis.com/fcm/send', {
      to,
      data: {
        notification: { title, body }
      }
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

module.exports = { firestore, auth, bucket, fcmSend }
