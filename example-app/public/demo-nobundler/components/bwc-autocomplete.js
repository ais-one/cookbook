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
- value
- required

properties:
- items

methods:
- setList

events:
- @search
- @input

*/
const template = document.createElement('template')
template.innerHTML = `
<input class="input" type="text" id="ajax" list="json-datalist" placeholder="e.g. datalist" autocomplete="off">
<datalist id="json-datalist"></datalist>
`

class AutoComplete extends HTMLElement {
  // properties
  #items = [] // private
  selectedItem = null // public

  constructor() {
    super()
    this.inputFn = this.inputFn.bind(this)
  }

  connectedCallback() {
    console.log('connected callback')
    this.appendChild(template.content.cloneNode(true))

    const el = this.querySelector('input')
    el.addEventListener('input', this.inputFn)
    el.value = this.value
    if (this.required !== null) el.setAttribute('required', '')
    this.setList(this.items)
  }

  disconnectedCallback() {
    const el = this.querySelector('input')
    el.removeEventListener('input', this.inputFn)
  }

  attributeChangedCallback(name, oldVal, newVal) {
    // console.log('attributeChangedCallback', name, oldVal, newVal, typeof newVal)
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
    console.log('inputFn', this.items.length)
    const el = this.querySelector('input')
    this.value = el.value
    const found = this.#items.find(item => {
      return typeof item === 'string' ?
        item === this.value :
        item.key === this.value || item.text === this.value
    })
    const evSearch = new CustomEvent('search', { detail: this.value })
    this.dispatchEvent(evSearch)  

    if (!found) { // not found
      console.log('not found')
      // this.selectedItem = null
    } else { // found match
      console.log('found', this.value, this.items.length)
      // this.selectedItem = found
    }
    // const evSelected = new CustomEvent('selected', { detail: this.selectedItem })
    // this.dispatchEvent(evSelected)
  }

  setList(_items) { // public
    console.log('items', _items, this.value)
    const dd = this.querySelector('datalist')
    if (!dd) return

    while(dd.firstChild) {
      dd.removeChild(dd.lastChild)
    }

    if (typeof _items !== 'object') return

    if (_items.length === 1) {
      const val = typeof _items[0] === 'string' ? _items[0] : _items[0].key
      if (val === this.value) return
    }

    _items.forEach((item) => {
      const li = document.createElement('option')
      const val = typeof item === 'string' ? item : item.key
      li.innerHTML = typeof item === 'string' ? item : item.text
      li.value = val
      dd.appendChild(li)
    })

    // custom
    // JS
    // const el = this.querySelector('input')
    // if (!el) return
    // el.onfocus = function () {
    //   dd.style.display = 'block';
    // }
    // el.onblur = function () {
    //   dd.style.display = 'block';
    //   console.log('dd blur')
    //   dd.style.display = 'none';
    // }
    // for (let option of dd.options) {
    //   option.onclick = function () {
    //     el.value = this.value;
    //     dd.style.display = 'none';
    //     console.log('aaaaaaaaaaaa')
    //   }
    // }
    // dd.style.width = input.offsetWidth + 'px';
    // dd.style.left = input.offsetLeft + 'px';
    // dd.style.top = input.offsetTop + input.offsetHeight + 'px';
    //
    // CSS
    // datalist {
    //   position: absolute;
    //   background-color: lightgrey;
    //   font-family: sans-serif;
    //   font-size: 0.8rem;
    // }
    // option {
    //   background-color: #bbb;
    //   padding: 4px;
    //   margin-bottom: 1px;
    //   cursor: pointer;
    // }
  }
}

customElements.define('bwc-autocomplete', AutoComplete)
