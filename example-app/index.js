(async function() {
  require('./setup') // setup first
  await require(LIB_PATH + '/config')() //  first thing to include from LIB_PATH

  console.log('APPAPPAPPAPP')
  const { server } = require('./app')
  const { API_PORT, HTTPS_CERTS } = global.CONFIG

  server.listen(API_PORT, () => console.log(`[(${process.env.NODE_ENV}) ${APP_NAME} ${APP_VERSION}] listening on port ${API_PORT} using ${HTTPS_CERTS ? 'https' : 'http'}`))

}())
