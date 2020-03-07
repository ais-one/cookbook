module.exports = function (app) {
  const bodyParser = require('body-parser')
  const cookieParser = require('cookie-parser')
 
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(cookieParser('some_secret'))
  return this
}