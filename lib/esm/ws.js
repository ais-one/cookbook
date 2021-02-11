const ws = {
  instance: null, // web socket instance
  onmessage: null, // attach message handler
  endpoint: null,
  reconnectMS: 0, // number of retries? not implemented

  setEndpoint(endpoint) {
    this.endpoint = endpoint
  },
  setReconnectMs(reconnectMS) {
    this.reconnectMS = reconnectMS
  },
  setMessage(onmessage) {
    this.onmessage = onmessage
    if (this.instance) this.instance.onmessage = this.onmessage
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
    console.log('connect', 'endpoint=', this.endpoint, 'reconnectMs=', this.reconnectMS)
    if (!this.endpoint) return console.log('ws no endpoint')
    if (this.instance) return console.log('ws already connected')

    try {
      this.instance = new WebSocket(this.endpoint)
      this.instance.onopen = () => console.log('ws open')
      this.instance.onerror = (err) => {
        console.log(err.message)
        ws.close()
      }
      this.instance.onmessage = this.onmessage
      this.instance.onclose = (e) => {
        if (!e.wasClean && this.reconnectMs) {
          setTimeout(
            () => {
              this.connect()
            },
            this.reconnectMs > 1000 ? this.reconnectMs : 1000
          )
        } else {
          console.log(`[close] Connection closed cleanly, code=${e.code} reason=${e.reason}`)
        }
      }
    } catch (e) {
      console.log('connect error', e.toString())
    }
  }
}

export default ws
