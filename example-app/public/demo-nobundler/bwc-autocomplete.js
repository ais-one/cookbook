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
*/

const template = document.createElement('template')
template.innerHTML = `
<input class="input" type="text" id="ajax" list="json-datalist" placeholder="e.g. datalist">
<datalist id="json-datalist"></datalist>
`

class AutoComplete extends HTMLElement {
  constructor() {
    super()
    this.input = this.input.bind(this)
  }

  connectedCallback() {
    console.log('connected callback')
    // console.log(this.value, this.required, typeof this.required)
    this.appendChild(template.content.cloneNode(true))

    this.list = []
    const el = this.querySelector('input')
    el.addEventListener('input', this.input)

    el.value = this.value
    if (this.required !== null) el.setAttribute('required', '')
    this.setList(this.items)
  }

  disconnectedCallback() {
    const el = this.querySelector('input')
    el.removeEventListener('input', this.input)
  }

  attributeChangedCallback(name, oldVal, newVal) {
    // console.log('attributeChangedCallback', name, oldVal, newVal, typeof newVal)
    const el = this.querySelector('input')
    const dd = this.querySelector('datalist')
    switch (name) {
      case 'value': {
        if (el) el.value = newVal
        const event = new CustomEvent('input', { detail: newVal })
        this.dispatchEvent(event)
        break
      }
      case 'items': {
        if (!dd) return
        this.setList(newVal)
        break
      }
      case 'required':
        if (el) el.setAttribute('required', newVal)
        break
    }
  }

  static get observedAttributes() {
    return ['value', 'required', 'items']
  }

  get value() {
    return this.getAttribute('value')
  }

  set value(val) {
    this.setAttribute('value', val)
  }

  get items() {
    return this.getAttribute('items')
  }

  set items(val) {
    this.setAttribute('items', val)
  }

  get required() {
    return this.getAttribute('required')
  }

  set required(val) {
    this.setAttribute('required', val)
  }

  input(e) {
    const el = this.querySelector('input')
    this.value = el.value
    if (!this.list.includes(this.value)) {
      const event = new CustomEvent('search', { detail: this.value })
      this.dispatchEvent(event)  
    }
  }

  setList(items) { // private
    const itema = items && items.split(',')
    if (!itema || !itema.length) return
    // console.log('setList', items.length, items)
    const dd = this.querySelector('datalist')
    this.list = []
    while(dd.firstChild) {
      dd.removeChild(dd.lastChild)
    }
    itema.forEach((item) => {
      const li = document.createElement('option')
      const val = typeof item === 'string' ? item : item.key
      li.innerHTML = val
      dd.appendChild(li)
      this.list.push(val)
    })
  }
}

customElements.define('bwc-autocomplete', AutoComplete)
