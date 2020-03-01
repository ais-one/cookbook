const fs = require('fs')
const express = require('express')
const apiRoutes = express.Router()

// var path = require('path')
// path.extname('index.html')
// returns '.html'

const { bucket } = require('../../services/firebase')

const { UPLOAD_PATH } = require('../config')
const { authUser } = require('../middlewares/auth')
const multer = require('multer')
const upload = multer({ dest: `${UPLOAD_PATH}` }) // multer configuration
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
  .get('/error', async (req,res) => { // for an error - test logging of errors
    try {
      req.something.missing = 10
      res.status(200).json({ message: 'OK' })
    } catch (e) {
      const { message, stack } = e
      console.error(stack)
      res.status(500).json({ message })
    }
  })
  /**
   * @swagger
   * /api/authors:
   *    post:
   *      tags:
   *        - "Base"
   *      description: Health check
   */
  .get('/health', async (req,res) => { // health check
    res.status(200).json({ message: 'OK' })
  })
  /**
   * @swagger
   * /api/authors:
   *    post:
   *      tags:
   *        - "Base"
   *      security:
   *        - Bearer: []
   *      description: Health check with authorization
   */
  .get('/health-auth', authUser, async (req,res) => { // health check auth
    res.status(200).json({ message: 'OK' })
  })
  // test uploads
  .post('/upload', upload.single('avatar'), async (req,res) => { // avatar is form input name
    console.log(req.file, req.body)
    res.status(200).json({ message: 'Uploaded' })
  })
  .post('/uploads', upload.array('photos', 3), (req, res, next) => {
    console.log(req.files)
    res.status(200).json({ message: 'Uploaded' })
    // req.files is array of `photos` files
    // req.body will contain the text fields, if there were any
  })

module.exports = apiRoutes
