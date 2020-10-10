/* eslint-disable */
// TCP server
const net = require('net')
const port = 7070
const host = '127.0.0.1'

const server = net.createServer()
server.listen(port, host, () => {
  console.log('TCP Server is running on port ' + port + '.')
})

let sockets = [];

server.on('connection', (sock) => {
  console.log('CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort)

  sockets.push(sock)

  // sock.setEncoding('utf8')
  sock.on('data', (data) => {
    console.log('DATA ' + sock.remoteAddress + ': ' + data)
    // Write the data back to all the connected, the client will receive it as data from the server
    sockets.forEach((_sock, index, array) => {
      sock.write(_sock.remoteAddress + ':' + _sock.remotePort + " said " + data + '\n')
    })
  })

  // Add a 'close' event handler to this instance of socket
  sock.on('close', (data) => {
    let index = sockets.findIndex((o) => {
      return o.remoteAddress === sock.remoteAddress && o.remotePort === sock.remotePort
    })
    if (index !== -1) sockets.splice(index, 1)
    console.log('CLOSED: ' + sock.remoteAddress + ' ' + sock.remotePort)
  })

  sock.on('error', () => console.log('Socket error'))
})

server.on('close',function(){
  console.log('Server closed 2')
})

const errorTypes = ['unhandledRejection', 'uncaughtException']
const signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2']

errorTypes.map(type => {
  process.on(type, async e => {
    try {
      console.log(`process.on ${type}`)
      console.error(e)
      process.exit(0)
    } catch (_) {
      process.exit(1)
    }
  })
})

signalTraps.map(type => {
  process.once(type, async () => {
    try {
      console.log('Signal Trap', type)
      for (let socket of sockets) socket.destroy()
      // server.close()
      server.close(function () {
        console.log('server closed')
        server.unref()
      })
      // await consumer.disconnect()
      console.log('end')
    } finally {
      // Do not call this as need time to close the server...
      // process.kill(process.pid, type)
    }
  })
})




// https://gist.github.com/sid24rane/2b10b8f4b2f814bd0851d861d3515a10