import Ws from '@common/iso/ws';

const { VITE_WS_URL, VITE_WS_MS } = import.meta.env;

export const ws = new Ws({ endpoint: VITE_WS_URL, reconnectMs: VITE_WS_MS }); // ws.setOptions()

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
