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
const express = require('express')
const history = require('connect-history-api-fallback');
const bodyParser = require('body-parser')
const cors = require('cors')
const http = require('http')
const https = require('https')

const swaggerUi = require('swagger-ui-express')
const swaggerJSDoc = require('swagger-jsdoc')

const YAML = require('yamljs')
const swaggerDocument = YAML.load('./docs/openapi.yaml')

const apollo = require('./middleware/graphql')

// Set CORS headers so that the React SPA is able to communicate with this server
// Access-Control-Allow-Origin=*
// Access-Control-Allow-Methods=GET,POST,PUT,PATCH,DELETE,OPTIONS
// Access-Control-Allow-Headers=Content-Type

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
const app = express()

apollo.applyMiddleware({ app }); // console.log(`GraphqlPATH ${server.graphqlPath}`)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(history()) // causes problems when using postman, comment out to checkout API
app.use(express.static('public')) // for html content
// app.use('/public-uploads', express.static(path.join('public-uploads'))) // need to create the folder public-uploads

const specs = swaggerJSDoc({
  swaggerDefinition: {
    info: {
      title: 'Vue Crud X',
      version: '1.0.0',
      description: 'A sample API',
    },
    host: '127.0.0.1:'+process.env.API_PORT,
    basePath: '/',
    tags: [
      { name: 'Auth', description: 'Authentication' },
      { name: 'Base', description: 'The Base API' },
    ],
    schemes: [ 'http', 'https' ],
    securityDefinitions: {
      Bearer: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header'
      }
    },
    consumes: ['application/json'],
    produces: ['application/json']
  },
  apis: ['./routes/*.js']
})

app.use('/api-docs', express.static('docs'), swaggerUi.serve, swaggerUi.setup(swaggerDocument, { // for OpenAPI
  swaggerOptions: { docExpansion: 'none' },  
  explorer: true 
}))

app.use('/api-docs2', swaggerUi.serve, swaggerUi.setup(specs, { // for OpenAPI
  swaggerOptions: { docExpansion: 'none' },  
  explorer: true 
}))

// const {db, auth} = require('./firebase') // no longer need to do this
// app.db = db
// app.auth = auth

const authRoutes = require('./routes/auth')
const apiRoutes = require('./routes/api')
const authorRoutes = require('./routes/author')
const bookRoutes = require('./routes/book')
const categoryRoutes = require('./routes/category')
const pageRoutes = require('./routes/page')

app.use(cors())
app.use('/api/auth', authRoutes)
app.use('/api', apiRoutes, authorRoutes, bookRoutes, categoryRoutes, pageRoutes)
app.get("*", async (req, res) => res.status(404).json({ data: 'Not Found...' }))

// for Firebase Functions
// exports.api = functions.https.onRequest(async (req, res) => {
//   // if (!req.path) {
//   //   req.url = `/${req.url}` // prepend '/' to keep query params if any
//   // }
//   return app(req, res)
//   // return res.send("Hello from Firebase!")
// })

let server
if (USE_HTTPS) {
  server = https.createServer(credentials, app)
} else {
  server = http.createServer(app)
}

server.listen(API_PORT, () => {
  console.log('REST API listening on port ' + API_PORT)
  console.log(`🚀 GraphQL Server ready at http://localhost:${API_PORT}${apollo.graphqlPath}`)
  console.log(`🚀 GraphQL Subscriptions ready at ws://localhost:${API_PORT}${apollo.subscriptionsPath}`)
})

apollo.installSubscriptionHandlers(server)

const WebSocket = require('ws')
const wss = require('./services/websocket')

if (wss) {
  wss.on('connection', (ws) => {
    console.log('ws client connected')
    ws.isAlive = true
    ws.on('pong', () => { ws.isAlive = true })
    ws.on('close', () => { console.log('ws client disconnected') })
    ws.on('message', async (message) => {
      console.log('message', message)
      // error handling
      // ws.send('something', function ack(error) { console.log }) // If error !defined, send has been completed, otherwise error object will indicate what failed.
      try { // try-catch only detect immediate error, cannot detect if write failure
        // const timestamp = new Date(Date.now())
        // send to other clients
        wss.clients.forEach((client) => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(message)
          }
        })
        ws.send(message) // echo back message...
      } catch (e) {}
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
}

module.exports = app