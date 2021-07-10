'use strict'

const fs = require('fs')
const express = require('express')
const { spawn } = require('child_process')
const axios = require('axios')

const ws = require('@es-labs/node/services/websocket')
const { sleep } = require('esm')(module)('@es-labs/esm/sleep')
const agenda = require('@es-labs/node/services/mq/agenda').get() // agenda message queue
const bull = require('@es-labs/node/services/mq/bull').get() // bull message queue
const { gcpGetSignedUrl } = require('@es-labs/node/services/gcp')
const { memoryUpload, storageUpload } = require('@es-labs/node/express/upload')

const { UPLOAD_STATIC, UPLOAD_MEMORY } = global.CONFIG

const { authUser } = require('@es-labs/node/auth')

module.exports = express.Router({caseSensitive: true})
  .get('/python', (req, res) => {
    // spawn long running python process
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

  .get('/restart-mongo', async (req, res) => { // restart mongo that cannot initially connect
    await require('@es-labs/node/services/db/mongodb').open()
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

  .get('/error-unhandled-promise-rejection', asyncWrapper(async (req, res, next) => { // catching error in unhandled exception
    // Promise.reject(new Error('woops')).catch(e => next(e)) //  handled
    Promise.reject(new Error('woops')) // unhandled
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

  .post('/test-post-json', (req, res) => { res.json(req.body) }) // check if send header as application/json but body is text

  .post('/test-cors-post', (req, res) => { res.send('Cors Done') }) // check CORS

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

  .post('/upload-disk', storageUpload(UPLOAD_STATIC[0]).any(), (req,res) => { // avatar is form input name // single('filedata')
    try {
      // console.log('files', req, req.files)
      for (let key in req.body) {
        const part = req.body[key]
        console.log(key, part) // text parts
      }
      res.json({
        ok: true, // success
        message: 'Uploaded',
        body: req.body
      })
    } catch (e) {
      res.json({ error: e.message })
    }
  })

  .post('/upload-memory', memoryUpload(UPLOAD_MEMORY[0]).single('memory'), (req, res) => {
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

  // stream back data
  .get('/stream', async (req, res, next) => {
    res.writeHead(200, { 'Content-Type': 'text/plain', 'Transfer-Encoding': 'chunked' })
    const chunks = 5
    let count = 1
    while (count <= chunks) {
      console.log('streaming', count)
      await sleep(1000) // eslint-disable-line
      res.write(JSON.stringify({ type: "stream", chunk: count++ })+'\n')
    }  
    res.end()
    // next()
  })

  // test websocket broadcast
  .get('/ws-broadcast', async (req, res) => {
    // console.log(ws, ws.getWs())
    ws.send("WS Broadcast")
    res.send("ws broadcast")
  })
