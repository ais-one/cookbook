'use strict'

const fs = require('fs')
const path = require('path')
const express = require('express')
const { spawn } = require('child_process')
const axios = require('axios')
const PdfKit = require('pdfkit')

const ws = require('@es-labs/node/services/websocket')
const { sleep } = require('esm')(module)('@es-labs/esm/sleep')
const agenda = require('@es-labs/node/services/mq/agenda').get() // agenda message queue
const gcp = require('@es-labs/node/services/gcp')

const { APP_NAME, APP_PATH, APP_VERSION, API_PORT, UPLOAD_STATIC, UPLOAD_MEMORY, HTTPS_CERTIFICATE } = process.env

const { memoryUpload, storageUpload } = require(APP_PATH + '/common/upload')
const { authUser, setTokensToHeader } = require('@es-labs/node/auth')

function openMissingFile() {
  fs.readFile('somefile4.txt', (err, data) => {
    if (err) throw err // will cause node JS to crash if throw error in error handler. just handle error inside here or "return next(err)"
  })
}
// openMissingFile() // test error handling

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

  .get('/healthcheck', (req, res) => res.json({ message: 'OK', app: APP_NAME, environment: process.env.NODE_ENV, version: APP_VERSION, port: API_PORT, https: Boolean(HTTPS_CERTIFICATE) }) ) // health check

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

  .get('/download', (req, res, next) => { // serve a file download, you can add authorization here to control downloads
    const { filename } =  req.query
    const fullPath = path.join(UPLOAD_STATIC[0].folder, filename)

    // Do not read entire chunk
    // fs.readFile(fullPath, (err, data) => {
    //   if (err) {
    //     return next(err)
    //   } else {
    //     res.setHeader('Content-Type', '')
    //     res.setHeader([
    //       'Content-Disposition', `inline; filename="${filename}"`
    //     ])
    //     return res.send(data)
    //   }
    // })

    // Stream file instead
    const file = fs.createReadStream(fullPath)
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader([
      'Content-Disposition', `inline; filename="${filename}"`
    ])
    file.pipe(res)
  })

  .get('/download-pdf', (req, res) => {
    const { filename } =  req.query
    const ext = path.extname(filename)
    if (filename && ext === '.pdf') {
      const fullPath = path.join(UPLOAD_STATIC[0].folder, filename)
      const pdfDoc = new PdfKit()
      pdfDoc.pipe(fs.createWriteStream(fullPath)) // save as file
      pdfDoc.pipe(res) // stream to response
      pdfDoc.text('hello world!')
      pdfDoc.end()  
    }
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

  .get('/get-html', (req, res) => { // render a html page
    const myHtml = (data) => `<h1>Render html, data = ${data.username}</h1>`
    res.type('text/html')
    res.status(200).send( myHtml({ username: 'test name' }) )
  })

