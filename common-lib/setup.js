// we cannot use process.argv due to jest not passing it down... so use environment
if (!process.env.APPNAME) process.exit(1)
if (!process.env.NODE_ENV) process.exit(2)

const path = require('path')
global.LIB_PATH = path.join(process.cwd(), 'common-lib') // Set Common Path || TBD use node modules
global.APPNAME = process.env.APPNAME
global.APP_PATH = path.join(process.cwd(), APPNAME) 

// module.exports = process.env.APPNAME
