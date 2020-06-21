'use strict'

// set globals here
// caution - avoid name clashes with native JS libraries, other libraries, other globals

// 1. asyncWrapper
// https://strongloop.com/strongblog/async-error-handling-expressjs-es7-promises-generators/#usinges7asyncawait
// https://gist.github.com/Hiswe/fe83c97d1c7c8eee9557939d1b9bc086

// Caveats:
// 1. You must have all your asynchronous code return promises (except emitters). Raw callbacks simply don’t have the facilities for this to work.
// 2. Event emitters (like streams) can still cause uncaught exceptions. So make sure you are handling the error event properly e.g. stream.on('error', next).pipe(res)

// DOs:
// DO use throw, and try/catch when needed
// DO use custom error classes like BadRequestError as it makes sorting errors out easier

// make a closure to keep a reference to our original async function
// function asyncWrapper(asyncRouteHandler) {
//   // this is what will be called by express.js
//   return function routeHandler(request, response, next) {
//     // because it's an async function it will always return a promise
//     // – just call it with express' callback parameters
//     return (
//       asyncRouteHandler(request, response, next)
//         // catch any error that might happen in our async function
//         .catch(next)
//     )
//   }
// }

// OR:

// thanks to arrow functions and params destructuring
// we can write it that way:
// const asyncWrapper = fn => (...args) => fn(...args).catch(args[2])
// module.exports = asyncWrapper

// USAGE:
// const wrap = require('./<path-to>/asyncWrapper')
// app.get('/', wrap(async (req, res) => { ... }))

global.asyncWrapper = fn => (...args) => fn(...args)
  .then(data => (!args[1].headersSent) ? args[1].status(200).json(data || {}) : '')
  .catch(args[2]) //  proceed to error handler

// 2. Custom Errors - HTTP
// TBD
//
// class NotFoundError extends Error {
//   constructor(message) {
//     super(message)
//     this.name = "NotFoundError"
//     this.code = 404
//   }
// }
// global.NotFoundError = NotFoundError

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', reason.stack || reason)
  // Recommended: send the information to sentry.io
  // or whatever crash reporting service you use
})

// comment below and application will crash
process.on('uncaughtException', err => {
  console.log('If you do not process uncaughtException, application will crash')
  console.log(`Uncaught Exception: ${err.message}`)
  // process.exit(1) // force it to crash anyway
})

module.exports = function(app, config) {
  const { ENABLE_LOGGER = false } = config

  // ------ LOGGING ------
  const morgan = require('morgan')
  if (ENABLE_LOGGER) {
    app.use(morgan('combined', { // errors
      stream: process.stdout, skip: (req, res) => res.statusCode < 400
    }))
    app.use(morgan('combined', { // ok
      stream: process.stderr, skip: (req, res) => res.statusCode >= 400
    }))  
  }
  // const winston = require('winston')
  // logger = winston.createLogger({
  //   level: 'info',
  //   format: winston.format.json(),
  //   defaultMeta: { service: 'user-service' },
  //   transports: [
  //     new winston.transports.Console({
  //       handleExceptions: true,
  //       json: false
  //     })
  //   ]
  // })

  // ------ SECURITY ------
  // const helmet = require('helmet')
  // app.use(helmet.noCache())

  // Set CORS headers so that the React SPA is able to communicate with this server
  // Access-Control-Allow-Origin=*
  // Access-Control-Allow-Methods=GET,POST,PUT,PATCH,DELETE,OPTIONS
  // Access-Control-Allow-Headers=Content-Type
  const cors = require('cors')
  const  { CORS_OPTIONS } = config
  let { origin, ...options } = CORS_OPTIONS  // origin = ['http://example1.com', 'http://example2.com']

  let whitelist = origin.split(',')
  if (whitelist.length === 1) origin = whitelist[0]
  else if (whitelist.length > 1) {
    origin = function (origin, callback) {
      if(!origin) return callback(null, true) // allow requests with no origin (like mobile apps or curl requests)
      if (whitelist.indexOf(origin) !== -1) {
        return callback(null, true)
      } else {
        return callback(new Error('Not allowed by CORS'), false)
      }
    }
  }
  const corsOptions = options
  if (origin) corsOptions.origin = origin
  app.use(CORS_OPTIONS ? cors(corsOptions) : cors())

  // RATE-LIMIT
  // const redisClient = require('redis').createClient()
  // const limiter = require('express-limiter')(app, redisClient)
  // // Limit requests to 100 per hour per ip address.
  // limiter({
  //   lookup: ['connection.remoteAddress'], total: 100, expire: 1000 * 60 * 60
  // })

  // const csrf = require('csurf')
  // app.use(csrf())
  // app.use(function(req, res, next){ 
  //   // Expose variable to templates via locals
  //   res.locals.csrftoken = req.csrfToken()
  //   next()
  // })
  // // <input type="hidden" name="<i>csrf" value={{csrftoken}} />

  // ------ body-parser and-cookie parser ------
  const bodyParser = require('body-parser')
  const cookieParser = require('cookie-parser')
  // Use Nginx reverse proxy instead for high traffic site
  // const compression = require('compression')
  // app.use(compression()) //Compress all routes

  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(cookieParser('some_secret'))

  // ------ SWAGGER ------
  const  { SWAGGER_DEFS } = config
  if (SWAGGER_DEFS) {
    const swaggerUi = require('swagger-ui-express')
    const swaggerJSDoc = require('swagger-jsdoc')
    // LOWER METHOD IS BETTER - app.use('/api-docs', express.static('docs'), swaggerUi.serve, swaggerUi.setup(require('yamljs').load('./docs/openapi.yaml'), { // for OpenAPI
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJSDoc({ swaggerDefinition: SWAGGER_DEFS, apis: [`${APP_PATH}/router/**/*.js`] }), { // for OpenAPI
      swaggerOptions: { docExpansion: 'none' },
      explorer: true
    }))  
  }

  return this // this is undefined...
}
