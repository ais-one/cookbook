const net = require('net')
const port = 4000
const host = '127.0.0.1'

// creating a custom socket client and connecting it....
const client  = new net.Socket();
client.connect({ host, port })
client.setEncoding('utf8')

client.on('connect', () => {
  console.log('Client: connection established with server')
  // writing data to server
  client.write('hello from client')
})


// client.on('data', (data) => console.log('Data from server:' + data))

client.on('error', (error) => {
  console.log(error.toString())
  client.end()
})

client.on('end', () => console.log('disconnected from server'))
