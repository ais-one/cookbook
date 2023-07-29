require('dotenv').config()

const logger = require('./logger')
const net = require('net')
const client = new net.Socket()
const host = process.env.TCP_HOST
const port = process.env.TCP_PORT

console.log('Serial Server 0.0.4')

const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')
let netConnect = false
let commOpen = false
let serialport = null

const COMM_PORT = process.argv[2] || process.env.COMM_PORT
const COMM_BAUD = Number(process.env.COMM_BAUD)
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

logger.on('finish', async () => {
  await sleep(500)
  process.exit(1)
})

//NOSONAR //Should display END before exiting the process according to doc
// logger.info('END')
// logger.end()
if (!COMM_PORT) {
  console.log('Please specify com port in command argument, e.g. rs232.exe COM2')
  logger.end()
} else {
  serialport = new SerialPort(COMM_PORT, {
    baudRate: COMM_BAUD,
    autoOpen: false,
    //NOSONAR default
    // autoOpen: true,
    // endOnClose: false,
    // baudRate: 9600,
    // dataBits: 8,
    // hupcl: true,
    // lock: true,
    // parity: 'none',
    // rtscts: false,
    // stopBits: 1,
    // xany: false,
    // xoff: false,
    // xon: false,
    // highWaterMark: 64 * 1024,
  })  

  serialport.open((err) => {
    if (err) {
      console.log('Error opening serialport: ', err.message)
      logger.end()
      return
    }
    // Because there's no callback to write, write errors will be emitted on the serialport:
    serialport.write('ping')
    commOpen = true
    console.log('Port Open')
  })  
  // The open event is always emitted
  // serialport.on('open', function() { })
  const parser = serialport.pipe(new Readline({ delimiter: '\r\n' }))
  parser.on('data', (data) => {
    if (netConnect) {
      try {
        console.log(data)
        logger.info(data)
        client.write(data)  
      } catch (e) {
        console.log('processing error', e.toString())
      }
    }
  })
  //NOSONAR serialport.on('readable', () => console.log('Data:', serialport.read())) // Read data that is available but keep the stream in "paused mode"
  // serialport.on('data', (data) =>  console.log('Data:', data.toString('utf8'))) // Switches the serialport into "flowing mode"
}

// serial port ping to device
setInterval(() => {
  if (commOpen) serialport.write('ping')
  //NOSONAR if (netConnect) {
  //   console.log('sending TCP')
  //   client.write('test')
  // } else {
  //   console.log('NOT sending TCP - not connected')
  // }
}, 10000) // every 10 seconds

// creating a custom socket client and connecting it....
client.setEncoding('utf8')
let intervalId = false

const TcpConnect = () => {
  console.log('attempt connection')
  client.connect({ host, port })
}

const launchIntervalConnect = (err = 'an error') => {
  if (false !== intervalId) return
  console.log('no connection', err)
  netConnect = false
  intervalId = setInterval(TcpConnect, 5000)
}

const clearIntervalConnect = () => {
  if (false === intervalId) return
  clearInterval(intervalId)
  intervalId = false
}

client.on('connect', () => {
  clearIntervalConnect()
  console.log(`TCP Client: connection established with server @ ${host}:${port}`)
  netConnect = true
})
client.on('error', (err) => launchIntervalConnect('error'))
client.on('close', launchIntervalConnect)
client.on('end', launchIntervalConnect) // dc from server
client.on('timeout', launchIntervalConnect)

// client.on('data', (data) => console.log('Data from server:' + data))

TcpConnect()
