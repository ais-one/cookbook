// we cannot use process.argv due to jest not passing it down... so use environment
if (!process.env.APPNAME) process.exit(1)
if (!process.env.NODE_ENV) process.exit(2)

module.exports = process.env.APPNAME
