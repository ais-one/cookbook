const APPNAME = require('./appname')
console.log(APPNAME, process.env.NODE_ENV)
const { server } = require('./app')
const { API_PORT } = require('./'+ APPNAME + '/config')

server.listen(API_PORT, () => {
  console.log('REST API listening on port ' + API_PORT)
})
