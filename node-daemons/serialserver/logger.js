
const winston = require('winston');
require('winston-daily-rotate-file');

const transport = new winston.transports.DailyRotateFile({
  filename: './%DATE%-data.log',
  datePattern: 'YYYY-MM-DD-HH',
  // maxSize: '20m',
  // maxFiles: '14d',
  json: false
});

// transport.on('rotate', function(oldFilename, newFilename) {
//   // do something fun
//   console.log('rotated')
// });

const logger = winston.createLogger({
  transports: [
    transport
  ]
});

// logger.log({
//   level: 'info',
//   message: 'What time is the testing at?'
// });

// try {
//   logger.info('asdadasd')  
// } catch (e) {
//   console.log(e.toString())
// }

module.exports = logger
