const path = require('path')
require(path.join(process.cwd(), 'common-lib', 'setup')) // first thing to setup
require(LIB_PATH + '/config') //  first thing to include from LIB_PATH

const { server } = require(LIB_PATH + '/app')
const { API_PORT } = global.CONFIG
server.listen(API_PORT, () => console.log(`[(${process.env.NODE_ENV}) ${process.env.APP_NAME}] listening on port ${API_PORT}`))
