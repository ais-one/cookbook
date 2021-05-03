const idleTimer = { // logout user if idle
  timeouts: [],

  _idleSecondsTimer: null,
  _idleSecondsCounter: 0,
  _elapsedTsMs: 0, // elapsed timestamp in milliseconds
  _reset: null,
  _check: null,

  reset () { this._idleSecondsCounter = 0 },

  clearElapsedTimeStart () { this._elapsedTsMs = 0 },
  setElapsedTimeStart () { this._elapsedTsMs = Date.now() },
  getElapsedTimeSeconds () { return parseInt((Date.now() - this._elapsedTsMs) / 1000.0) },

  getIdleTimeSeconds () { return this._idleSecondsCounter },

  check() {
    this._idleSecondsCounter++
    for (let timeout of this.timeouts) {
      // console.log('check2', this._idleSecondsCounter, timeout.time)
      if (this._idleSecondsCounter >= timeout.time) {
        if (timeout.stop) this.stop()
        timeout.fn()
      }
    }
  },

  start () {
    if (!this._reset) this._reset = this.reset.bind(this)
    if (!this._check) this._check = this.check.bind(this)

    this.setElapsedTimeStart()
    document.addEventListener('click', this._reset)
    document.addEventListener('mousemove', this._reset)
    document.addEventListener('keypress', this._reset)  
    this._idleSecondsTimer = window.setInterval(this._check, 1000)
  },

  stop () {
    this.clearElapsedTimeStart()
    document.removeEventListener('click', this._reset)
    document.removeEventListener('mousemove', this._reset)
    document.removeEventListener('keypress', this._reset)  
    window.clearInterval(this._idleSecondsTimer)
  }
}

export default idleTimer
