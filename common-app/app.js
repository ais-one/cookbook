'use strict'

const http = require('http')
const https = require('https')
const express = require('express')
const app = express()

// mixing ES Modules into a CommonJS project
// https://codewithhugo.com/use-es-modules-in-node-without-babel/webpack-using-esm/
const { foo } = require('esm')(module)('./esm/datetime')
console.log('Value from ES Module file...', foo)

const config = require('./config') //  first thing to include
const { APPNAME, USE_HTTPS, httpsCerts, USE_GRAPHQL } = config
const server = USE_HTTPS ? https.createServer(httpsCerts, app) : http.createServer(app)

require('./express/services')(server, app, config)
require('./express/preroute')(app, config)
// PASSPORT - we do not need passport except if for doing things like getting SAML token and converting it to JWT token (see common-app folder for saml)
require(`../${APPNAME}/router`)(app)
if (USE_GRAPHQL) require(`../${APPNAME}/graphql`)(app, server, config)
require('./express/postroute')(app, express, config)

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
