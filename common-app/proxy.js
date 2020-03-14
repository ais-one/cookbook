const history = require('connect-history-api-fallback')
const proxy = require('http-proxy-middleware')
const path = require('path')

module.exports = function (app, express) {
  // app.set('case sensitive routing', true)

  const  { PROXY_WWW_ORIGIN, WWW_FOLDER, JS_URL_1, JS_FOLDER_1, JS_URL_2, JS_FOLDER_2, APPNAME } = require('./config')
  if (PROXY_WWW_ORIGIN && !WWW_FOLDER) {
    app.set('trust proxy', true) // true if behind proxy, false if direct connect... You now can get IP from req.ip, req.ips
    app.use('*', proxy({
      target: PROXY_WWW_ORIGIN,
      changeOrigin: true,
      ws: true // relies on a initial http request in order to listen to the upgrade event.
      // if you need to upgrade quicker... https://github.com/chimurai/http-proxy-middleware#external-websocket-upgrade
    }))
  } else {
    if (WWW_FOLDER) {
      app.use(history()) // causes problems when using postman - set header accept application/json in postman
      // const appPath = path.join(__dirname, '..', APPNAME)
      // console.log(appPath)
      const appParent = path.join(__dirname, '..')
      app.use(express.static(appParent + '/' + APPNAME + '/' + WWW_FOLDER))
      if (JS_URL_1) app.use(JS_URL_1, express.static(appParent + '/' + JS_FOLDER_1))
      if (JS_URL_2) app.use(JS_URL_2, express.static(appParent + '/' + JS_FOLDER_2))
    }
    app.use("*", async (req, res) => res.status(404).json({ Error: '404 Not Found...' }))
  }
  return this
}