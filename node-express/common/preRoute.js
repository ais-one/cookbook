'use strict'

module.exports = function(app, express, options) {
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
    .then(data => (!args[1].headersSent) && args[1].status(500).json(data || { 'error-route': args[0].originalUrl })) // we return an error still
    .catch(args[2]) //  proceed to error handler

  process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled Rejection at:', reason.stack || reason)
    // Recommended: send info to sentry.io or crash reporting service
  })

  // comment below and application will crash
  process.on('uncaughtException', (err) => {
    // console.log('If you do not process uncaughtException, application will crash and hang')
    console.log(`Uncaught Exception: ${err}`)
    if (process.env.NODE_ENV === 'production') process.exit(1) // exit
  })

  const { STACK_TRACE_LIMIT = 1 } = options
  const { ENABLE_LOGGER } = options
  const  { HELMET_OPTIONS, CORS_OPTIONS, CORS_ORIGINS } = options
  const { COOKIE_SECRET = (parseInt(Date.now() / 28800000) * 28800000).toString() } = options

  Error.stackTraceLimit = STACK_TRACE_LIMIT // limit error stack trace to 1 level
  console.log('stackTraceLimit: ', STACK_TRACE_LIMIT)

  // ------ LOGGING ------
  if (ENABLE_LOGGER) {
    const morgan = require('morgan')
    app.use(morgan('combined', { stream: process.stdout, skip: (req, res) => res.statusCode < 400 })) // errors
    app.use(morgan('combined', { stream: process.stderr, skip: (req, res) => res.statusCode >= 400 })) // ok
  }

  // ------ SECURITY ------
  const helmet = require('helmet')
  if (HELMET_OPTIONS) {
    if (HELMET_OPTIONS.nosniff) app.use(helmet.noSniff())
    if (HELMET_OPTIONS.xssfilter) app.use(helmet.xssFilter())
    if (HELMET_OPTIONS.hideServer) app.use(helmet.hidePoweredBy())
    if (HELMET_OPTIONS.csp) app.use(helmet.contentSecurityPolicy(HELMET_OPTIONS.csp))
  }
  // app.use(helmet.noCache())

  // Set CORS headers so client is able to communicate with this server
  // Access-Control-Allow-Origin=*
  // Access-Control-Allow-Methods=GET,POST,PUT,PATCH,DELETE,OPTIONS
  // Access-Control-Allow-Headers=Content-Type
  const cors = require('cors')
  let corsOptions = CORS_OPTIONS

  if (CORS_OPTIONS) {
    let { origin } = CORS_OPTIONS // origin = ['http://example1.com', 'http://example2.com']
    if (CORS_ORIGINS) origin = CORS_ORIGINS
  
    let allowList = origin.split(',')
    if (allowList.length === 1) origin = allowList[0]
    else if (allowList.length > 1) {
      origin = function (_origin, callback) {
        // console.log('CORS origin', typeof _origin, _origin, allowList)
        if(!_origin || _origin === 'null') return callback(null, true) // allow requests with no origin (like mobile apps or curl requests)
        if (allowList.indexOf(_origin) !== -1) {
          return callback(null, true)
        } else {
          return callback(new Error('Not allowed by CORS'), false)
        }
      }
    }
    if (origin) corsOptions.origin = origin  
  }
  app.use(CORS_OPTIONS ? cors(corsOptions) : cors()) // default { origin: '*' }

  // const limiter = require('express-limiter')(app, require('redis').createClient())
  // limiter({ lookup: ['connection.remoteAddress'], total: 100, expire: 1000 * 60 * 60 }) // Limit requests to 100 per hour per ip address.
  // const csrf = require('csurf')
  // const compression = require('compression') // Use reverse proxy instead for high traffic site

  // ------ body-parser and-cookie parser ------
  const { BODYPARSER_JSON, BODYPARSER_URLENCODED } = options
  app.use(express.json( BODYPARSER_JSON || { limit: '2mb' }))
  app.use(express.urlencoded( BODYPARSER_URLENCODED || { extended: true, limit: '2mb' })) // https://stackoverflow.com/questions/29175465/body-parser-extended-option-qs-vs-querystring/29177740#29177740

  const cookieParser = require('cookie-parser')
  app.use(cookieParser(COOKIE_SECRET))

  // ------ SWAGGER ------
  const { OPENAPI_PATH } = options
  if (OPENAPI_PATH) {
    const swaggerUi = require('swagger-ui-express')
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(require('yamljs').load(OPENAPI_PATH), { explorer: true }))

    const OpenApiValidator = require('express-openapi-validator')
    app.use(
      OpenApiValidator.middleware({
        apiSpec: OPENAPI_PATH,
        validateRequests: true, // (default)
        validateResponses: true, // false by default
      }),
    )
  }

  return this // this is undefined...
}
