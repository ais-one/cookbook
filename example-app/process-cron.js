console.log('To be called by cron', __filename)

require(require('path').join(process.cwd(), 'common-lib', 'setup')) // first thing to setup
require(LIB_PATH + '/config') //  first thing to include from LIB_PATH

console.log('Its better for cron call an API than to run this')

process.exit(0)
