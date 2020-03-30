
// Set CORS headers so that the React SPA is able to communicate with this server
// Access-Control-Allow-Origin=*
// Access-Control-Allow-Methods=GET,POST,PUT,PATCH,DELETE,OPTIONS
// Access-Control-Allow-Headers=Content-Type

module.exports = function (app) {
  const cors = require('cors')
  const  { CORS_OPTIONS } = require('./config')
  app.use(CORS_OPTIONS ? cors(CORS_OPTIONS) : cors())
  return this
}
  