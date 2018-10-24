'use strict'
const dotenv = require('dotenv')
dotenv.config()
const fs = require('fs')
if (process.env.NODE_ENV) {
  const envConfig = dotenv.parse(fs.readFileSync('.env.' + process.env.NODE_ENV))
  for (var k in envConfig) process.env[k] = envConfig[k]
}

console.log('index', process.env.NODE_ENV)
const API_PORT = process.env.API_PORT
const WS_PORT = process.env.WS_PORT
const USE_HTTPS = process.env.USE_HTTPS || false 
console.log('HTTPS: ', USE_HTTPS ? 'Yes' : 'No')

// const functions = require('firebase-functions')
const bodyParser = require('body-parser')
const express = require('express')
const cors = require('cors')
const https = require('https')

// const swaggerUi = require('swagger-ui-express')
// const YAML = require('yamljs')
// const swaggerDocument = YAML.load('./swagger.yaml') // require('./swagger.json')

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
let {set} = require('./middleware/wss')
const WebSocket = require('ws')

const app = express()
app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// const {db, auth} = require('./firebase') // no longer need to do this
// app.db = db
// app.auth = auth

const authRoutes = require('./routes/auth')
const apiRoutes = require('./routes/api')
const baseRoutes = require('./routes/base')

app.use(cors())
app.use('/', baseRoutes)
app.use('/auth', authRoutes)
app.use('/api', apiRoutes)
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

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

// USE_HTTPS should be path to letsencrypt location
let credentials
if (USE_HTTPS) credentials = { key: fs.readFileSync(`${USE_HTTPS}/privkey.pem`), cert: fs.readFileSync(`${USE_HTTPS}/fullchain.pem`) }

if (USE_HTTPS) {
  https.createServer(credentials, app).listen(API_PORT, () => console.log('REST API listening on port ' + API_PORT))
} else {
  app.listen(API_PORT, () => console.log('REST API listening on port ' + API_PORT))
}

let wss
if (USE_HTTPS) {
  wss = new WebSocket.Server({ server: https.createServer(credentials).listen(WS_PORT) })
} else {
  wss = new WebSocket.Server({ port: WS_PORT })
}

set(wss)

// start websocket server
console.log('WS API listening on port ' + WS_PORT)

wss.on('connection', function connection(ws) {
  console.log('connected')

  ws.isAlive = true
  ws.on('pong', () => {
    ws.isAlive = true;
  })

  ws.on('message', async function incoming(message) {
    console.log('message', message)
    try {
      const timestamp = new Date(Date.now())
      // send to other clients
      wss.clients.forEach(function each(client) {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(message))
        }
      })
      ws.send(JSON.stringify(message))
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
    ws.ping(null)
  })
}, 30000)


module.exports = app