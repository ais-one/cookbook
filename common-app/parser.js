module.exports = function (app) {
  const bodyParser = require('body-parser')
  const cookieParser = require('cookie-parser')

  // Use Nginx reverse proxy instead for high traffic site
  // const compression = require('compression')
  // app.use(compression()) //Compress all routes

  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(cookieParser('some_secret'))
  return this
}
