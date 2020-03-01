let logger

if (!logger) {
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
}

module.exports = logger
