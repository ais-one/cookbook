// props: {
//   accept: { type: String, default: '*/*' },
//   value: { type: Object, required: true }
// },
const template = document.createElement('template')
template.innerHTML = `
<div>
  <input id="input-file" type="file" style="display: none" accept="text/csv" onclick="event.stopPropagation()" />
</div>
`

class FileUpload extends HTMLElement {
  constructor() {
    super()
    this.root = this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))
    this.click = this.click.bind(this)
    this.change = this.change.bind(this)
  }

  connectedCallback() {
    this.file = null

    if (!this.hasAttribute('value')) this.setAttribute('value', '')
    if (!this.hasAttribute('label')) this.setAttribute('label', '')

    this.shadowRoot.querySelector('div').addEventListener('click', this.click)
    this.shadowRoot.querySelector('#input-file').addEventListener('change', this.change)
  }

  disconnectedCallback() {
    this.shadowRoot.querySelector('div').removeEventListener('click', this.click)
    this.shadowRoot.querySelector('#input-file').removeEventListener('change', this.change)
  }

  attributeChangedCallback(name, oldVal, newVal) {
    const el = this.shadowRoot.querySelector('div')
    switch (name) {
      case 'value':
        el.value = newVal
        // const event = new CustomEvent('input', { detail: newVal })
        // this.dispatchEvent(event)
        break
      case 'label':
        el.setAttribute('label', newVal)
        break
    }
  }

  static get observedAttributes() { return ['value', 'label'] }

  get value() { return this.getAttribute('value') }
  set value(val) { this.setAttribute('value', val) }

  get label() { return this.getAttribute('label') }
  set label(val) { this.setAttribute('label', val) }

  selected(e) { }

  click(e) {
    console.log(e)
    const el = this.shadowRoot.querySelector('#input-file')
    el.click()
  }

  change(e) {
    const files = e.target.files
    console.log(files)
    if (files[0] !== undefined) {
      this.value = files[0].name
      this.file = files[0]
    } else {
    }
  }

  getFile() {
    return this.file
  }
}

customElements.define('bwc-fileupload', FileUpload)
