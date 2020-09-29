import { ref, provide, inject } from 'vue'

const WsSymbol = Symbol()

export function provideWs(ws) {
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
const socket = new WebSocket('ws://localhost:8080');

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