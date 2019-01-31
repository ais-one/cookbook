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

const firestore = admin.firestore()
const auth = admin.auth()
const bucket = admin.storage().bucket()

module.exports = { firestore, auth, bucket }
