'use strict'
const http = require('http')
const https = require('https')
const { USE_HTTPS, httpsCerts } = require('./config')

const express = require('express')
const apollo = require('./graphql')

const app = express()
require('../services/logger')(app) // use as early as possible
require('../services/cors')(app)
require('../services/security')(app)
require('../services/swagger')(app)

apollo.applyMiddleware({ app }) // console.log(`GraphqlPATH ${server.graphqlPath}`)

require('../services/parser')(app)
app.use('/uploads', express.static('uploads')) // need to create the folder uploads

// PASSPORT - we do not need passport except if for doing things like getting SAML token and converting it to JWT token (see services folder for saml)

const authRoutes = require('./routes/auth')
const apiRoutes = require('./routes/api')

const authorRoutes = require('./routes/author')
const bookRoutes = require('./routes/book')
const categoryRoutes = require('./routes/category')
const pageRoutes = require('./routes/page')

app.use('/api', authRoutes, apiRoutes, authorRoutes, bookRoutes, categoryRoutes, pageRoutes)
require('../services/proxy')(app, express) //require after routes setup

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
// for Firebase Functions
// const functions = require('firebase-functions')
// exports.api = functions.https.onRequest(async (req, res) => {
//   // if (!req.path) {
//   //   req.url = `/${req.url}` // prepend '/' to keep query params if any
//   // }
//   return app(req, res)
//   // return res.send("Hello from Firebase!")
// })

let server
if (USE_HTTPS) {
  server = https.createServer(httpsCerts, app)
} else {
  server = http.createServer(app)
}

apollo.installSubscriptionHandlers(server) // if put before server.listen, will mess with WS API
console.log(`🚀 GraphQL Server ready at ${apollo.graphqlPath}`)
console.log(`🚀 GraphQL Subscriptions ready at ${apollo.subscriptionsPath}`)  
const wss = require('../services/websocket').open((err) => console.log(err || 'WS API OPEN OK')) // or set to null

module.exports = { server, wss, app }
