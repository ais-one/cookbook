'use strict'

module.exports = function (app, handler) {
  app.use(
    handler ? 
    handler :
    (error, req, res, next) => { // 200s should not reach here
    let { message = 'Unknown Error', code = 500 } = errorFormatHttp(error)
    res.status(code).json({ message })
  })
}