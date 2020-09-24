'use strict'

module.exports = function (app, handler) {
  app.use(
    handler ? 
    handler :
    (error, req, res, next) => { // 200s should not reach here
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
      if (process.env.NODE_ENV === 'development') body.trace = error.stack
    }
    res.status(statusCode).json(body)
  })
}