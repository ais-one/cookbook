const path = require('path')
global.APP_NAME = path.basename( path.dirname(__filename) )
require('../common-lib/setup')

const { server } = require(LIB_PATH + '/app')
const { API_PORT } = require(LIB_PATH + '/config')  
server.listen(API_PORT, () => console.log(`[(${process.env.NODE_ENV}) ${APP_NAME}] listening on port ${API_PORT}`))
