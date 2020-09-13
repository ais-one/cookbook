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
  disabled
  iconTrailing="keyboard_arrow_down"
></mwc-textfield>
<div class="drop-down-div">
  <mwc-list class="drop-down" multi>
  </mwc-list>
</div>
`

// :iconTrailing="recordObj[showForm + 'DdShow'][col] ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
// @click="recordObj[showForm + 'DdShow'][col]=!recordObj[showForm + 'DdShow'][col]"
// @selected="e => multiSelect(e, col, showForm)"
class MultiSelect extends HTMLElement {
  constructor () {
    super()
    this.root = this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))
  }

  connectedCallback () {
    this.listShow = false
    this.value = "aa,cc"
    this.list = [
      { key: 'aa', text: 'aa11'},
      { key: 'bb', text: 'bb22'},
      { key: 'cc', text: 'cc33'},
      { key: 'dd', text: 'dd44'},
      { key: 'ee', text: 'ee55'},
    ]
 
    if (!this.hasAttribute('value')) this.setAttribute('value', '')
    if (!this.hasAttribute('label')) this.setAttribute('label', '')

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
    }
  }
  static get observedAttributes() { return ['value', 'label'] }
  get value() { return this.getAttribute('value') }
  set value(val) { this.setAttribute('value', val) }
  get label() { return this.getAttribute('label') }
  set label(val) { this.setAttribute('label', val) }

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
    // console.log('blur', e)
    this.showList(false)
  }
  input (e) {
    // console.log('input', e)
  }
  focus (e) {
    // console.log('focus', e)
  }

  setList(items) {
    console.log('setList', items.length)
    this.list = []
    const dd = this.shadowRoot.querySelector('.drop-down')
    dd.innerHTML = ''
    items.forEach(item => {
      const li = document.createElement('mwc-check-list-item')
      li.innerHTML = item
      dd.appendChild(li)
      this.list.push(item)
    })
    this.showList(!!this.list.length)
  }
}

customElements.define('mwc-multiselect', MultiSelect)
