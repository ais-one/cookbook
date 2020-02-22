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

const { server, handleExit } = require('./'+ APPNAME + '/app')
const { API_PORT } = require('./'+ APPNAME + '/config')

server.listen(API_PORT, () => {
  console.log('REST API listening on port ' + API_PORT)
})

process.on('SIGINT', handleExit)
process.on('SIGQUIT', handleExit)
process.on('SIGTERM', handleExit)
