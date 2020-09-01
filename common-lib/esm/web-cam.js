const template = document.createElement('template')
template.innerHTML = `
<style>
body {
   background-color: #F0F0F0;
}
#app-not-in-use {
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
#video {
  background-color: #000000;
}
#canvas {
  display: none;
}
li {
  display: inline;
  padding: 5px;
}
</style>
<div>
  <div><video id="video" width="320" height="240" autoplay></video></div>
  <div><button id="snap">Snap Photo</button></div>
  <canvas id="canvas" width="320" height="240"></canvas>
  <ul>
    <li v-for="c in captures" :key="c">
      <img v-bind:src="c" height="50" alt="camera captures" />
    </li>
  </ul>
</div>
`

class WebCam extends HTMLElement {
  constructor() {
    super()
    const shadowRoot = this.attachShadow({mode: 'open'})
    shadowRoot.appendChild(template.content.cloneNode(true))

    this.capture = this.capture.bind(this) // bind callback function
    // canvas: {},
    // captures: []
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
    const buttonElm = this.shadowRoot.querySelector('#snap')
    buttonElm.addEventListener('click', this.capture)

    const videoEl = this.shadowRoot.querySelector('#video')
    /*
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      // console.log('xxxx', window.URL.createObjectURL)
      navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
        try {
          videoEl.srcObject = stream
        } catch (e) {
          videoEl.src = window.URL.createObjectURL(stream)
        }
        videoEl.play()
      })
    }
    */
  }

  attributeChangedCallback(name, oldVal, newVal) { // attribute changed
  }

  adoptedCallback() { // moved into a new document
  }

  disconnectedCallback() { // removed from the DOM
    const buttonElm = this.shadowRoot.querySelector('#snap')
    buttonElm.removeEventListener('click', this.capture)
  }

  capture() {
    console.log('capture event')
    const videoEl = this.shadowRoot.querySelector('#video')
    const canvasEl = this.shadowRoot.querySelector('#video')
    canvasEl.getContext('2d').drawImage(videoEl, 0, 0, 640, 480)
    // this.captures.push(canvasEl.toDataURL('image/png'))
  }
}

customElements.define('vcxwc-web-cam', WebCam)
