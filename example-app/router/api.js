const fs = require('fs')
const path = require('path')
const express = require('express')
const { spawn } = require('child_process')


const agenda = require(LIB_PATH + '/services/mq/agenda').get() // agenda message queue
const bull = require(LIB_PATH + '/services/mq/bull').get() // bull message queue

// const path = require('path')
// path.extname('index.html')
// returns '.html'

// req.file / req.files[index]
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

const { UPLOAD_FOLDER } = global.CONFIG
const { gcpGetSignedUrl } = require(LIB_PATH + '/services/gcp')
const { authUser } = require('../middlewares/auth')
const multer = require('multer')

const memoryUpload = multer({ 
  limits: {
    files : 1,
    fileSize: 5000 // size in bytes
  },
  // fileFilter,
  storage: multer.memoryStorage()
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
  storage: multer.diskStorage({
    destination: function (req, file, cb) { cb(null, UPLOAD_FOLDER) },
    filename: function (req, file, cb) { cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname) }
  })
})

module.exports = express.Router()
  .get('/python', (req, res) => {
    // long running python
    const child = spawn('python', ['test.py'], {
      detached: true,
      stdio: 'ignore'
    })    
    // child.stdout.on('data', function (data) {
    //   console.log('Pipe data from python script ...')
    //   dataToSend = data.toString()
    //   console.log('dataToSend', dataToSend)
    // })
    // // in close event we are sure that stream from child process is closed
    // child.on('close', (code) => {
    //   console.log(`child process close all stdio with code ${code}`)
    // }) 
    
    child.unref()
    res.json({})
  })
  .get('/restart-mongo', (req, res) => { // restart mongo that cannot initially connect
    require(LIB_PATH + '/services/db/mongodb').open()
    res.json({})
  })

  .get('/wrap-test', asyncWrapper(async (req, res) => {
    // return res.status(201).json({ aa: 'bb' }) // should not return...
    // next(new Error('Generated Wrapper Error - next')) // use throw instead
    throw new Error('Generated Wrapper Error - throw')
  }))

  .get('/error', asyncWrapper(async (req, res) => { // for an error - test catching of errors
    req.something.missing = 10
    res.json({ message: 'OK' })
  }))

  .get('/crash', asyncWrapper(async (req, res) => { // for crashing the application - catching error in process exception
    fs.readFile('somefile.txt', (err, data) => {
      if (err) throw err
      console.log(data)
    })
    res.json({ message: 'Crash initiated check express server logs' })
  }))

  /**
   * @swagger
   * /api/healthcheck:
   *    post:
   *      tags:
   *        - "Base"
   *      description: Health check
   */
  .get('/healthcheck', (req, res) => { res.json({
    message: 'OK',
    app: APP_NAME,
    environment: process.env.NODE_ENV,
    version: APP_VERSION
  }) }) // health check
  /**
   * @swagger
   * /api/health-auth:
   *    post:
   *      tags:
   *        - "Base"
   *      security:
   *        - bearerAuth: []
   *      description: Health check with authorization
   */
  .get('/health-auth', authUser, (req, res) => { res.json({ message: 'OK' }) }) // health check auth

  // test uploads
  // body action: 'read' | 'write', filename: 'my-file.txt', bucket: 'bucket name'
  .post('/gcp-sign', asyncWrapper(gcpGetSignedUrl))

  .post('/upload', upload.single('filedata'), (req,res) => { // avatar is form input name
    console.log('file original name', req.file.originalname)
    console.log('text data', req.body.textdata)
    res.json({ message: 'Uploaded' })
  })
  .post('/uploads', upload.array('photos', 3), (req, res) => { // multiple
    console.log(req.files.length)
    res.json({ message: 'Uploaded' })
    // req.files is array of `photos` files
    // req.body will contain the text fields, if there were any
  })
  .post('/upload-memory', memoryUpload.single('memory'), (req, res) => {
    console.log(req.file.originalname, req.body)
    res.json({ message: req.file.buffer.toString() })
    // req.files is array of `photos` files
    // req.body will contain the text fields, if there were any
  })

  // message queues
  .get('/mq-agenda', asyncWrapper(async (req, res) => { // test message queue - agenda
    if (agenda) {
      const job = await agenda.now('registration email', { email: 'abc@test.com' })
      console.log('Agenda Pub')
      res.json({ job, note: 'Check Server Console Log For Processed Message...' })
    } else {
      console.log('Agenda Not Configured')
      res.json({ job, note: 'Agenda Not Configured' })
    }
  }))

  .get('/mq-bull', asyncWrapper(async (req, res) => { // test message queue - bullmq
    if (bull) {
      const jobOpts = { removeOnComplete: true, removeOnFail: true }
      bull.add({ message: new Date() }, jobOpts)
      console.log('Bull Pub')
      res.json({ note: 'Check Server Console Log For Processed Message...' })
    } else {
      console.log('No Bull MQ configured')
      res.json({ note: 'No Bull MQ configured' })
    }
  }))

