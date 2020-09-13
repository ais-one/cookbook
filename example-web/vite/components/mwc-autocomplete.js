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
}
.drop-down {
  height:150px;overflow-y:scroll;
}
</style>
<mwc-textfield
  required
  class="field-item"
  label="Label"
  outlined
  type="text"
></mwc-textfield>
<div class="drop-down-div">
<mwc-list class="drop-down">
</mwc-list>
</div>
`
/*
  @input="(e) => autoComplete(e, col, showForm)"
  @blur="(e) => console.log('blur', e)"
  @focus="(e) => console.log('focus', e)"
  <mwc-list-item>{{ option.text }}</mwc-list-item>
*/
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
    this.listShow = show
    const dd = this.shadowRoot.querySelector('.drop-down')
    dd.style.display = this.listShow ? 'block' : 'none'
  }

  connectedCallback () {
    // this.listShow = false
    // this.list = []
    this.listShow = true
    this.list = ['aaa', 'bbb']

    if (!this.hasAttribute('value')) this.setAttribute('value', '')

    const el = this.shadowRoot.querySelector('mwc-textfield')
    el.addEventListener('input', this.input)
    el.addEventListener('blur', this.blur)
    el.addEventListener('focus', this.focus)
    el.value = this.getAttribute('value')
    const dd = this.shadowRoot.querySelector('.drop-down')
    dd.addEventListener('selected', this.selected)

    // this.showList(this.listShow)
    // this.list.forEach(item => {
    //   const li = document.createElement('mwc-list-item')
    //   li.innerHTML = item
    //   dd.appendChild(li)
    // })
  }

  attributeChangedCallback(name, oldVal, newVal) { // attribute changed
    switch (name) {
      case 'value': // set canvas height
        const el = this.shadowRoot.querySelector('mwc-textfield')
        el.value = newVal
        const event = new CustomEvent('input', { detail: newVal })
        this.dispatchEvent(event)
        break;
    }
  }
  static get observedAttributes() { return ['value'] }
  get value() { return this.getAttribute('value') }
  set value(val) { this.setAttribute('value', val) }

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
    this.value = this.list[e.detail.index]
    this.showList(false)
    // e => autoCompleteSelect(e, col, showForm)

    const event = new CustomEvent('input', { detail: this.value })
    this.dispatchEvent(event)
  }
  blur (e) {
    // console.log('blur', e)
  }
  input (e) {
    const el = this.shadowRoot.querySelector('mwc-textfield')
    this.value = el.value
    const event = new CustomEvent('search', { detail: this.value })
    this.dispatchEvent(event)
  }
  focus (e) {
    // console.log('focus', e)
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
      li.innerHTML = item
      dd.appendChild(li)

      this.list.push(item)
    })

    this.showList(!!this.list.length)
  }
}

customElements.define('mwc-autocomplete', AutoComplete)
  