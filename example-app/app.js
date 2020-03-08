'use strict'
const config = require('../common-app/config') //  first thing to include
const http = require('http')
const https = require('https')
const express = require('express')
const apollo = require('./graphql')
const app = express()

require('../common-app/logger')(app) // use as early as possible
require('../common-app/cors')(app)
require('../common-app/security')(app)
require('../common-app/swagger')(app)
apollo.applyMiddleware({ app }) // console.log(`GraphqlPATH ${server.graphqlPath}`)

require('../common-app/parser')(app)
// app.use('/uploads', express.static(config.APPNAME + '/uploads')) // need to create the folder uploads
app.use('/uploads', express.static('uploads')) // need to create the folder uploads

// PASSPORT - we do not need passport except if for doing things like getting SAML token and converting it to JWT token (see common-app folder for saml)

const authRoutes = require('./routes/auth')
const apiRoutes = require('./routes/api')

const authorRoutes = require('./routes/author')
const bookRoutes = require('./routes/book')
const categoryRoutes = require('./routes/category')
const pageRoutes = require('./routes/page')

app.use('/api', authRoutes, apiRoutes, authorRoutes, bookRoutes, categoryRoutes, pageRoutes)
require('../common-app/proxy')(app, express) //require after routes setup
require('../common-app/error')(app)

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

const { USE_HTTPS, httpsCerts } = config 
let server
if (USE_HTTPS) {
  server = https.createServer(httpsCerts, app)
} else {
  server = http.createServer(app)
}

apollo.installSubscriptionHandlers(server) // if put before server.listen, will mess with WS API
console.log(`🚀 GraphQL Server ready at ${apollo.graphqlPath}`)
console.log(`🚀 GraphQL Subscriptions ready at ${apollo.subscriptionsPath}`)  
const wss = require('../common-app/websocket').open((err) => console.log(err || 'WS API OPEN OK')) // or set to null

// TBD add db, and anything need tear-down etc
require('../common-app/exit')(server, wss)
module.exports = { server }
