console.log('To be called by cron', __filename)

require('./setup')
require(LIB_PATH + '/config')() //  first thing to include from LIB_PATH

console.log('Its better for cron call an API than to run this')

process.exit(0)
