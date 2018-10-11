'use strict'

const admin = require('firebase-admin')

if (admin.apps.length === 0) {
  console.log('Init Firebase')
  const credential = admin.credential.cert(require('./serviceAccountKey.json')) // for Firebase Functions
  // const credential = admin.credential.applicationDefault() // if hosted on Firebase Functions
  // const config = require('./config.json')
  admin.initializeApp({
    credential,
    // storageBucket: "<BUCKET_NAME>.appspot.com"
    // "apiKey": "",
    // "authDomain": ".firebaseapp.com",
    // "databaseURL": "https://.firebaseio.com",
    // "projectId": "",
    // "storageBucket": ".appspot.com",
    // "messagingSenderId": ""
      // ...config
  })
  admin.firestore().settings({ timestampsInSnapshots: true })
}

const firestore = admin.firestore()
const auth = admin.auth()
const bucket = admin.storage().bucket()

module.exports = {firestore, auth, bucket}
