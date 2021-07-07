'use strict'

module.exports = function (app, express, options) {
  const  { UPLOAD_STATIC, PROXY_WWW_ORIGIN, WEB_STATIC } = options

  // app.set('case sensitive routing', true)

  // Upload URL, Should use Signed URL and get from cloud storage instead
  if (UPLOAD_STATIC) { 
    const serveIndex = require('serve-index') // connect-history-api-fallback causes problems, so do upload first
    const { url, folder, list, listOptions } = UPLOAD_STATIC
    if (url && folder) {
      app.use(url, express.static(folder))
      if (list) app.use(url, serveIndex(folder, listOptions)) // allow file and directory to be listed
    }
  }

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
      WEB_STATIC.forEach(item => {
        app.use(item.url, express.static(item.folder, item.options)) // { extensions: ['html'], index: false }
      })
    }
    app.use("*", (req, res) => res.status(404).json({ Error: '404 Not Found...' }))
  }

  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
  // 'Bad Request': 400, 'Unauthorized': 401, 'Forbidden': 403, 'Not Found': 404, 'Conflict': 409, 'Unprocessable Entity': 422, 'Internal Server Error': 500,
  app.use((error, req, res, next) => { // error middleware - 200s should not reach here
    // console.log('typeof error', error instanceof Error)
    console.log('error', error)
    let message= 'Unknown Error'
    if (error.message) {
      // console.log('Error Object', error.name, error.name, error.stack)
      message = process.env.NODE_ENV === 'development' ? error.stack : error.message
    } else if (typeof error === 'string') {
      message = error
    } else if (error?.toString) {
      message = error.toString()
    }
    res.status(500).json({ message })
  })
  return this
}
