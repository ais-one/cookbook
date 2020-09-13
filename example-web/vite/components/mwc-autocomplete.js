// import '@material/mwc-textfield'
const template = document.createElement('template')
template.innerHTML = `
<style>
.field-item {
  padding-top: 8px;
  padding-bottom: 8px;
}
.drop-down-div {
  height: 150px;
  display: none;
}
.drop-down {
  height:150px;overflow-y:scroll;
}
</style>
<mwc-textfield
  class="field-item"
  outlined
  type="text"
></mwc-textfield>
<div class="drop-down-div">
  <mwc-list class="drop-down">
  </mwc-list>
</div>
`

class AutoComplete extends HTMLElement {
  constructor () {
    super()
    this.root = this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))

    this.input = this.input.bind(this)
    this.blur = this.blur.bind(this)
    this.focus = this.focus.bind(this)
    this.selected = this.selected.bind(this)
  }

  showList (show) {
    console.log('showList', show)
    this.show = show
    const dd = this.shadowRoot.querySelector('.drop-down-div')
    dd.style.display = this.show ? 'block' : 'none'
  }

  connectedCallback () {
    this.show = false
    this.list = []
 
    if (!this.hasAttribute('value')) this.setAttribute('value', '')
    if (!this.hasAttribute('label')) this.setAttribute('label', '')
    // if (!this.hasAttribute('required')) this.setAttribute('required', '')

    const el = this.shadowRoot.querySelector('mwc-textfield')
    el.addEventListener('input', this.input)
    el.addEventListener('blur', this.blur)
    el.addEventListener('focus', this.focus)
    el.value = this.getAttribute('value')
    const dd = this.shadowRoot.querySelector('.drop-down')
    dd.addEventListener('selected', this.selected)
  }

  attributeChangedCallback(name, oldVal, newVal) { // attribute changed
    const el = this.shadowRoot.querySelector('mwc-textfield')
    switch (name) {
      case 'value':
        el.value = newVal
        const event = new CustomEvent('input', { detail: newVal })
        this.dispatchEvent(event)
        break;
      case 'label':
        el.setAttribute('label', newVal)
        break;
      case 'required':
        console.log('required', newVal)
        el.setAttribute('required', newVal)
        break;
    }
  }
  static get observedAttributes() { return ['value', 'label', 'required'] }
  get value() { return this.getAttribute('value') }
  set value(val) { this.setAttribute('value', val) }
  get label() { return this.getAttribute('label') }
  set label(val) { this.setAttribute('label', val) }
  get required() { return this.getAttribute('required') }
  set required(val) { this.setAttribute('required', val) }

  disconnectedCallback() { // removed from the DOM
    const el = this.shadowRoot.querySelector('mwc-textfield')
    el.removeEventListener('input', this.input)
    el.removeEventListener('blur', this.blur)
    el.removeEventListener('focus', this.focus)
    const dd = this.shadowRoot.querySelector('.drop-down')
    dd.removeEventListener('selected', this.selected)
  }
  selected (e) {
    console.log('selected', e)
    if (e.detail.index == -1) return

    this.value = this.list[e.detail.index]
    this.showList(false)

    const event = new CustomEvent('input', { detail: this.value })
    this.dispatchEvent(event)
  }
  blur (e) {
    console.log('blur', e)
    // this.showList(false)
  }
  input (e) {
    console.log('input', e)
    const el = this.shadowRoot.querySelector('mwc-textfield')
    this.value = el.value
    const event = new CustomEvent('search', { detail: this.value })
    this.dispatchEvent(event)
  }
  focus (e) {
    console.log('focus', e)
  }
  hello () {
    console.log('hello autocomplete', this.value)
  }
  setList(items) {
    console.log('setList', items.length)
    this.list = []
    const dd = this.shadowRoot.querySelector('.drop-down')
    dd.innerHTML = ''
    items.forEach(item => {
      const li = document.createElement('mwc-list-item')
      const val = typeof item === 'string' ? item : item.key
      li.innerHTML = val
      dd.appendChild(li)
      this.list.push(val)
    })
    this.showList(!!this.list.length)
  }
}

customElements.define('mwc-autocomplete', AutoComplete)
  