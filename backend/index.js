'use strict'
const dotenv = require('dotenv')
dotenv.config()
const fs = require('fs')
if (process.env.NODE_ENV) {
  try {
    const envConfig = dotenv.parse(fs.readFileSync('.env.' + process.env.NODE_ENV))
    for (var k in envConfig) process.env[k] = envConfig[k]  
  } catch (e) {
    console.log('missing configuration file, using defaults')
  }
}
console.log('Environment: ', process.env.NODE_ENV)

const API_PORT = process.env.API_PORT || 3000
const USE_HTTPS = process.env.USE_HTTPS || false // USE_HTTPS should be path to letsencrypt location OR false 
console.log('HTTPS: ', USE_HTTPS ? 'Yes' : 'No')
let credentials
if (USE_HTTPS) credentials = { key: fs.readFileSync(`${USE_HTTPS}/privkey.pem`), cert: fs.readFileSync(`${USE_HTTPS}/fullchain.pem`) }

// const functions = require('firebase-functions')
const bodyParser = require('body-parser')
const express = require('express')
const cors = require('cors')
const https = require('https')

const swaggerUi = require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerDocument = YAML.load('./docs/openapi.yaml')

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static('public')) // for html content

app.use('/api-docs', express.static('docs')) // for OpenAPI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, { // for OpenAPI
  swaggerOptions: {
    docExpansion: 'none'
  },  
  explorer: true 
}))

// const {db, auth} = require('./firebase') // no longer need to do this
// app.db = db
// app.auth = auth

const authRoutes = require('./routes/auth')
const apiRoutes = require('./routes/api')

app.use(cors())
app.use('/auth', authRoutes)
app.use('/api', apiRoutes)

app.get("*", async (req, res) => {
  return res.status(404).json({ data: 'Not Found...' })
})

// for Firebase Functions
// exports.api = functions.https.onRequest(async (req, res) => {
//   // if (!req.path) {
//   //   req.url = `/${req.url}` // prepend '/' to keep query params if any
//   // }
//   return app(req, res)
//   // return res.send("Hello from Firebase!")
// })

if (USE_HTTPS) {
  https.createServer(credentials, app).listen(API_PORT, () => console.log('REST API listening on port ' + API_PORT))
} else {
  app.listen(API_PORT, () => console.log('REST API listening on port ' + API_PORT))
}

const WebSocket = require('ws')
const wss = require('./services/websocket')

wss.on('connection', function connection(ws) {
  console.log('connected')
  ws.isAlive = true
  ws.on('pong', () => { ws.isAlive = true })
  ws.on('close', function close() { console.log('disconnected') })
  ws.on('message', async function incoming(message) {
    console.log('message', message)
    // error handling
    // ws.send('something', function ack(error) { console.log }) // If error !defined, send has been completed, otherwise error object will indicate what failed.
    try { // try-catch only detect immediate error, cannot detect if write failure
      // const timestamp = new Date(Date.now())
      // send to other clients
      wss.clients.forEach(function each(client) {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(message))
        }
      })
      ws.send(JSON.stringify(message)) // echo back message...
    } catch (e) {
    }
  })
})
// keep alive
setInterval(() => {
  console.log('WS Clients: ', wss.clients.size)
  wss.clients.forEach((ws) => {
    if (!ws.isAlive) return ws.terminate()
    ws.isAlive = false
    ws.ping(() => {})
  })
}, 30000)

module.exports = app