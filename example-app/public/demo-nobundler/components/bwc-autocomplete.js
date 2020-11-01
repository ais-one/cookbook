/*
Usage with (VueJS):

- :items: list items, string, comma seperated
- @search: emitted event for parent to handle
- v-model: text in box

<bwc-autocomplete required :items="items" v-model="ac" @search="(e) => autoComplete(e)"></bwc-autocomplete>

const autoComplete = (e) => {
  const result = []
  for (let i = 0; i < e.detail.length + 10; i++) result.push('aa' + i)
  items.value = result.join(',')
}

attributes:
- value (via v-model)
- required

properties:
- items

methods:
- setList

events:
- @input (via v-model)
- @search
- @selected

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
    // this.changeFn = this.changeFn.bind(this)
  }

  connectedCallback() {
    console.log('connected callback')
    this.appendChild(template.content.cloneNode(true))

    const el = this.querySelector('input')
    el.addEventListener('input', this.inputFn)

    el.onblur = (e) => {
      console.log('blurblur')
      const found = this.items.find(item => {
        return typeof item === 'string' ?
          item === this.value :
          item.key === this.value || item.text === this.value
      })
      if (!found) { // not found
        if (this.selectedItem) {
          console.log('not found but is selected')
          this.selectedItem = null
          const evSelected = new CustomEvent('selected', { detail: this.selectedItem })
          this.dispatchEvent(evSelected)
        }
      } else {
        if (!this.selectedItem) {
          console.log('found but not selected')
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
    console.log('inputFn', e.target.value, this.items.length, window.getComputedStyle(this.querySelector('datalist')).getPropertyValue('display'))
    const el = this.querySelector('input')
    const prevItem = this.selectedItem
    this.value = el.value

    const found = this.items.find(item => {
      return typeof item === 'string' ?
        item === this.value :
        item.key === this.value || item.text === this.value
    })
    if (!found) { // not found
      console.log('emit search')
      this.selectedItem = null
      const evSearch = new CustomEvent('search', { detail: this.value })
      this.dispatchEvent(evSearch)
    } else {
      this.selectedItem = found
    }
    console.log('emit selected?', prevItem !== this.selectedItem, this.selectedItem)
    if (prevItem !== this.selectedItem) {
      const evSelected = new CustomEvent('selected', { detail: this.selectedItem })
      this.dispatchEvent(evSelected)
    }
  }

  setList(_items) { // public
    console.log('items', _items, this.value)
    const dd = this.querySelector('datalist')
    if (!dd) return
    while(dd.firstChild) {
      dd.removeChild(dd.lastChild)
    }
    if (typeof _items !== 'object') return

    _items.forEach((item) => {
      const li = document.createElement('option')
      const val = typeof item === 'string' ? item : item.key
      li.innerHTML = typeof item === 'string' ? item : item.text
      li.value = val
      dd.appendChild(li)
    })
  }
}

customElements.define('bwc-autocomplete', AutoComplete)
