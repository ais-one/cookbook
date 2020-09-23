// we cannot use process.argv due to jest not passing it down... so use environment
if (!process.env.NODE_ENV) {
  console.log('Exiting No Environment Specified')
  process.exit(1)
}
const { version, name } = require('./package.json')

const path = require('path')
global.APP_VERSION = version
global.APP_NAME = name
global.LIB_PATH = path.join(process.cwd(), 'lib') // Set Common Paths
global.APP_PATH = path.join(process.cwd())
global.COMMON_LIB_PATH = path.join(process.cwd(), '..', 'common-lib') // Set Common Paths
