// FRONTEND ONLY
const template = document.createElement('template')
template.innerHTML = `
<style>
canvas {
  background-color: var(--vcxwc-sign-pad-background-color, #ddd);
}
</style>
<canvas id="canvas"></canvas>
`
class SignPad extends HTMLElement {
  constructor() {
    super()
    const shadowRoot = this.attachShadow({ mode: 'open' })
    shadowRoot.appendChild(template.content.cloneNode(true))
    console.log('SignPad()')
    this.mouse = {
      current: { x: 0, y: 0 },
      previous: { x: 0, y: 0 },
      down: false,
      move: false
    }
    this.handleMouseDown = this.handleMouseDown.bind(this) // bind callback function
    this.handleMouseUp = this.handleMouseUp.bind(this) // bind callback function
    this.handleMouseMove = this.handleMouseMove.bind(this) // bind callback function
    this.currentMouse = this.currentMouse.bind(this) // bind callback function
    this.draw = this.draw.bind(this) // bind callback function
  }

  static get observedAttributes() {
    // default width = 300 (in px)
    // default height = 150 (in px)
    // default value should be ''
    return ['value', 'width', 'height']
  }

  // getter and setter for property - show
  get value() {
    return this.getAttribute('value')
  }

  set value(val) {
    // console.log('setting value', val)
    this.setAttribute('value', val || '')
  }

  attributeChangedCallback(name, oldVal, newVal) {
    const el = this.shadowRoot.querySelector('#canvas')
    switch (name) {
      case 'width': // set canvas width
        el.width = newVal
        break
      case 'height': // set canvas height
        el.height = newVal
        break
      // value no need to handle
    }
  }

  connectedCallback() {
    // const styleSheetList = this.shadowRoot.styleSheets // do this here, not in constructor
    // const bg_rule = styleSheetList[0].cssRules[0]
    // const yyy = context_rule.style.getPropertyValue('--vcxwc-sign-pad-background-color')
    // console.log('bg', bg_rule.style.backgroundColor, yyy)

    // console.log('connect sign')
    this.mouse = {
      current: { x: 0, y: 0 },
      previous: { x: 0, y: 0 },
      down: false,
      move: false
    }

    // console.log('has value?', this.hasAttribute('value'), this.getAttribute('value'))
    if (!this.hasAttribute('value')) this.setAttribute('value', '')

    const el = this.shadowRoot.querySelector('#canvas')
    // console.log('canvas w h', el.width, el.height)
    const ctx = el.getContext('2d')
    ctx.translate(0.5, 0.5)
    ctx.imageSmoothingEnabled = false

    const ctx2d = JSON.parse(this.getAttribute('context2d'))
    // console.log('ctx2d', ctx2d)
    for (const k in ctx2d) {
      // strokeStyle, lineWidth
      ctx[k] = ctx2d[k]
    }
    el.addEventListener('mousedown', this.handleMouseDown)
    el.addEventListener('mouseup', this.handleMouseUp)
    el.addEventListener('mousemove', this.handleMouseMove)
  }

  adoptedCallback() {}

  disconnectedCallback() {
    // console.log('disconnect sign')
    const el = this.shadowRoot.querySelector('#canvas')
    el.removeEventListener('mousedown', this.handleMouseDown)
    el.removeEventListener('mouseup', this.handleMouseUp)
    el.removeEventListener('mousemove', this.handleMouseMove)
  }

  handleMouseDown(event) {
    this.mouse.down = true
    this.mouse.move = false
    this.mouse.current = {
      x: event.offsetX,
      y: event.offsetY
    }
    const el = this.shadowRoot.querySelector('#canvas')
    const ctx = el.getContext('2d')
    ctx.clearRect(0, 0, el.width, el.height) // clear
    ctx.beginPath() // clear lines
    this.value = ''

    const { x, y } = this.currentMouse()
    ctx.moveTo(x, y)
  }

  handleMouseUp() {
    const el = this.shadowRoot.querySelector('#canvas')
    if (this.mouse.move) this.value = el.toDataURL('image/png')
    else this.value = ''

    const event = new CustomEvent('input', { detail: this.value })
    this.dispatchEvent(event)

    this.mouse.down = false
    this.mouse.move = false
  }

  handleMouseMove(event) {
    this.mouse.move = true
    this.mouse.current = {
      x: event.offsetX,
      y: event.offsetY
    }
    this.draw(event)
  }

  draw(event) {
    // requestAnimationFrame(this.draw)
    if (this.mouse.down) {
      const el = this.shadowRoot.querySelector('#canvas')
      // console.log('draw', event, el.width, el.height, c)
      // const c = document.getElementById('canvas')
      const ctx = el.getContext('2d')
      ctx.clearRect(0, 0, el.width, el.height)
      const { x, y } = this.currentMouse()
      ctx.lineTo(x, y)
      ctx.stroke()
    }
  }

  currentMouse() {
    return {
      x: this.mouse.current.x,
      y: this.mouse.current.y
    }
  }
}

customElements.define('vcxwc-sign-pad', SignPad)
