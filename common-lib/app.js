'use strict'

const http = require('http')
const https = require('https')
const express = require('express')
const app = express()

// mixing ES Modules into a CommonJS project
// https://codewithhugo.com/use-es-modules-in-node-without-babel/webpack-using-esm/
const { APP_VERSION } = require('esm')(module)('./esm/util')
console.log('APP_VERSION from ES Module file...', APP_VERSION)

const { USE_HTTPS, USE_GRAPHQL, httpsCerts } = global.CONFIG
const server = USE_HTTPS ? https.createServer(httpsCerts, app) : http.createServer(app)

require(LIB_PATH + '/express/services')(server)
require(LIB_PATH + '/express/preroute')(app)
// PASSPORT - we do not need passport except if for doing things like getting SAML token and converting it to JWT token
try {
  require(APP_PATH + '/router')(app)
  if (USE_GRAPHQL) require(APP_PATH + '/graphql')(app, server)  
} catch (e) {
  console.log(e.toString())
}
require(LIB_PATH + '/express/postroute')(app, express)

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
