
// Set CORS headers so that the React SPA is able to communicate with this server
// Access-Control-Allow-Origin=*
// Access-Control-Allow-Methods=GET,POST,PUT,PATCH,DELETE,OPTIONS
// Access-Control-Allow-Headers=Content-Type

module.exports = function (app) {
  const cors = require('cors')
  const  { CORS_OPTIONS } = require('./config')
  const { origins, ...options } = CORS_OPTIONS  // origins = ['http://example1.com', 'http://example2.com']

  let origin = origins
  if (origins.split(',').length > 1) {
    origin = function (origin, callback) {
      if(!origin) return callback(null, true) // allow requests with no origin (like mobile apps or curl requests)
      if (origins.split(',').indexOf(origin) !== -1) {
        return callback(null, true)
      } else {
        return callback(new Error('Not allowed by CORS'), false)
      }
    }
  }
  const corsOptions = options
  if (origin) corsOptions.origin = origin

  app.use(CORS_OPTIONS ? cors(corsOptions) : cors())
  return this
}
