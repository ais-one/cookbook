const history = require('connect-history-api-fallback')
const proxy = require('http-proxy-middleware')
const path = require('path')

module.exports = function (app, express) {
  // app.set('case sensitive routing', true)
  const  {
    PROXY_WWW_ORIGIN, WEB_STATIC,
    UPLOAD_URL, UPLOAD_PATH
  } = require('./config')
  const hasWebStatic = WEB_STATIC && WEB_STATIC.length
  if (PROXY_WWW_ORIGIN && !hasWebStatic) {
    app.set('trust proxy', true) // true if behind proxy, false if direct connect... You now can get IP from req.ip, req.ips
    app.use('*', proxy({
      target: PROXY_WWW_ORIGIN,
      changeOrigin: true,
      ws: true // relies on a initial http request in order to listen to the upgrade event.
      // if you need to upgrade quicker... https://github.com/chimurai/http-proxy-middleware#external-websocket-upgrade
    }))
  } else {
    if (hasWebStatic) {
      app.use(history()) // causes problems when using postman - set header accept application/json in postman
      // const appPath = path.join(__dirname, '..', APPNAME)
      // console.log(appPath)
      const appParent = path.join(__dirname, '..')
      WEB_STATIC.forEach(item => {
        app.use(item.url, express.static(appParent + '/' + item.folder))
      })
    }
    app.use("*", async (req, res) => res.status(404).json({ Error: '404 Not Found...' }))
  }
  // console.log('UPLOAD_PATH', UPLOAD_PATH)
  if (UPLOAD_URL) {
    // console.log('UPLOAD: ', path.join(__dirname, '..', APPNAME, UPLOAD_FOLDER) )
    app.use(UPLOAD_URL, express.static( UPLOAD_PATH ))
  }
  return this
}