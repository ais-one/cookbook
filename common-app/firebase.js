'use strict'
const admin = require('firebase-admin')
const axios = require('axios')

const { FIREBASE_KEY, FCM_SERVER_KEY, GCP_DEFAULT_BUCKET = '', CORS_ORIGINS } = require('./config')
let bucketName = GCP_DEFAULT_BUCKET

if (admin.apps.length === 0 && FIREBASE_KEY && FIREBASE_KEY.project_id) {
  console.log('Init Firebase')
  const credential = admin.credential.cert(FIREBASE_KEY) // for Firebase Functions
  // const credential = admin.credential.applicationDefault() // if hosted on Firebase Functions
  admin.initializeApp({ credential })
}

const fcmSend = async (to, title, body) => { // send firebase push notification
  try { // using post instead
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

const gcpSetBucket = async (newBucketName) => bucketName = newBucketName || bucketName

const gcpEnableCors = async (req,res) => {
  // console.log(CORS_ORIGINS.split(','), bucketName)
  const bucket = admin.storage().bucket(bucketName)
  await bucket.setCorsConfiguration([{
    maxAgeSeconds: 3600,
    method: [ 'GET', 'HEAD', 'PUT', 'DELETE' ],
    responseHeader: ['*'],
    origin: CORS_ORIGINS ? CORS_ORIGINS.split(',') : [ '*' ]
  }])
  res.status(200).json()
}

const gcpGetSignedUrl = async (req,res) => { // test upload/get with cloud opject storage using SignedURLs
  // action "read" (HTTP: GET), "write" (HTTP: PUT), or "delete" (HTTP: DELETE),
  const bucket = admin.storage().bucket(bucketName)
  const action = req.body.action || 'write'
  const fileName = req.body.filename || 'my-file.txt'
  const options = {
    version: 'v4',
    action,
    expires: Date.now() + (120 * 60 * 1000) // 120 minutes
  }
  // The option below will allow temporary uploading of the file with outgoing Content-Type: application/octet-stream header.
  if (action === 'write') options.contentType = 'application/octet-stream'

  // Get a v4 signed URL for uploading file
  const [url] = await bucket.file(fileName).getSignedUrl(options)
  // console.log(url)
  // // curl command for uploading using signed URL
  // console.log("curl -X PUT -H 'Content-Type: application/octet-stream' " + `--upload-file my-file '${url}'`)
  // curl -X PUT -H 'Content-Type: application/octet-stream' --upload-file my-file 'http://www.test.com'
  res.status(200).json({ url })
}

module.exports = { fcmSend, gcpEnableCors, gcpGetSignedUrl, gcpSetBucket }
