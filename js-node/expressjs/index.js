(async function() {
  // console.log(__dirname, process.cwd())
  require('dotenv').config() // load
  require('dotenv').config({ path: '.env.secret', override: true } )
  // console.log('Test Env JSON', process.env.MONGO_OPTIONS) && process.exit(0)

  const path = require('path')
  process.env.APP_PATH = path.join(__dirname)
  console.log(process.env.APP_PATH)

  await require('@es-labs/node/config')( __dirname, process.cwd() )
  console.info('Globals setup and config done. Starting app... ')
  const { server } = require('./app')
  const { API_PORT, HTTPS_CERTIFICATE } = process.env
  server.listen(API_PORT, () => console.info(`[(${process.env.NODE_ENV}) ${APP_NAME} ${APP_VERSION}] listening on port ${API_PORT} using ${Boolean(HTTPS_CERTIFICATE)}`))
}())
