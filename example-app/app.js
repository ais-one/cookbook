'use strict'

const http = require('http')
const https = require('https')
const express = require('express')
const app = express()

console.log('app starting...')

const { USE_GRAPHQL, HTTPS_CERTS } = global.CONFIG
const server = HTTPS_CERTS ? https.createServer(HTTPS_CERTS, app) : http.createServer(app)

require(LIB_PATH + '/express/errorHandler')({ 
  unhandledRejection: null, // (reason, promise) => {}
  uncaughtException: null, // err => {}
  stackTraceLimit: 1
})

// START SERVICES
const { sleep } = require('esm')(module)(LIB_PATH + '/esm/sleep')

const objection = require(LIB_PATH + '/services/db/objection').open()
const mongodb = require(LIB_PATH + '/services/db/mongodb').open()
const websocket = require(LIB_PATH + '/services/websocket').open(null, null) // or set to null
const agenda = require(LIB_PATH + '/services/mq/agenda').open()
const bull = require(LIB_PATH + '/services/mq/bull').open()

const shutdown = async () => {
  try {
    websocket.close() // websockets
    await agenda.close()
    await bull.close()
    await mongodb.close()
    await objection.close()
    // TBD does apollo graphql have a shutdown?
    await sleep(10) // wait awhile more for things to settle
    console.log('Server close done')
  } catch (e) {
    console.log(e)
  }
} 
require(LIB_PATH + '/express/shutdown')(server, shutdown)
// END SERVICES

require(LIB_PATH + '/express/preRoute')(app)

require(LIB_PATH + '/express/saml')(app) // samlRoute PASSPORT - we do not need passport except if for doing things like getting SAML token and converting it to JWT token

try {
  require(APP_PATH + '/router')(app)
  if (USE_GRAPHQL) require(APP_PATH + '/graphql')(app, server)  
} catch (e) {
  console.log(e.toString())
}
require(LIB_PATH + '/express/postRoute')(app, express)

require(LIB_PATH + '/express/errorMiddleware')(
  app
  //, (error, req, res, next) => {}
)
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

module.exports = { server }
