const { server, handleExit } = require('./'+ require('./appname') + '/app')
const { API_PORT } = require('./'+ require('./appname') + '/config')

server.listen(API_PORT, () => {
  console.log('REST API listening on port ' + API_PORT)
})

process.on('SIGINT', handleExit)
process.on('SIGQUIT', handleExit)
process.on('SIGTERM', handleExit)
