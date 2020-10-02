'use strict'

module.exports = function(app) {
  // ------ LOGGING ------
  const { ENABLE_LOGGER } = global.CONFIG
  if (ENABLE_LOGGER) {
    const morgan = require('morgan')
    app.use(morgan('combined', { // errors
      stream: process.stdout, skip: (req, res) => res.statusCode < 400
    }))
    app.use(morgan('combined', { // ok
      stream: process.stderr, skip: (req, res) => res.statusCode >= 400
    }))  
  }

  // ------ SECURITY ------
  // const helmet = require('helmet')
  // app.use(helmet.noCache())

  // Set CORS headers so that the React SPA is able to communicate with this server
  // Access-Control-Allow-Origin=*
  // Access-Control-Allow-Methods=GET,POST,PUT,PATCH,DELETE,OPTIONS
  // Access-Control-Allow-Headers=Content-Type
  const cors = require('cors')
  const  { CORS_OPTIONS, CORS_ORIGINS } = global.CONFIG
  let { origin } = CORS_OPTIONS  // origin = ['http://example1.com', 'http://example2.com']
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
  const corsOptions = CORS_OPTIONS
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
  const  { SWAGGER_DEFS } = global.CONFIG
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
