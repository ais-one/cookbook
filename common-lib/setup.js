// we cannot use process.argv due to jest not passing it down... so use environment
if (!process.env.NODE_ENV) {
  console.log('Exiting No Environment Specified')
  process.exit(1)
}
// if (global.APP_NAME) process.env.APP_NAME = global.APP_NAME
if (!process.env.APP_NAME) {
  console.log('Exiting No Application Found')
  process.exit(2)
}

const path = require('path')
global.APP_NAME = process.env.APP_NAME
global.LIB_PATH = path.join(process.cwd(), 'common-lib') // Set Common Path || TBD use node modules
global.APP_PATH = path.join(process.cwd(), global.APP_NAME) 
