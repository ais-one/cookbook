import { provide, inject } from 'vue'

const WsSymbol = Symbol('WsSymbol')

export function provideWs(ws) {
  console.log('provide ws', ws.endpoint)
  provide(WsSymbol, ws)
}

export function useWs() {
  const ws = inject(WsSymbol)
  if (!ws) throw new Error('no ws found')
  return ws
}

// socket.addEventListener('open', function (event) { // socket.onopen (event)
//     socket.send('Hello Server!');
// });
// // Listen for messages
// socket.addEventListener('message', function (event) { // socket.onmessage (event) // event.data can JSON.parse
//     console.log('Message from server ', event.data);
// });
// socket.send(message) can JSON.stringify
// socket.close()
// socket.onclose
