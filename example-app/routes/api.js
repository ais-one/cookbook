const fs = require('fs')
const path = require('path')
const express = require('express')
const apiRoutes = express.Router()

const agenda = require('../../common-app/mq/agenda') // message queue
const bull = require('../../common-app/mq/bull')

// var path = require('path')
// path.extname('index.html')
// returns '.html'

const { UPLOAD_FOLDER, FIREBASE_KEY } = require('../config')
const firebase = FIREBASE_KEY ? require('../../common-app/firebase') : null
const { authUser } = require('../middlewares/auth')
const multer = require('multer')

const storage = multer.diskStorage({
  destination: function (req, file, cb) { cb(null, path.join(__dirname, '..', UPLOAD_FOLDER)) },
  filename: function (req, file, cb) { cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname) }
})
const upload = multer({
  // limits: {
  //   files : 1,
  //   fileSize: 1000000 // size in bytes
  // },
  // fileFilter: (req, file, cb) => {
  //   if (
  //     !file.mimetype.includes("jpeg") && !file.mimetype.includes("jpg") && !file.mimetype.includes("png")
  //   ) {
  //     return cb(null, false, new Error("Only jpeg, png or pdf are allowed"));
  //   }
  //   cb(null, true);
  // },
  storage: storage
})
    // console.log(req.file)
    // {
    //   fieldname: 'kycfile',
    //   originalname: 'tbd.txt',
    //   encoding: '7bit',
    //   mimetype: 'text/plain',
    //   destination: 'uploads/',
    //   filename: 'kycfile-1582238409067',
    //   path: 'uploads\\kycfile-1582238409067',
    //   size: 110
    // }

apiRoutes


  .get('/upload-firebase/:filename', async (req,res) => { // for an error - test logging of errors
    try {
      if (!firebase) return res.status(500).json({ e: 'No Firebase Service' })
      const { bucket } = firebase

      // need to allow CORS...
      // try {
      //   const xx = await bucket.setCorsConfiguration([{
      //     maxAgeSeconds: 3600,
      //     method: [ 'GET', 'HEAD', 'PUT' ],
      //     responseHeader: ['*'],
      //     origin: [ '*' ] 
      //   }])
      //   // console.log('xx', xx)  
      // } catch (e) {
      //   // console.log('eee', e.toString())
      // }

      const action = 'write'
      const fileName = req.params.filename || 'my-file.txt'
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
      // console.log("curl -X PUT -H 'Content-Type: application/octet-stream' " + `--upload-file my-file '${url}'`)
      // curl -X PUT -H 'Content-Type: application/octet-stream' --upload-file my-file 'http://www.test.com'
      res.status(200).json({ url })
    } catch (e) {
      res.status(500).json({ e: e.toString() })
    }
  })

  .get('/mq', async (req,res,next) => { // test message queue
    try {
      const job = await agenda.now('registration email', { email: 'abc@test.com' })
      res.json({ job, note: 'Check Server Console Log For Processed Message...' })
    } catch (e) {
      next([500, e]) // test using a cloudflare error code for fun
    }
  })
  .get('/mq-bull', async (req,res,next) => { // test message queue
    try {
      if (bull) {
        const jobOpts = { removeOnComplete: true, removeOnFail: true }
        bull.add({ message: new Date() }, jobOpts)
        console.log('xxx')
      }
      res.json({ note: 'Check Server Console Log For Processed Message...' })
    } catch (e) {
      next([500, e]) // test using a cloudflare error code for fun
    }
  })
  .get('/error', async (req,res,next) => { // for an error - test logging of errors
    try {
      req.something.missing = 10
      res.json({ message: 'OK' })
    } catch (e) {
      console.log('/error', e)
      next([520, e]) // test using a cloudflare error code for fun
    }
  })

  /**
   * @swagger
   * /api/health:
   *    post:
   *      tags:
   *        - "Base"
   *      description: Health check
   */
  .get('/health', async (req,res) => { // health check
    res.json({ message: 'OK' })
  })
  /**
   * @swagger
   * /api/health-auth:
   *    post:
   *      tags:
   *        - "Base"
   *      security:
   *        - Bearer: []
   *      description: Health check with authorization
   */
  .get('/health-auth', authUser, async (req,res) => { // health check auth
    res.json({ message: 'OK' })
  })
  // test uploads
  .post('/upload', upload.single('avatar'), async (req,res) => { // avatar is form input name
    console.log(req.file, req.body)
    res.json({ message: 'Uploaded' })
  })
  .post('/uploads', upload.array('photos', 3), (req, res, next) => {
    console.log(req.files)
    res.json({ message: 'Uploaded' })
    // req.files is array of `photos` files
    // req.body will contain the text fields, if there were any
  })

module.exports = apiRoutes
