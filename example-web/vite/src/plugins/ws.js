import { provide, inject } from 'vue'

const WsSymbol = Symbol()

const _createWs = (endpoint, options) => {
  const ws = new WebSocket(endpoint)
  // ws.onopen = () => { }
  // ws.onerror = (err) => {
  //   console.error('Socket encountered error: ', err.message, 'Closing socket');
  //   ws.close()
  // }
  // // ws.onmessage = null  
  // ws.onclose = (e) => {
  //   if (!e.wasClean && options && options.reconnectMs) {
  //     setTimeout(() => {
  //       _createWs()
  //     }, options.reconnectMs > 1000 ? options.reconnectMs : 1000)
  //   } // else `[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`
  // }
  return ws
}

export function provideWs(endpoint = 'ws://127.0.0.1:3001', options) {
  const ws = _createWs(endpoint, options)
  console.log('provide ws', ws)
  provide(WsSymbol, ws)
}

export function useWs() {
  const ws = inject(WsSymbol)
  if (!ws) {
    // throw error, no ws provided
  }
  return ws
}


/*
// Create WebSocket connection.

// Connection opened
socket.addEventListener('open', function (event) { // socket.onopen (event)
    socket.send('Hello Server!');
});

// Listen for messages
socket.addEventListener('message', function (event) { // socket.onmessage (event) // event.data can JSON.parse
    console.log('Message from server ', event.data);
});

socket.send(message) can JSON.stringify


socket.close()

socket.onclose
*/