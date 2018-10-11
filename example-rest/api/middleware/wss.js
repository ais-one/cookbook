// const WebSocket = require('ws')
let gWss

module.exports = {
  set: function(wss) {
    gWss = wss
  },
  get: function() {
    return gWss
  }
}