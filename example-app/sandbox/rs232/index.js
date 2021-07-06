const net = require('net')
const client = new net.Socket()
const port = 4000
const host = '13.212.204.79' // '127.0.0.1'

const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')
let netConnect = false

const COMM_PORT = process.argv[2]

if (!COMM_PORT) {
  console.log('Please specify com port in command argument, e.g. rs232.exe COM2')
  process.exit(1)
}

const serialport = new SerialPort(COMM_PORT, {
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

serialport.open((err) => {
  if (err) {
    return console.log('Error opening serialport: ', err.message)
  }
  // Because there's no callback to write, write errors will be emitted on the serialport:
  // serialport.write('Port Open...')
  console.log('Port Open')
})

// The open event is always emitted
// serialport.on('open', function() {
//   // open logic
// })

const parser = serialport.pipe(new Readline({ delimiter: '\r\n' }))
parser.on('data', (data) => {
  if (netConnect) {
    console.log(data)
    client.write(data)
  }
})

// Read data that is available but keep the stream in "paused mode"
// serialport.on('readable', function () {
//   console.log('Data:', serialport.read())
// })

// Switches the serialport into "flowing mode"
// serialport.on('data', function (data) {
//   console.log('Data:', data.toString('utf8'))
// })

// Pipe the data into another stream (like a parser or standard out)
// const lineStream = serialport.pipe(new Readline())


// creating a custom socket client and connecting it....
client.connect({ host, port })
client.setEncoding('utf8')

client.on('connect', () => {
  console.log('Client: connection established with server')
  netConnect = true
  // writing data to server
  client.write('hello from client')
})

// client.on('data', (data) => console.log('Data from server:' + data))
client.on('error', (error) => {
  netConnect = false
  console.log(error.toString())
  client.end()
})

client.on('end', () => console.log('disconnected from server'))


