const APPNAME = require('./common-app/appname')
console.log(APPNAME, process.env.NODE_ENV)
const { server } = require('./common-app/app')
const { API_PORT } = require('./'+ APPNAME + '/config')

server.listen(API_PORT, () => {
  console.log('REST API listening on port ' + API_PORT)
})
