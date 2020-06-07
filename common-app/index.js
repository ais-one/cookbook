const { server } = require('./app')
const { APPNAME, API_PORT } = require('./config')

console.log(APPNAME, process.env.NODE_ENV)
server.listen(API_PORT, () => {
  console.log('REST API listening on port ' + API_PORT)
})
