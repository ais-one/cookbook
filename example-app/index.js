(async function() {
  await require('lib/node/config')( __dirname, process.cwd() )
  console.log('Globals setup and config done. Starting app... ')
  const { server } = require('./app')
  const { API_PORT, HTTPS_CERTS } = global.CONFIG
  server.listen(API_PORT, () => console.log(`[(${process.env.NODE_ENV}) ${APP_NAME} ${APP_VERSION}] listening on port ${API_PORT} using ${HTTPS_CERTS ? 'https' : 'http'}`))
}())
