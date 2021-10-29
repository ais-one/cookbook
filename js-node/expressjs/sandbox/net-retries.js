/* eslint-disable */
var net = require('net');

var interval
// Client
function openSocket() {
  var socket = net.connect(3e3)
  socket.setKeepAlive(true)
  socket.on('connect', onConnect.bind({}, socket))
  socket.on('error', onError.bind({}, socket))
}

function onConnect(socket) {
  console.log('Socket is open!');
  interval = setInterval(function() { socket.write(msg, () => console.log('Sent: ',  (new Date).toISOString())) }, 500)
}

function onError(socket) {
  console.log('Socket error!')
  // Kill socket
  clearInterval(interval)
  socket.destroy()
  socket.unref()
  // Re-open socket
  setTimeout(openSocket, 1e3)
}

openSocket()

// Server
server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    console.log('Address in use, retrying...')
    setTimeout(() => {
      server.close()
      server.listen(PORT, HOST)
    }, 1000)
  }
})