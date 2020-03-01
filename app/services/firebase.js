'use strict'
const admin = require('firebase-admin')
const certJson = require('../key.json')

if (admin.apps.length === 0) {
  console.log('Init Firebase')
  const credential = admin.credential.cert(certJson) // for Firebase Functions
  // const credential = admin.credential.applicationDefault() // if hosted on Firebase Functions
  // const config = require('./config.json')
  admin.initializeApp({
    credential
  })
  admin.firestore().settings({ timestampsInSnapshots: true })
}

const firestore = admin ? admin.firestore() : null
const auth = admin ? admin.auth() : null
const bucket = admin ? admin.storage().bucket(certJson.project_id + 'mybot-live.appspot.com') : null
module.exports = { firestore, auth, bucket }
