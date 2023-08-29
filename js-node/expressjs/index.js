(async function() {
  // const { exit } = require('process')
  // const path = require('path')
  require('dotenv').config() // load
  require('dotenv').config({ path: '.env.secret', override: true }) // load
  // console.log(__dirname, process.cwd())
  // exit(1)
  
  // require('dotenv').config({ path: path.join(__dirname, 'apps', '.env'), override: true } )
  // require('dotenv').config({ path: path.join(__dirname, 'apps', '.env.secret'), override: true } )
  // console.log('Test Env JSON', process.env.MONGO_OPTIONS) && process.exit(0)
  // process.env.APP_PATH = path.join(__dirname)

  await require('@es-labs/node/config')( __dirname, process.cwd() )
  console.info('Globals setup and config done. Starting app... ')

  // if development && hostname == localhost allow TLS - call after config load
  if (process.env.NODE_ENV === 'development') process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0

  const { server } = require('./app')
  const { API_PORT, HTTPS_CERTIFICATE } = process.env
  server.listen(API_PORT, () => console.info(`[(${process.env.NODE_ENV}) ${process.env.APP_VERSION}] listening on port ${API_PORT}, https=${Boolean(HTTPS_CERTIFICATE)}`))
}())
