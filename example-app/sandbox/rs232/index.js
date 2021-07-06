const SerialPort = require('serialport')

console.log()

comPort = process.argv[2]

if (!comPort) {
  console.log('Please specify com port in command argument, e.g. rs232.exe COM2')
  process.exit(1)
}

const port = new SerialPort(comPort, {
  baudRate: 57600,
  autoOpen: false,
  /* default
  autoOpen: true,
  endOnClose: false,
  baudRate: 9600,
  dataBits: 8,
  hupcl: true,
  lock: true,
  parity: 'none',
  rtscts: false,
  stopBits: 1,
  xany: false,
  xoff: false,
  xon: false,
  highWaterMark: 64 * 1024,
  */
})

port.open(function (err) {
  if (err) {
    return console.log('Error opening port: ', err.message)
  }
  // Because there's no callback to write, write errors will be emitted on the port:
  port.write('Port Open...')
})

// The open event is always emitted
port.on('open', function() {
  // open logic
})

// Read data that is available but keep the stream in "paused mode"
// port.on('readable', function () {
//   console.log('Data:', port.read())
// })

// Switches the port into "flowing mode"
port.on('data', function (data) {
  console.log('Data:', data)
})

// Pipe the data into another stream (like a parser or standard out)
// const lineStream = port.pipe(new Readline())


/*
require('dotenv').config()
 
Your require files which have variables…

const path = require('path')

// Change FROM
let aaa = require(`./xxx/yyy.json`);

// Change TO
const loc = path.join(process.cwd(), `/config/xxx/yyy.json`)
let aaa = require(loc);

npx pkg --targets win ./bin/www
npx pkg --targets linux ./bin/www

npx pkg index.js --targets node14-win-x64 --output rs232.exe
*/