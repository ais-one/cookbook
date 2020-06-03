'use strict'

const http = require('http')
const https = require('https')
const express = require('express')
const app = express()

// mixing ES Modules into a CommonJS project
// https://codewithhugo.com/use-es-modules-in-node-without-babel/webpack-using-esm/
const { foo } = require('esm')(module)('./common/datetime')
console.log('Value from ES Module file...', foo)

const config = require('./common-app/config') //  first thing to include
require('./common-app/express-preroute')(app, config) // use as early as possible

// PASSPORT - we do not need passport except if for doing things like getting SAML token and converting it to JWT token (see common-app folder for saml)
const { APPNAME, USE_GRAPQL } = config
const apollo = USE_GRAPQL ? require(`./${APPNAME}/graphql`)(app, null) : null
require(`./${APPNAME}/router`)(app)

require('./common-app/express-postroute')(app, express, config) //require after routes setup

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
const server = USE_HTTPS ? https.createServer(httpsCerts, app) : http.createServer(app)
if (apollo) {
  apollo.installSubscriptionHandlers(server) // if put before server.listen, will mess with WS API
  console.log(`🚀 GraphQL Server ready at ${apollo.graphqlPath}`)
  console.log(`🚀 GraphQL Subscriptions ready at ${apollo.subscriptionsPath}`)  
}
const wss = require('./common-app/websocket').open(null, null, (err) => console.log(err || 'WS API OPEN OK')) // or set to null
const agenda = require('./common-app/mq/agenda') // add message queue
require('./common-app/mq/bull') // add message queue

// TBD add db, and anything need tear-down etc
require('./common-app/express-exit')({ server, wss, agenda })
module.exports = { server }
