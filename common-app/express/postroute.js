const path = require('path')

module.exports = function (app, express, config) {
  // app.set('case sensitive routing', true)
  const  {
    PROXY_WWW_ORIGIN, WEB_STATIC, UPLOAD_STATIC,
    UPLOAD_URL, UPLOAD_PATH
  } = config
  const hasWebStatic = WEB_STATIC && WEB_STATIC.length
  if (PROXY_WWW_ORIGIN && !hasWebStatic) {
    const proxy = require('http-proxy-middleware')
    app.set('trust proxy', true) // true if behind proxy, false if direct connect... You now can get IP from req.ip, req.ips
    app.use('*', proxy({
      target: PROXY_WWW_ORIGIN,
      changeOrigin: true,
      ws: true // relies on a initial http request in order to listen to the upgrade event.
      // if you need to upgrade quicker... https://github.com/chimurai/http-proxy-middleware#external-websocket-upgrade
    }))
  } else {
    if (hasWebStatic) {
      const history = require('connect-history-api-fallback')
      app.use(history()) // causes problems when using postman - set header accept application/json in postman
      // const appParent = path.join(__dirname, '..', '..') // TBD FIX THIS!!!
      WEB_STATIC.forEach(item => {
        // app.use(item.url, express.static(appParent + '/' + item.folder))
        app.use(item.url, express.static(item.folder))
      })
    }
    app.use("*", async (req, res) => res.status(404).json({ Error: '404 Not Found...' }))
  }
  // Upload URL, Should use Signed URL and get from cloud storage instead
  if (UPLOAD_STATIC && UPLOAD_STATIC.length) {
    UPLOAD_STATIC.forEach(item => {
      if (item.url && item.folder) app.use(item.url, express.static(item.folder))
      else console.log('blank upload details')
    })
  }
  if (UPLOAD_URL) {
    app.use(UPLOAD_URL, express.static( UPLOAD_PATH ))
  }

  Error.stackTraceLimit = 1 // limit error stack trace to 1 level
  const { NODE_ENV } = config
  app.use((error, req, res, next) => { // 200s should not reach here
    // console.log('message', error.message)
    // console.log('name', error.name)
    // console.log('stack', error.stack)
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
    const errorMap = {
      'Bad Request': 400,
      'Unauthorized': 401,
      'Forbidden': 403,
      'Not Found': 404,
      'Conflict': 409,
      'Unprocessable Entity': 422
    }
    const body = {
      error: 'Unknown Error',
      trace: null
    }
    let statusCode = 500
    if (error instanceof Error || error.code) { // error.code is custom error class, which has property code
      statusCode = error.code || errorMap[error.message] || 500
      body.error =  error.message
      if (NODE_ENV === 'development') body.trace = error.stack
    }
    res.status(statusCode).json(body)
  })

  return this
}
