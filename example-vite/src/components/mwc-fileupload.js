// props: {
//   accept: { type: String, default: '*/*' },
//   value: { type: Object, required: true }
// },
/*
data () {
  return {
    savedUrl: '',
    imageName: '',
    imageUrl: '',
    imageFile: ''
  }
},

resetData () {
  this.imageName = ''
  this.imageFile = ''
  this.imageUrl = ''
  this.$emit('input', {
    savedUrl: this.value.savedUrl,
    imageName: this.imageName,
    imageUrl: this.imageUrl,
    imageFile: this.imageFile
  })
},
*/
const template = document.createElement('template')
template.innerHTML = `
<mwc-textfield
  id="text-field"
  disabled
>
  <input id="input-file" type="file" style="display: none" accept="csv/csv" onclick="event.stopPropagation()" />
</mwc-textfield>
`

class FileUpload extends HTMLElement {
  constructor() {
    super()
    this.root = this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))

    this.click = this.click.bind(this)
    this.change = this.change.bind(this)
    // this.selected = this.selected.bind(this)
  }

  connectedCallback() {
    this.file = null

    if (!this.hasAttribute('value')) this.setAttribute('value', '')
    if (!this.hasAttribute('label')) this.setAttribute('label', '')

    this.shadowRoot.querySelector('mwc-textfield').addEventListener('click', this.click)
    this.shadowRoot.querySelector('#input-file').addEventListener('change', this.change)
    // el.addEventListener('input', this.input)
    // el.value = this.getAttribute('value')
  }

  disconnectedCallback() {
    this.shadowRoot.querySelector('mwc-textfield').removeEventListener('click', this.click)
    this.shadowRoot.querySelector('#input-file').removeEventListener('change', this.change)
    // el.removeEventListener('input', this.input)
  }

  attributeChangedCallback(name, oldVal, newVal) {
    const el = this.shadowRoot.querySelector('mwc-textfield')
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

  static get observedAttributes() {
    return ['value', 'label']
  }

  get value() {
    return this.getAttribute('value')
  }

  set value(val) {
    this.setAttribute('value', val)
  }

  get label() {
    return this.getAttribute('label')
  }

  set label(val) {
    this.setAttribute('label', val)
  }

  selected(e) {
    // console.log('selected', e.detail.index, e.detail.index.size)
    // const selects = []
    // e.detail.index.forEach(item => {
    //   // console.log(this.list, item, this.list[item])
    //   selects.push(this.list[item]) // aa
    // })
    // console.log(selects)
    // if (selects.length) {
    //   this.value = selects.join(',')
    // } else {
    //   this.value = ''
    // }
    // const el = this.shadowRoot.querySelector('mwc-textfield')
    // el.value = this.value
    // const event = new CustomEvent('input', { detail: this.value })
    // this.dispatchEvent(event)
  }

  click(e) {
    console.log(e)
    const el = this.shadowRoot.querySelector('#input-file')
    // pickFile () { this.$refs.image.click() },
    el.click()
  }

  change(e) {
    const files = e.target.files
    console.log(files)

    if (files[0] !== undefined) {
      this.value = files[0].name

      this.file = files[0]
      // this.imageName = files[0].name
      // if (this.imageName.lastIndexOf('.') <= 0) {
      //   return
      // }
      // const fr = new FileReader()
      // fr.readAsDataURL(files[0])
      // fr.addEventListener('load', () => {
      //   this.imageUrl = fr.result
      //   this.imageFile = files[0] // this is an image file that can be sent to server...
      //   // console.log('uploading', this.imageUrl, this.imageFile)
      //   this.$emit('input', {
      //     savedUrl: this.value.savedUrl,
      //     imageName: this.imageName,
      //     imageUrl: this.imageUrl,
      //     imageFile: this.imageFile
      //   })
      // })
    } else {
      // this.resetData()
    }
  }

  getFile() {
    return this.file
  }
}

customElements.define('mwc-fileupload', FileUpload)
