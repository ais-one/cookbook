const APPNAME = require('./appname')
const fs = require('fs')
const dotenv = require('dotenv')
dotenv.config()
if (process.env.NODE_ENV) {
  try {
    const envConfig = dotenv.parse(fs.readFileSync('./'+ APPNAME + '/config/' + '.env.' + process.env.NODE_ENV))
    for (var k in envConfig) process.env[k] = envConfig[k]  
  } catch (e) {
    console.log('missing configuration file, using defaults')
  }
}
const { API_PORT } = require('./'+ APPNAME + '/config')
console.log(APPNAME, process.env.NODE_ENV, API_PORT)

const { server } = require('./'+ APPNAME + '/app')

server.listen(API_PORT, () => {
  console.log('REST API listening on port ' + API_PORT)
})
