// global error handler
Error.stackTraceLimit = 1 // limit error stack trace to 1 level

module.exports = function (app) {
  app.use(function (error, req, res, next) {
    if (typeof error === 'object') {
      if (error.length) {
        let [code = 500, e = null] = error
        // const { message, stack } = e
        if (!e) { // set based on error code
          if (code === 500) e = 'Server Error'
          else if (code === 401) e = 'Unauthorized'
          else if (code === 403) e = 'Forbidden'
          else if (code === 404) e = 'Not Found'
          else if (code === 409) e = 'Conflict'
          else if (code === 422) e = 'Input Error'
          else e = 'Unknown Error'
        }
        res.status(code || 500).json({ e: e.message || e })  
      } else {
        res.status(500).json({ e: error.toString() })
      }
    } else {
      res.status(500).json({ e: error })
    }
  })
}

