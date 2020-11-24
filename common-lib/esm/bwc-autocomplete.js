/*
attributes:
- value (via v-model)
- required

properties:
- items Array or String or Object

methods:
- setList(items) // should be private, called when items property changes

events emitted:
- @input (via v-model) - e.target.value
- @search - e.detail String
- @selected - e.detail String or Object or null

if selected data is null (no match found, else match found)

Usage with (VueJS):

<bwc-autocomplete required :items="ac.items" v-model="ac.value" @search="(e) => autoComplete(e)" @selected=></bwc-autocomplete>

const ac = reactive({
  value: 'a',
  items: ['aa9','aa5']
})

const autoComplete = (e) => {
  const list = ['aa1', 'aa15', 'aa16', 'aa17', 'aa18', 'aa19', 'aa20', 'aa21', 'aa22', 'aa23']
  const result = []
  for (let i = 0; i < list.length; i++) {
    if (list[i].includes(e.detail)) result.push(list[i])
  }
  ac.items = result
}

*/
const template = document.createElement('template')
template.innerHTML = `
<input class="input" type="text" id="ajax" list="json-datalist" placeholder="e.g. datalist" autocomplete="off">
<datalist id="json-datalist"></datalist>
`

class AutoComplete extends HTMLElement {
  // local properties
  #items = [] // private
  selectedItem = null // public

  constructor() {
    super()
    this.inputFn = this.inputFn.bind(this)
  }

  connectedCallback() {
    this.appendChild(template.content.cloneNode(true))

    const el = this.querySelector('input')
    el.addEventListener('input', this.inputFn)

    el.onblur = (e) => {
      const found = this.items.find(item => {
        return typeof item === 'string' ? item === this.value : item.key === this.value || item.text === this.value
      })
      if (!found) { // not found
        if (this.selectedItem) {
          // console.log('not found but is selected')
          this.selectedItem = null
          const evSelected = new CustomEvent('selected', { detail: this.selectedItem })
          this.dispatchEvent(evSelected)
        }
      } else {
        if (!this.selectedItem) {
          // console.log('found but not selected')
          this.selectedItem = found
          const evSelected = new CustomEvent('selected', { detail: this.selectedItem })
          this.dispatchEvent(evSelected)
        }
      }
    }

    el.value = this.value
    if (this.required !== null) el.setAttribute('required', '')
    this.setList(this.items)
  }

  disconnectedCallback() {
    const el = this.querySelector('input')
    el.removeEventListener('input', this.inputFn)
  }

  attributeChangedCallback(name, oldVal, newVal) {
    const el = this.querySelector('input')
    switch (name) {
      case 'value': {
        if (el) el.value = newVal
        const event = new CustomEvent('input', { detail: newVal })
        this.dispatchEvent(event)
        break
      }
      case 'required': {
        if (el) el.setAttribute('required', newVal)
        break
      }
    }
  }

  static get observedAttributes() {
    return ['value', 'required']
  }

  get value() {
    return this.getAttribute('value')
  }

  set value(val) {
    this.setAttribute('value', val)
  }

  get required() {
    return this.getAttribute('required')
  }

  set required(val) {
    this.setAttribute('required', val)
  }

  // properties
  get items() {
    return this.#items
  }

  set items(val) {
    console.log('set items', val.length)
    this.#items = val
    this.setList(val)
  }

  inputFn(e) { // whether clicked or typed
    // console.log('inputFn', e.target.value, this.items.length)
    const el = this.querySelector('input')
    const prevItem = this.selectedItem
    this.value = el.value

    const found = this.items.find(item => {
      return typeof item === 'string' ? item === this.value : item.key === this.value || item.text === this.value
    })
    if (!found) { // not found
      // console.log('emit search')
      this.selectedItem = null
      const evSearch = new CustomEvent('search', { detail: this.value })
      this.dispatchEvent(evSearch)
    } else {
      this.selectedItem = found
    }
    // console.log('emit selected?', prevItem !== this.selectedItem, this.selectedItem)
    if (prevItem !== this.selectedItem) {
      const evSelected = new CustomEvent('selected', { detail: this.selectedItem })
      this.dispatchEvent(evSelected)
    }
  }

  setList(_items) {
    console.log('items', _items, this.value)
    const dd = this.querySelector('datalist')
    if (!dd) return
    while(dd.firstChild) {
      dd.removeChild(dd.lastChild)
    }
    if (typeof _items !== 'object') return

    _items.forEach((item) => {
      const li = document.createElement('option')
      li.innerHTML = typeof item === 'string' ? item : item.key
      li.value = typeof item === 'string' ? item : item.text
      dd.appendChild(li)
    })
  }
}

customElements.define('bwc-autocomplete', AutoComplete)
