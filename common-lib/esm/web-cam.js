const template = document.createElement('template')
template.innerHTML = `
<style>
body {
   background-color: #F0F0F0;
}
.container{
  position: relative;
  width: 320px;
  height: 240px;
}
.container>.button2 {
  background: url('http://cdn1.iconfinder.com/data/icons/iconslandplayer/PNG/64x64/CircleBlue/Play1Pressed.png') center center no-repeat;
  height: 64px;
  left: 50%;
  margin: -32px 0 0 -32px;
  position: absolute;
  top: 50%;
  width: 64px;
  z-index: 1; 
}
.container>slot>.button {
  top: 5%;
  right: 5%;
  position: absolute;
  z-index: 1; 
}

::slotted(button) {
  top: 25%;
  right: 25%;
  position: absolute;
  z-index: 1; 
}

#video {
  background-color: #000000;
}


</style>
<div class="container">
  <video id="video" width="320" height="240" autoplay></video>
  <slot name="button-snap">
    <button class="button" id="snap">Take Photo</button>
  <slot>
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

    // this.element = shadowRoot.querySelector('div');
    // const slot = this.element.querySelector('slot');
    // // assign the rating star to a class variable, that the render class can duplicate them
    // this.slotNode = slot.querySelector('button');
    // slot.addEventListener('slotchange', event => {
    //     const node = slot.assignedNodes()[0];
    //     if (node) {
    //         // assign the new node to the slotNode and render the new stars
    //         this.slotNode = node;
    //         this.render();
    //     }
    // })
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
    // const canvasEl = this.shadowRoot.querySelector('#canvas')
    // canvasEl.getContext('2d').drawImage(videoEl, 0, 0, 640, 480)
    // this.captures.push(canvasEl.toDataURL('image/png'))
    const scale = 1
    const canvas = document.createElement("canvas")
    canvas.width = videoEl.clientWidth * scale
    canvas.height = videoEl.clientHeight * scale
    canvas.getContext('2d').drawImage(videoEl, 0, 0, canvas.width, canvas.height)

    videoEl.pause()
    // const image = new Image()
    // image.src = canvas.toDataURL();
    // return image;

    // console.log('videoEl', canvas.toDataURL('image/png'))

    // TDB emit event?
    // const event = new CustomEvent('click', {
    //   image: canvas.toDataURL('image/png')
    // })
    // this.dispatchEvent(event)

    // TBD use mwc-button
    // TBD add canvas / video option
  }
}

customElements.define('vcxwc-web-cam', WebCam)
