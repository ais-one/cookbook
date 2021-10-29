// Using options instead of class, only below commented code is use to replace "class Ws {", and the constructor 
// const ws = { // similar except need comma after eachb option
//   instance: null, // web socket instance
//   options: {
//     onmessage: null, // attach message handler
//     endpoint: null,
//     reconnectMS: 0, // number of retries? not implemented
//   },
class Ws {
  constructor(options = {}, tokens = {}) {
    this.instance = null // web socket instance
    this.options = {
      onmessage: null, // attach message handler
      endpoint: null,
      reconnectMS: 0, // number of retries? not implemented
    }
    Object.assign(this.options, options)
  }
  setOptions (options) { Object.assign(this.options, options) }
  getOptions () { return this.options }

  setMessage(onmessage) {
    this.options.onmessage = onmessage
    if (this.instance) this.instance.onmessage = this.options.onmessage
  }
  send(message) {
    if (this.instance) this.instance.send(message)
  }
  close() {
    if (this.instance) {
      this.instance.close()
      this.instance = null
    }
  }
  connect() {
    console.log(`ws connecting... endpoint=${this.options.endpoint} reconnectMs=${this.options.reconnectMS}`)
    if (!this.options.endpoint) return console.log('ws connect failed - no endpoint')
    if (this.instance) return console.log('ws connect failed - already connected')

    try {
      this.instance = new WebSocket(this.options.endpoint)
      this.instance.onopen = () => console.log('ws open - connected')
      this.instance.onerror = (err) => console.log(err)
      this.instance.onmessage = this.options.onmessage
      this.instance.onclose = (e) => {
        if (!e.wasClean && this.options.reconnectMs) {
          setTimeout(
            () => {
              this.connect()
            },
            this.options.reconnectMs > 1000 ? this.options.reconnectMs : 1000
          )
        } else {
          console.log(`ws connection closed cleanly, code=${e.code} reason=${e.reason}`)
        }
      }
    } catch (e) {
      console.log('ws connect error', e.toString())
    }
  }
}

export default Ws
