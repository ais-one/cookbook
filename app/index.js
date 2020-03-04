const fs = require('fs')
const dotenv = require('dotenv')
dotenv.config()
if (process.env.NODE_ENV) {
  try {
    const envConfig = dotenv.parse(fs.readFileSync('.env.' + process.env.NODE_ENV))
    for (var k in envConfig) process.env[k] = envConfig[k]  
  } catch (e) {
    // console.log('missing configuration file, using defaults')
  }
}
const APPNAME = require('./appname')
console.log(APPNAME, process.env.NODE_ENV)

const { server, wss, app } = require('./'+ APPNAME + '/app')
const { API_PORT } = require('./'+ APPNAME + '/config')

Error.stackTraceLimit = 1 // limit error stack trace to 1 level

app.use(function(error, req, res, next) { // global error handler
  let [code = 500, e = null] = error
  // const { message, stack } = e
  if (!e) { // set based on error code
    if (code === 500) e = 'Server Error'
    else if (code === 401) e = 'Unauthorized'
    else if (code === 403) e = 'Forbidden'
    else if (code === 404) e = 'Not Found'
    else if (code === 409) e = 'Conflict'
    else if (code === 422) e = 'Input Error'
    else e = 'Unknown Error'
    
  }
  res.status(code || 500).json({ e: e.message || e })
  // res.status(error.code || 500).json({ e: error.e.message })
})
server.listen(API_PORT, () => {
  console.log('REST API listening on port ' + API_PORT)
})


function handleExit(signal) {
  console.log(`Received ${signal}. Close my server properly.`)
  server.close(() => {
    console.log('Server closed.')
    // close your other stuff...
    if (wss) wss.close((e) => console.log(e || 'WS API CLOSE OK')) // websockets
    // TBD apollo - does apollo have a shutdown?
    // database / mongo
    // mongo.db.close(false, (err, res) => {
    //   console.log('MongoDb connection closed.')
    //   process.exit(0)
    // })
    process.exit(0)
  })
}

process.on('SIGINT', handleExit)
process.on('SIGQUIT', handleExit)
process.on('SIGTERM', handleExit)
