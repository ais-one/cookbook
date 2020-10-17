'use strict'

module.exports = function (app, express) {
  const  { UPLOAD_STATIC, PROXY_WWW_ORIGIN, WEB_STATIC } = global.CONFIG

  // app.set('case sensitive routing', true)
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
  // Upload URL, Should use Signed URL and get from cloud storage instead
  if (UPLOAD_STATIC && UPLOAD_STATIC.length) {
    UPLOAD_STATIC.forEach(item => {
      if (item.url && item.folder) app.use(item.url, express.static(item.folder))
      else console.log('blank upload details', item)
    })
  }

  return this
}
