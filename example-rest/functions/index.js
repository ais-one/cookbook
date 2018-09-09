'use strict'

const env = process.env.NODE_ENV || 'development'
const functions = require('firebase-functions')
const bodyParser = require('body-parser')
const express = require('express')
const cors = require('cors')

const swaggerUi = require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerDocument = YAML.load('./swagger.yaml') // require('./swagger.json')

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// const {db, auth} = require('./firebase') // no longer need to do this
// app.db = db
// app.auth = auth

const baseRoutes = require('./routes/base')
const userRoutes = require('./routes/user')
const resourceRoutes = require('./routes/resource')

// app.use('/user', passport.authenticate('jwt', {session: false}), user);

app.use(cors())
app.use('/', baseRoutes)
app.use('/user', userRoutes)
app.use('/resource', resourceRoutes)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.get("*", async (req, res) => {
  return res.status(404).json({ data: 'Not Found...' })
})

// for Firebase Functions
exports.api = functions.https.onRequest(async (req, res) => {
  // if (!req.path) {
  //   req.url = `/${req.url}` // prepend '/' to keep query params if any
  // }
  return app(req, res)
  // return res.send("Hello from Firebase!")
})

// for Test Server (on localhost or some other machine)
app.listen(3000, () => console.log('Example app listening on port 3000!'))

module.exports = app