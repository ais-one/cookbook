const template = document.createElement('template')
template.innerHTML = `
<style>
canvas {
  background-color: #ddd;
}
</style>
<canvas id="canvas" width="200px" height="200px"></canvas>
`
class SignPad extends HTMLElement {
  constructor() {
    super()
    const shadowRoot = this.attachShadow({mode: 'open'})
    shadowRoot.appendChild(template.content.cloneNode(true))

    this.mouse = {
      current: { x: 0, y: 0 },
      previous: { x: 0, y: 0 },
      down: false
    }

    this.handleMouseDown = this.handleMouseDown.bind(this) // bind callback function
    this.handleMouseUp = this.handleMouseUp.bind(this) // bind callback function
    this.handleMouseMove = this.handleMouseMove.bind(this) // bind callback function
    this.currentMouse = this.currentMouse.bind(this) // bind callback function
    this.draw = this.draw.bind(this) // bind callback function
  }

  static get observedAttributes() {
    return ['show']
  }

  // getter and setter for property - show
  get show() {
    return this.hasAttribute('show')
  }
  set show(value) {
    value ? this.setAttribute('show', '') : this.removeAttribute('show')
  }

  connectedCallback() { // added to the DOM

    const el = this.shadowRoot.querySelector('#canvas')

    // var c = document.getElementById('canvas')
    var ctx = el.getContext('2d')
    ctx.translate(0.5, 0.5)
    ctx.imageSmoothingEnabled = false
    // this.draw()

    el.addEventListener('mousedown', this.handleMouseDown)
    el.addEventListener('mouseup', this.handleMouseUp)
    el.addEventListener('mousemove', this.handleMouseMove)
  }

  attributeChangedCallback(name, oldVal, newVal) { // attribute changed
  }

  adoptedCallback() { // moved into a new document
  }

  disconnectedCallback() { // removed from the DOM
    const el = this.shadowRoot.querySelector('#canvas')
    el.removeEventListener('mousedown', this.handleMouseDown)
    el.removeEventListener('mouseup', this.handleMouseUp)
    el.removeEventListener('mousemove', this.handleMouseMove)
  }

  handleMouseDown (event) {
    this.mouse.down = true
    this.mouse.current = {
      x: event.offsetX,
      y: event.offsetY
      // x: event.pageX,
      // y: event.pageY
    }
    const c = this.shadowRoot.querySelector('#canvas')
    // var c = document.getElementById('canvas')
    var ctx = c.getContext('2d')
    const { x, y } = this.currentMouse()
    ctx.moveTo(x, y)
  }
  handleMouseUp () {
    this.mouse.down = false
  }
  handleMouseMove (event) {
    this.mouse.current = {
      x: event.offsetX,
      y: event.offsetY
      // x: event.pageX,
      // y: event.pageY
    }
    this.draw(event)
  }

  draw (event) {
    // requestAnimationFrame(this.draw)
    if (this.mouse.down) {
      const c = this.shadowRoot.querySelector('#canvas')
      console.log('draw', event, c.width, c.height, c)
      // var c = document.getElementById('canvas')
      var ctx = c.getContext('2d')
      ctx.clearRect(0, 0, c.width, c.height)
      const { x, y } = this.currentMouse()
      ctx.lineTo(x, y)
      ctx.strokeStyle = '#F63E02'
      ctx.lineWidth = 2
      ctx.stroke()
    }
  }

  currentMouse () {
    // var c = document.getElementById('canvas')
    // var rect = c.getBoundingClientRect()
    // return {
    //   x: this.mouse.current.x - rect.left,
    //   y: this.mouse.current.y - rect.top
    // }
    return {
      x: this.mouse.current.x,
      y: this.mouse.current.y
    }
  }

  // canvas.toDataURL('image/png')
}

customElements.define('vcxwc-sign-pad', SignPad)
