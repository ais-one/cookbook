// const path = require('path')
// require(path.join(process.cwd(), 'setup'))
require('./setup')
const { server } = require(LIB_PATH + '/app')
const { API_PORT } = require(LIB_PATH + '/config')

console.log(APPNAME, process.env.NODE_ENV)
server.listen(API_PORT, () => {
  console.log('REST API listening on port ' + API_PORT)
})
