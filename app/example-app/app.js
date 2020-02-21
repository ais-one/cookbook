'use strict'
// const functions = require('firebase-functions')
const express = require('express')
const history = require('connect-history-api-fallback')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
// const helmet = require('helmet')
// const csrf = require('csurf')
// app.use(csrf());
// app.use(function(req, res, next){ 
//  // Expose variable to templates via locals
//  res.locals.csrftoken = req.csrfToken(); 
//  next()
// })
// <input type="hidden" name="<i>csrf" value={{csrftoken}} />

// RATE-LIMIT
// const redisClient = require('redis').createClient();
// const app = express();
// const limiter = require('express-limiter')(app, redisClient);
// // Limit requests to 100 per hour per ip address.
// limiter({
//   lookup: ['connection.remoteAddress'], total: 100, expire: 1000 * 60 * 60
// })

const http = require('http')
const https = require('https')
const proxy = require('http-proxy-middleware')

const swaggerUi = require('swagger-ui-express')
const swaggerJSDoc = require('swagger-jsdoc')

const apollo = require('./graphql')

const { CORS_OPTIONS, USE_HTTPS, PROXY_WWW_ORIGIN, WWW_SERVE, httpsCerts } = require('./config')

// console.log('httpsCerts', httpsCerts)

// Set CORS headers so that the React SPA is able to communicate with this server
// Access-Control-Allow-Origin=*
// Access-Control-Allow-Methods=GET,POST,PUT,PATCH,DELETE,OPTIONS
// Access-Control-Allow-Headers=Content-Type

const app = express()

app.set('trust proxy', true) // true if behind proxy, false if direct connect... You now can get IP from req.ip, req.ips
apollo.applyMiddleware({ app }) // console.log(`GraphqlPATH ${server.graphqlPath}`)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser('some_secret'))

app.use('/uploads', express.static('uploads')) // need to create the folder uploads

// PASSPORT - we do not need passport except if for doing things like getting SAML token and converting it to JWT token (see services folder for saml)

// LOWER METHOD IS BETTER - app.use('/api-docs', express.static('docs'), swaggerUi.serve, swaggerUi.setup(require('yamljs').load('./docs/openapi.yaml'), { // for OpenAPI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJSDoc({ swaggerDefinition: require('./config').SWAGGER_DEFS, apis: ['./routes/*.js'] }), { // for OpenAPI
  swaggerOptions: { docExpansion: 'none' },  
  explorer: true 
}))

const authRoutes = require('./routes/auth')
const apiRoutes = require('./routes/api')

const authorRoutes = require('./routes/author')
const bookRoutes = require('./routes/book')
const categoryRoutes = require('./routes/category')
const pageRoutes = require('./routes/page')

app.use(CORS_OPTIONS ? cors(CORS_OPTIONS) : cors())

app.use('/api', authRoutes, apiRoutes, authorRoutes, bookRoutes, categoryRoutes, pageRoutes)

if (PROXY_WWW_ORIGIN && !WWW_SERVE) {
  app.use('*', proxy({
    target: PROXY_WWW_ORIGIN,
    changeOrigin: true,
    ws: true // relies on a initial http request in order to listen to the upgrade event.
    // if you need to upgrade quicker... https://github.com/chimurai/http-proxy-middleware#external-websocket-upgrade
  }))
} else {
  if (WWW_SERVE) {
    app.use(history()) // causes problems when using postman - set header accept application/json in postman
    app.use(express.static('public')) // for serving static content
  }
  app.use("*", async (req, res) => res.status(404).json({ Error: '404 Not Found...' }))
}

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
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
  server = https.createServer(httpsCerts, app)
} else {
  server = http.createServer(app)
}

apollo.installSubscriptionHandlers(server) // if put before server.listen, will mess with WS API
console.log(`🚀 GraphQL Server ready at ${apollo.graphqlPath}`)
console.log(`🚀 GraphQL Subscriptions ready at ${apollo.subscriptionsPath}`)  
const wss = require('../services/websocket').open((err) => console.log(err || 'WS API OPEN OK'))

function handleExit(signal) {
  console.log(`Received ${signal}. Close my server properly.`)
  server.close(() => {
    console.log('Server closed.')
    // close your other stuff...
    wss.close((err) => console.log(err || 'WS API CLOSE OK')) // websockets
    // TBD apollo - does apollo have a shutdown?
    // database / mongo
    // mongo.db.close(false, (err, res) => {
    //   console.log('MongoDb connection closed.')
    //   process.exit(0)
    // })
    process.exit(0)
  })
}

module.exports = { server, handleExit }
