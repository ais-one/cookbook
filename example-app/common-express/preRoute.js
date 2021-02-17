'use strict'

module.exports = function(app) {
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
  process.on('uncaughtException',
    err => {
      // console.log('If you do not process uncaughtException, application will crash and hang')
      console.log(`Uncaught Exception: ${err}`)
      if (process.env.NODE_ENV === 'production') process.exit(1) // exit
    }
  )

  const { STACK_TRACE_LIMIT = 1 } = global.CONFIG
  Error.stackTraceLimit = STACK_TRACE_LIMIT // limit error stack trace to 1 level
  console.log('stackTraceLimit: ', STACK_TRACE_LIMIT)

  // ------ LOGGING ------
  const { ENABLE_LOGGER } = global.CONFIG
  if (ENABLE_LOGGER) {
    const morgan = require('morgan')
    app.use(morgan('combined', { stream: process.stdout, skip: (req, res) => res.statusCode < 400 })) // errors
    app.use(morgan('combined', { stream: process.stderr, skip: (req, res) => res.statusCode >= 400 })) // ok
  }

  // ------ SECURITY ------
  // const helmet = require('helmet')
  // app.use(helmet.noCache())

  // Set CORS headers so client is able to communicate with this server
  // Access-Control-Allow-Origin=*
  // Access-Control-Allow-Methods=GET,POST,PUT,PATCH,DELETE,OPTIONS
  // Access-Control-Allow-Headers=Content-Type
  const cors = require('cors')
  const  { CORS_OPTIONS, CORS_ORIGINS } = global.CONFIG
  let corsOptions = CORS_OPTIONS

  if (CORS_OPTIONS) {
    let { origin } = CORS_OPTIONS // origin = ['http://example1.com', 'http://example2.com']
    if (CORS_ORIGINS) origin = CORS_ORIGINS
  
    let allowList = origin.split(',')
    if (allowList.length === 1) origin = allowList[0]
    else if (allowList.length > 1) {
      origin = function (_origin, callback) {
        if(!_origin) return callback(null, true) // allow requests with no origin (like mobile apps or curl requests)
        if (allowList.indexOf(_origin) !== -1) {
          return callback(null, true)
        } else {
          return callback(new Error('Not allowed by CORS'), false)
        }
      }
    }
    if (origin) corsOptions.origin = origin  
  }
  app.use(CORS_OPTIONS ? cors(corsOptions) : cors())

  // const limiter = require('express-limiter')(app, require('redis').createClient())
  // limiter({ lookup: ['connection.remoteAddress'], total: 100, expire: 1000 * 60 * 60 }) // Limit requests to 100 per hour per ip address.
  // const csrf = require('csurf')
  // const compression = require('compression') // Use reverse proxy instead for high traffic site

  // ------ body-parser and-cookie parser ------
  const bodyParser = require('body-parser')
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))

  const cookieParser = require('cookie-parser')
  const { COOKIE_SECRET = (parseInt(Date.now() / 28800000) * 28800000).toString() } = global.CONFIG
  app.use(cookieParser(COOKIE_SECRET))

  // ------ SWAGGER ------
  // use express-oas-generator instead?
  // const { SWAGGER_DEFS } = global.CONFIG
  // if (SWAGGER_DEFS) {
  //   const swaggerUi = require('swagger-ui-express')
  //   const swaggerJSDoc = require('swagger-jsdoc')
  //   // LOWER METHOD IS BETTER - app.use('/api-docs', express.static('docs'), swaggerUi.serve, swaggerUi.setup(require('yamljs').load('./docs/openapi.yaml'), { // for OpenAPI
  //   app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJSDoc({ swaggerDefinition: SWAGGER_DEFS, apis: [`${APP_PATH}/router/**/*.js`] }), { // for OpenAPI
  //     swaggerOptions: { docExpansion: 'none' },
  //     explorer: true
  //   }))  
  // }

  // working SAML ADFS example
  // https://github.com/bergie/passport-saml/blob/master/docs/adfs/README.md
  // const fs = require('fs')
  const { SAML_ISSUER, SAML_ENTRYPOINT, SAML_CALLBACK_URL } = global.CONFIG
  if (SAML_ISSUER) {
    const passport = require('passport')
    const SamlStrategy = require('passport-saml').Strategy
  
    app.use(passport.initialize())

    passport.serializeUser((user, done) => { done(null, user) })
    passport.deserializeUser((user, done) => { done(null, user) })
    
    passport.use('saml', new SamlStrategy(
      {
        // cert: fs.readFileSync('/path/to/adfs.acme_tools.com.crt', 'utf-8'), // PEM in single string to ensure ADFS Server is not a fake one
        issuer: SAML_ISSUER,
        callbackUrl: SAML_CALLBACK_URL, // 'https://acme_tools.com/adfs/postResponse',
        entryPoint: SAML_ENTRYPOINT, // 'https://adfs.acme_tools.com/adfs/ls/',
        // privateCert: fs.readFileSync('/path/to/acme_tools_com.key', 'utf-8'), // not needed yet
        // authnContext: 'http://schemas.microsoft.com/ws/2008/06/identity/authenticationmethod/password',
        // authnContext: 'http://schemas.microsoft.com/ws/2008/06/identity/authenticationmethod/windows',
        acceptedClockSkewMs: -1, // DGAF on time diff between IDP and SP
        identifierFormat: null,
        // this is configured under the Advanced tab in AD FS relying party
        // signatureAlgorithm: 'sha256',
        // RACComparison: 'minimum', // default to exact RequestedAuthnContext Comparison Type: minimum, exact (sometimes cause problems)
        disableRequestedAuthnContext: true,
  
        validateInResponseTo: false
      },
      (profile, done) => {
        console.log('profile', profile)
        return done(null, { // map whatever claims/profile info you want here
          // upn: profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/upn'],
          // // e.g. if you added a Group claim
          // group: profile['http://schemas.xmlsoap.org/claims/Group']
          ...profile
        })
      }
    ))  
  }
  return this // this is undefined...
}
