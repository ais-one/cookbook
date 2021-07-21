module.exports = function(app, express, options) {
  const { ENABLE_LOGGER } = options
  const  { HELMET_OPTIONS, CORS_OPTIONS, CORS_ORIGINS } = options
  const { COOKIE_SECRET = (parseInt(Date.now() / 28800000) * 28800000).toString() } = options

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

  // ------ OPENAPI ------
  // if serving multiple documents
  // const swaggerDocumentOne = require('./swagger-one.json');
  // const swaggerDocumentTwo = require('./swagger-one.json');
  // app.use('/api-docs-one', swaggerUi.serveFiles(swaggerDocumentOne, options), swaggerUi.setup(swaggerDocumentOne));
  // app.use('/api-docs-two', swaggerUi.serveFiles(swaggerDocumentTwo, options), swaggerUi.setup(swaggerDocumentTwo));
  // load from multiple URLs
  // var options = {
  //   explorer: true,
  //   swaggerOptions: {
  //     urls: [
  //       { url: 'http://petstore.swagger.io/v2/swagger.json', name: 'Spec1' },
  //       { url: 'http://petstore.swagger.io/v2/swagger.json', name: 'Spec2' }
  //     ]
  //   }
  // }
  const { OPENAPI_PATH, OPENAPI_VALIDATOR } = options
  if (OPENAPI_PATH) {
    const swaggerUi = require('swagger-ui-express')
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(require('yamljs').load(OPENAPI_PATH), { explorer: true }))
    if (OPENAPI_VALIDATOR) {
      const OpenApiValidator = require('express-openapi-validator')
      app.use(OpenApiValidator.middleware(OPENAPI_VALIDATOR))  
    }
  }

  const passport = require('passport')
  app.use(passport.initialize())
  passport.serializeUser((user, done) => { done(null, user) })
  passport.deserializeUser((user, done) => { done(null, user) })
  
  return this // this is undefined...
}
