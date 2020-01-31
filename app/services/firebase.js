'use strict'
const admin = require('firebase-admin')

console.log('FIREBASE INIT')

if (admin.apps.length === 0) {
  console.log('Init Firebase')
  const credential = admin.credential.cert(require('./serviceAccountKey.json')) // for Firebase Functions
  // const credential = admin.credential.applicationDefault() // if hosted on Firebase Functions
  // const config = require('./config.json')
  admin.initializeApp({
    credential
  })
  admin.firestore().settings({ timestampsInSnapshots: true })
}

const firestore = admin ? admin.firestore() : null
const auth = admin ? admin.auth() : null
const bucket = admin ? admin.storage().bucket() : null

module.exports = { firestore, auth, bucket }
