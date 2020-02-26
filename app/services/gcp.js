/**
 * TODO(developer): Uncomment the following lines before running the sample.
 */
// const bucketName = 'Name of a bucket, e.g. my-bucket';
// const fileName = 'File to access, e.g. file.txt';

// Imports the Google Cloud client library
const {Storage} = require('@google-cloud/storage');

// Creates a client
const storage = new Storage(
    require('./serviceAccountKey.json')
)

async function generateV4USignedUrl(bucketName, fileName, action = 'write') { // read action
  const options = {
    version: 'v4',
    action,
    expires: Date.now() + 15 * 60 * 1000 // 15 minutes
  }
  // The option below will allow temporary uploading of the file with outgoing Content-Type: application/octet-stream header.
  if (action === 'write') options.contentType = 'application/octet-stream'

  // Get a v4 signed URL for uploading file
  const [url] = await storage.bucket(bucketName).file(fileName).getSignedUrl(options)
  // console.log(url)
  // console.log(`curl '${url}'`);
  // console.log("curl -X PUT -H 'Content-Type: application/octet-stream' " + `--upload-file my-file '${url}'`)
  // curl -X PUT -H 'Content-Type: application/octet-stream' --upload-file my-file http://www.test.com
  return(url)
}

module.exports = {
    generateV4USignedUrl
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