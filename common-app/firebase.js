'use strict'
const admin = require('firebase-admin')

const  { FIREBASE_KEY } = require('./config')

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
const bucket = admin ? admin.storage().bucket(FIREBASE_KEY.project_id + 'mybot-live.appspot.com') : null
module.exports = { firestore, auth, bucket }
