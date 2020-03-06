const history = require('connect-history-api-fallback')
const proxy = require('http-proxy-middleware')

module.exports = function (app, express) {
  const  { PROXY_WWW_ORIGIN, WWW_SERVE } = require('../'+ require('../appname') + '/config')
  if (PROXY_WWW_ORIGIN && !WWW_SERVE) {
    app.set('trust proxy', true) // true if behind proxy, false if direct connect... You now can get IP from req.ip, req.ips
    app.use('*', proxy({
      target: PROXY_WWW_ORIGIN,
      changeOrigin: true,
      ws: true // relies on a initial http request in order to listen to the upgrade event.
      // if you need to upgrade quicker... https://github.com/chimurai/http-proxy-middleware#external-websocket-upgrade
    }))
  } else {
    if (WWW_SERVE) {
      app.use(history()) // causes problems when using postman - set header accept application/json in postman
      app.use(express.static('public')) // for serving static content
    }
    app.use("*", async (req, res) => res.status(404).json({ Error: '404 Not Found...' }))
  }
  return this
}