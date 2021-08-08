'use strict'

const fs = require('fs')
const express = require('express')
const { spawn } = require('child_process')
const axios = require('axios')

const ws = require('@es-labs/node/services/websocket')
const { sleep } = require('esm')(module)('@es-labs/esm/sleep')
const agenda = require('@es-labs/node/services/mq/agenda').get() // agenda message queue
const bull = require('@es-labs/node/services/mq/bull').get() // bull message queue
const gcp = require('@es-labs/node/services/gcp')
const { memoryUpload, storageUpload } = require(APP_PATH + '/common/upload')

const { UPLOAD_STATIC, UPLOAD_MEMORY, API_PORT, HTTPS_CERTS } = global.CONFIG

const { authUser } = require('@es-labs/node/auth')

gcp.setupStorage(global.CONFIG)

function openMissingFile() {
  fs.readFile('somefile4.txt', (err, data) => { if (err) throw err })
}
// openMissingFile()

module.exports = express.Router({caseSensitive: true})
  .get('/python', (req, res) => {
    // spawn long running python process
    const child = spawn('python', ['test.py'], {
      detached: true,
      stdio: 'ignore'
    })
    // NOSONAR
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

  .get('/restart-mongo', async (req, res) => { // SHOULD NOT HAVE TO DO THIS! restart mongo that cannot initially connect
    res.json({})
  })

  .get('/error', (req, res) => { // error caught by error middleware
    req.something.missing = 10
    res.json({ message: 'OK' })
  })

  .get('/error-handled-rejection', asyncWrapper(async (req, res) => {
    await Promise.reject(new Error('handled rejection of promise'))
  }))

  .get('/error-unhandled-rejection', asyncWrapper(async (req, res, next) => { // catching error in unhandledException
    Promise.reject(new Error('unhandled rejection of promise')) // call on.process unhandledRejection - promise rejection, unhandled
  }))

  .get('/healthcheck', (req, res) => res.json({ message: 'OK1', app: APP_NAME, environment: process.env.NODE_ENV, version: APP_VERSION, port: API_PORT, https: HTTPS_CERTS ? true : false }) ) // health check

  .post('/healthcheck', (req, res) => res.json({ message: 'POST OK' }) ) // POST health check

  .post('/test-post-json', (req, res) => { res.json(req.body) }) // check if send header as application/json but body is text

  .post('/test-cors-post', (req, res) => { res.send('Cors Done') }) // check CORS

  .get('/health-auth', authUser, (req, res) => { res.json({ message: 'OK' }) }) // health check auth
 
  // test uploads
  // body action: 'read' | 'write', filename: 'my-file.txt', bucket: 'bucket name'
  .post('/gcp-sign', asyncWrapper(gcp.getSignedUrl))

  .post('/upload-disk', storageUpload(UPLOAD_STATIC[0]).any(), (req,res) => { // avatar is form input name // single('filedata')
    try {
      // console.log('files', req, req.files)
      // body is string, need to parse if json
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
    // req.files is array of `photos` files
    // req.body will contain the text fields, if there were any
    res.json({
      fileOriginalName: req.file.originalname,
      body: req.body,
      message: req.file.buffer.toString()
    })
  })

  // message queues
  .get('/mq-agenda', asyncWrapper(async (req, res) => { // test message queue - agenda
    if (agenda) {
      try {
        const job = await agenda.now('registration email', { email: 'abc@test.com' })
        res.json({ job, note: 'Agenda - Check Server Console Log For Processed Message...' })  
      } catch (e) {
        res.json({ AgendaError: e.toString() })        
      }
    } else {
      res.json({ job, note: 'Agenda Not Configured' })
    }
  }))

  .get('/mq-bull', asyncWrapper(async (req, res) => { // test message queue - bullmq
    if (bull) {
      try {
        const jobOpts = { removeOnComplete: true, removeOnFail: true }
        bull.add({ message: new Date() }, jobOpts)
        res.json({ note: 'Bull - Check Server Console Log For Processed Message...' })
      } catch (e) {
        res.json({ BullMQError: e.toString() })        
      }
    } else {
      res.json({ note: 'Bull MQ Not Configured' })
    }
  }))

  // stream back data
  .get('/stream', async (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain', 'Transfer-Encoding': 'chunked' })
    const chunks = 5
    let count = 1
    while (count <= chunks) {
      // console.log('streaming', count)
      await sleep(1000) // eslint-disable-line
      res.write(JSON.stringify({ type: "stream", chunk: count++ })+'\n')
    }  
    res.end()
  })

  // test websocket broadcast
  .get('/ws-broadcast', async (req, res) => {
    ws.send("WS Broadcast")
    res.send("ws broadcast")
  })
