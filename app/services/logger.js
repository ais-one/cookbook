const morgan = require('morgan')

module.exports = function(app) {
  if (!this.logger) {
    this.logger = morgan
    app.use(morgan('combined', { // errors
      stream: process.stderr,
      skip: (req, res) => res.statusCode < 400
    }))
    app.use(morgan('combined', { // ok
      stream: process.stdout,
      skip: (req, res) => res.statusCode >= 400
    }))  
  }

  // const winston = require('winston')
  // logger = winston.createLogger({
  //   level: 'info',
  //   format: winston.format.json(),
  //   defaultMeta: { service: 'user-service' },
  //   transports: [
  //     new winston.transports.Console({
  //       handleExceptions: true,
  //       json: false
  //     })
  //   ]
  // })

  return this
}
