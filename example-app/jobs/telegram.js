const path = require('path')

global.APP_NAME = 'example-app'
process.env.NODE_ENV = 'development'

require(path.join(process.cwd(), 'common-lib', 'setup'))
console.log(LIB_PATH, APP_PATH)
// global.APP_NAME = path.basename( path.dirname(__filename) )

require(LIB_PATH + '/config')

console.log(global.CONFIG)
