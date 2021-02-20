'use strict'

const { GCP_SERVICE_KEY, GCP_DEFAULT_BUCKET = '' } = global.CONFIG
let storage

if (!storage && GCP_SERVICE_KEY && GCP_SERVICE_KEY.project_id) {
  const { Storage } = require('@google-cloud/storage')
  const { client_email, private_key } = GCP_SERVICE_KEY
  storage = new Storage({ credentials: {
    client_email, private_key
  } })
}

// let firestore // use firestore like redis for user sessions
// if (!firestore && GCP_SERVICE_KEY && GCP_SERVICE_KEY.project_id) {
//   const Firestore = require('@google-cloud/firestore')
//   const { client_email, private_key } = GCP_SERVICE_KEY
//   firestore = new Firestore({ credentials: {
//     client_email, private_key
//   } })  
// }
// exports.firestore = firestore

// Set CORs
// [
//     {
//       "origin": ["https://uat.mybot.live"],
//       "responseHeader": ["*"],
//       "method": ["GET", "HEAD", "PUT", "DELETE"],
//       "maxAgeSeconds": 3600
//     }
// ]
// use gsutil app, instead of setCorsConfiguration()
// gsutil cors set [JSON_FILE_NAME].json gs://[BUCKET_NAME]
// gsutil cors get gs://[BUCKET_NAME]

exports.gcpGetSignedUrl = async (req,res) => { // test upload/get with cloud opject storage using SignedURLs
  // action "read" (HTTP: GET), "write" (HTTP: PUT), or "delete" (HTTP: DELETE),
  const bucket = storage.bucket(req.body.bucket || GCP_DEFAULT_BUCKET)
  const action = req.body.action || '' // 'read' or 'write'
  const fileName = req.body.filename || ''
  if (!action || !fileName) return res.status(400).json({ error: 'filename and action required'})
  try {
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
    return res.status(200).json({ url })
  } catch (e) {
    // console.log('Error', 'gcpGetSignedUrl', e.toString())
    return res.status(500).json({ error: e.toString() })
  }
}

/*
// https://stackoverflow.com/questions/20754279/creating-signed-urls-for-google-cloud-storage-using-nodejs
var crypto = require("crypto");
var fs = require("fs");
var expiry = new Date().getTime() + 600000; // 10 mins
var key = 'the_target_file';
var bucketName = 'bucket_name';
var accessId = 'my_access_id';
var stringPolicy = "GET\n" + "\n" + "\n" + expiry + "\n" + '/' + bucketName + '/' + key; 
var privateKey = fs.readFileSync("gcs.pem","utf8");
var signature = encodeURIComponent(crypto.createSign('sha256').update(stringPolicy).sign(privateKey,"base64"));   
var signedUrl = "https://" + bucketName + ".commondatastorage.googleapis.com/" + key +"?GoogleAccessId=" + accessId + "&Expires=" + expiry + "&Signature=" + signature;
console.log(signedUrl);


  fetch('http://www.example.net', { // Your POST endpoint
    method: 'POST',
    headers: {
      // Content-Type may need to be completely **omitted** or you may need something
      "Content-Type": "application/octet-stream"
    },
    body: file // This is your file object (1 file)
  }).then(
    response => response.json() // if the response is a JSON object
  ).then(
    success => console.log(success) // Handle the success response object
  ).catch(
    error => console.log(error) // Handle the error response object
  );

  axios.put(url, file, { headers: { 'Content-Type': file.type } })
*/
