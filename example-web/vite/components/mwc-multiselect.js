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

class MultiSelect extends HTMLElement {
  constructor () {
    super()
    this.root = this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))

    this.click = this.click.bind(this)
    this.selected = this.selected.bind(this)
  }

  connectedCallback () {
    this.show = false
    this.list = []
 
    if (!this.hasAttribute('value')) this.setAttribute('value', '')
    if (!this.hasAttribute('label')) this.setAttribute('label', '')

    const el = this.shadowRoot.querySelector('mwc-textfield')
    el.addEventListener('click', this.click)
    el.addEventListener('input', this.input)
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
    el.removeEventListener('click', this.click)
    el.removeEventListener('input', this.input)
    const dd = this.shadowRoot.querySelector('.drop-down')
    dd.removeEventListener('selected', this.selected)
  }

  selected (e) {
    console.log('selected', e.detail.index, e.detail.index.size)
    const selects = []
    e.detail.index.forEach(item => {
      // console.log(this.list, item, this.list[item])
      selects.push(this.list[item]) // aa
    })
    console.log(selects)
    if (selects.length) {
      this.value = selects.join(',')
    } else {
      this.value = ''
    }
    const el = this.shadowRoot.querySelector('mwc-textfield')
    el.value = this.value

    // const event = new CustomEvent('input', { detail: this.value })
    // this.dispatchEvent(event)
  }

  showList (show) {
    this.show = show
    const dd = this.shadowRoot.querySelector('.drop-down-div')
    dd.style.display = this.show ? 'block' : 'none'
  }

  click (e) { // dropdown arrow
    if (this.list.length) {
      console.log('click', !this.show)
      this.showList(!this.show)
      const el = this.shadowRoot.querySelector('mwc-textfield')
      el.setAttribute('iconTrailing', this.show ? 'keyboard_arrow_up' : 'keyboard_arrow_down')
    }
  }

  input (e) {
    // console.log('input', e)
  }

  setList(items) {
    items = [
      { key: 'aa', text: 'aa11'},
      { key: 'bb', text: 'bb22'},
      { key: 'cc', text: 'cc33'},
      { key: 'dd', text: 'dd44'},
      { key: 'ee', text: 'ee55'},
    ]

    // console.log('setList', items.length)

    const el = this.shadowRoot.querySelector('mwc-textfield')
    if (!items.length) {
      el.removeAttribute('iconTrailing')
    } else {
      el.setAttribute('iconTrailing', 'keyboard_arrow_down')
    }
    this.show = false

    this.list = []
    const dd = this.shadowRoot.querySelector('.drop-down')
    dd.innerHTML = ''
    items.forEach(item => {
      const li = document.createElement('mwc-check-list-item')
      li.innerHTML = item.key
      if ( this.value.includes(item.key) ) li.setAttribute('selected', '')
      dd.appendChild(li)
      this.list.push(item.key) // aa
    })
  }
}

customElements.define('mwc-multiselect', MultiSelect)
