import { ref, provide, inject } from 'vue'

const WsSymbol = Symbol()

const _createWs = (endpoint, reconnectMs) => ({
  instance: null, // web socket instance
  onmessage: ref(null), // attach message handler
  endpoint: ref(endpoint),
  reconnectMS: reconnectMs,

  setMessage(onmessage) {
    this.onmessage.value = onmessage
    if (this.instance) this.instance.onmessage = this.onmessage.value 
  },
  send(message) {
    if (this.instance) this.instance.send(message)
  },
  close() {
    if (this.instance) {
      this.instance.close()
      this.instance = null
    }
  },
  connect() {
    console.log('connect', this.endpoint.value)
    if (this.instance) return console.log('ws already connected')
    try {
      this.instance = new WebSocket(this.endpoint.value)
      this.instance.onopen = () => console.log('ws open')
      this.instance.onerror = (err) => ws.close() // err.message
      // // ws.onmessage = null  
      this.instance.onmessage = this.onmessage.value
      this.instance.onclose = (e) => {
        if (!e.wasClean && this.reconnectMs) {
          setTimeout(() => { this.connect(this.endpoint.value, this.reconnectMs) }, this.reconnectMs > 1000 ? this.reconnectMs : 1000)
        } else {
          console.log(`[close] Connection closed cleanly, code=${e.code} reason=${e.reason}`)
        }
      }  
    } catch (e) {
      console.log('connect error', e.toString())
    }
  }
})


export function provideWs(endpoint = 'ws://127.0.0.1:3001', reconnectMs = 10000) {
  const ws = _createWs(endpoint, reconnectMs)
  console.log('provide ws', ws)
  provide(WsSymbol, ws)
}

export function useWs() {
  const ws = inject(WsSymbol)
  if (!ws) throw new Error('no ws found')
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