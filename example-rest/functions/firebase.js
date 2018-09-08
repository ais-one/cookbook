'use strict'

const admin = require('firebase-admin')

if (admin.apps.length === 0) {
  console.log('Init Firebase')
  const credential = admin.credential.cert(require('./serviceAccountKey.json')) // for Firebase Functions
  // const credential = admin.credential.applicationDefault()
  // const config = require('./config.json')
  admin.initializeApp({
    credential,
    // ...config
  })
  admin.firestore().settings({ timestampsInSnapshots: true })
}

const db = admin.firestore()

const auth = admin.auth()

module.exports = {db, auth}
