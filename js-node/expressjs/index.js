(async function() {
  // const { exit } = require('process')
  const path = require('path')
  require('dotenv').config() // load
  const { APP_NAME } = process.env

  // console.log(__dirname, process.cwd())
  // exit(1)

  require('dotenv').config({ path: path.join(__dirname, 'apps', APP_NAME, '.env'), override: true } )
  require('dotenv').config({ path: path.join(__dirname, 'apps', APP_NAME, '.env.secret'), override: true } )
  // console.log('Test Env JSON', process.env.MONGO_OPTIONS) && process.exit(0)

  process.env.APP_PATH = path.join(__dirname)
  console.log(process.env.APP_PATH)

  await require('@es-labs/node/config')( __dirname, process.cwd() )
  console.info('Globals setup and config done. Starting app... ')
  const { server } = require('./app')
  const { API_PORT, HTTPS_CERTIFICATE } = process.env
  server.listen(API_PORT, () => console.info(`[(${process.env.NODE_ENV}) ${APP_NAME} ${process.env.APP_VERSION}] listening on port ${API_PORT}, https=${Boolean(HTTPS_CERTIFICATE)}`))
}())
