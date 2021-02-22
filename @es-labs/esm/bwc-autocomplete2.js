/*
Autocomplete component using input and datalist.
Only able to handle single selection due to nature of datalist not able to have click event

V2 Improvements
- multiple selects (repeat, or allow same items to be selected)
- act as fixed select...?

attributes:
- value (via v-model), at the text input
- required
- disabled
- listid (needed if using more than 2 components on the same page)
- input-class (style the input)
- multiple (v2)
- repeat (v2) for multiple selects allow same time to be selected many times
- allow-custom-tag (v2) - accept user defined tags
- object-key
- object-text

properties:
- items [string] or [{ key, text }]
- tags [string] or [{ key, text }]

methods:
- setList(items) // should be private, called when items property changes
- setTags(tags) // should be private, called with tags property changes

events emitted:
- @input (via v-model) - e.target.value
- @search - e.detail String
- @selected - e.detail String or Object or null

if selected data is null (no match found, else match found)

Usage with (VueJS):

<bwc-autocomplete2 required :items="ac.items" v-model="ac.value" @search="(e) => autoComplete(e)" @selected=></bwc-autocomplete2>

// string version
const ac = reactive({ value: 'a', items: ['aa9','aa5'] })

const autoComplete = (e) => {
  const list = ['aa1', 'aa15', 'aa16', 'aa17', 'aa18', 'aa19', 'aa20', 'aa21', 'aa22', 'aa23']
  const result = []
  for (let i = 0; i < list.length; i++) {
    if (list[i].includes(e.detail)) result.push(list[i])
  }
  ac.items = result
}

// object version
[
  { key: 'unique', text: 'longer description' }
]

*/
// TBD Initially if no data for the list, please fetch some
// TBD allow configurable classnames for tag and tag wrapper
// TBD single select clear value if not found and custom tags not allowed
// TBD use ul/li instead of datalist (big change)

const template = document.createElement('template')
template.innerHTML = /*html*/`
<input type="text" list="json-datalist" placeholder="search..." autocomplete="off">
<datalist id="json-datalist"></datalist>
`

class BwcAutocomplete extends HTMLElement {
  // local properties
  #items = [] // list of items
  #tags = [] // multiple selected
  #selectedItem = null // single selected
  #key = '' // must have both, other wise string is assumed?
  #text = ''

  #elTags = null // div.tags element
  #elInput = null // input element
  #elList = null // datalist element

  #multiple = false // hold readonly attributes
  #repeat = false // for multiselect, tag can be added multiple times
  #allowCustomTag = false // can add new items

  constructor() {
    super()
    this.inputFn = this.inputFn.bind(this)
  }

  isStringType() { // is list item and selected values string ?
    // console.log('isStringType', !(this.#key && this.#text))
    return !(this.#key && this.#text)
  }

  addTag(item) {
    const itemExists = this.#tags.find(tag => this.isStringType() ? tag === item : (tag[this.#key] === item[this.#key] && tag[this.#text] === item[this.#text]))
    if (!this.#repeat && itemExists) return // duplicates not allowed

    const span = document.createElement('span')
    span.className = 'tag is-black'
    span.innerText = this.isStringType() ? item : item[this.#text]
    span.value = this.isStringType() ? item : item[this.#key]
    span.onclick = (e) => { // e.target.innerText, e.target.value
      this.removeTag(span)
      this.updateTags()
    }
    this.#elTags.appendChild(span)
    this.updateTags()
  }

  updateTags() {
    let tags = [...this.#elTags.children]
    this.#tags = tags.map(tag => this.isStringType() ? tag.innerText : ({ [this.#key]: tag.value, [this.#text]: tag.innerText }))
    this.dispatchEvent(new CustomEvent('selected', { detail: this.#tags }))
  }

  removeTag(span) {
    this.#elTags.removeChild(span)
  }

  connectedCallback() {
    this.appendChild(template.content.cloneNode(true))

    this.#elInput = this.querySelector('input')
    this.#elList = this.querySelector('datalist')

    // console.log('listid', this.listid)
    this.#elList.id = this.listid
    this.#elInput.setAttribute('list', this.listid)

    this.#elInput.addEventListener('input', this.inputFn)
    // if (this.hasAttribute('input-class')) el.setAttribute('class', this.getAttribute('input-class'))

    this.#allowCustomTag = this.hasAttribute('allow-custom-tag')
    this.#multiple = this.hasAttribute('multiple')
    this.#repeat = this.hasAttribute('repeat')

    if (this.hasAttribute('object-key')) this.#key = this.getAttribute('object-key')
    if (this.hasAttribute('object-text')) this.#text = this.getAttribute('object-text')
    if (this.#multiple) { // if multiple... use tags
      this.#elTags = document.createElement('div')
      this.#elTags.className = 'tags'
      this.prepend(this.#elTags)
    }

    this.#elInput.onblur = (e) => {
      // console.log('onblur', e)
      const found = this.items.find(item => this.isStringType() ? item === this.value : item[this.#key] === this.value || item[this.#text] === this.value)
      if (this.#multiple) {
        // multiple
        if (!found) { // not found
          if (this.#allowCustomTag) { // can add new
            // TBD if all spaces only... return
            this.addTag(this.isStringType() ? this.value : { [this.#key]: this.value, [this.#text]: this.value })
          }
          this.value = ''
        } else {
          // if repeatable?
          // set tags list if not there already
          this.addTag(found)
          this.value = ''
        }
      } else {
        // single
        if (!found) { // not found
          if (this.#selectedItem) {
            // console.log('not found but is selected')
            this.#selectedItem = null
            this.dispatchEvent(new CustomEvent('selected', { detail: this.#selectedItem }))
          }
        } else {
          if (!this.#selectedItem) {
            // console.log('found but not selected')
            this.#selectedItem = found
            this.dispatchEvent(new CustomEvent('selected', { detail: this.#selectedItem }))
          }
        }
      }
    }

    // console.log('setup stuff', this.required, this.disabled, this.inputClass)
    this.#elInput.value = this.value

    this.#elInput.className = this.inputClass || 'input' // default to bulma?

    if (this.required) this.#elInput.setAttribute('required', '')
    else this.#elInput.removeAttribute('required')
    if (this.disabled) this.#elInput.setAttribute('disabled', '')
    else this.#elInput.removeAttribute('disabled')

    this.setList(this.items)
  }

  disconnectedCallback() {
    this.#elInput.removeEventListener('input', this.inputFn)
  }

  attributeChangedCallback(name, oldVal, newVal) {
    const el = this.#elInput
    switch (name) {
      case 'value': {
        // if (!this.#multiple && el) el.value = newVal
        if (el) el.value = newVal
        this.dispatchEvent(new CustomEvent('input', { detail: newVal }))
        break
      }
      case 'required': {
        el && el.setAttribute('required', '')
        break
      }
      case 'disabled': {
        el && el.setAttribute('disabled', '')
        break
      }
      case 'input-class': {
        if (el) el.className = newVal
        break
      }
      default:
        break
    }
  }

  static get observedAttributes() {
    return ['value', 'required', 'listid', 'disabled', 'input-class']
  }

  get value() { return this.getAttribute('value') }
  set value(val) { this.setAttribute('value', val) }

  get required() { return this.hasAttribute('required') }
  set required(val) {
    if (val) {
      this.setAttribute('required', '')
    } else {
      this.removeAttribute('required')
    }
  }

  get listid() { return this.getAttribute('listid') }
  set listid(val) { this.setAttribute('listid', val) }

  get disabled() { return this.hasAttribute('disabled') }
  set disabled(val) {
    if (val) {
      this.setAttribute('disabled', '')
    } else {
      this.removeAttribute('disabled')
    }
  }

  get inputClass() { return this.getAttribute('input-class') }
  set inputClass(val) { this.setAttribute('input-class', val) }

  // properties
  get items() {
    return this.#items
  }
  set items(val) {
    // console.log('set items', val.length)
    this.#items = val
    this.setList(val)
  }

  get tags() {
    return this.#tags
  }
  set tags(val) {
    // console.log('set tags', val)
    this.#elTags.innerHTML = ''
    this.setTags(val) // this.#tags will be set in setTags()
  }

  inputFn(e) { // whether clicked or typed
    // console.log('inputFn', e.target.value, this.items.length)
    const prevItem = this.#selectedItem
    this.value = this.#elInput.value

    const found = this.items.find(item => {
      return typeof item === 'string' ? item === this.value : item.key === this.value || item.text === this.value
    })
    if (!found) { // not found
      this.#selectedItem = null
      this.dispatchEvent(new CustomEvent('search', { detail: this.value }))
    } else {
      this.#selectedItem = found
    }
    // console.log('emit selected?', prevItem !== this.#selectedItem, this.#selectedItem)
    if (prevItem !== this.#selectedItem) {
      this.dispatchEvent(new CustomEvent('selected', { detail: this.#selectedItem }))
    }
  }

  setTags(_tags) {
    _tags.forEach(tag => this.addTag(tag))
  }

  setList(_items) { // set list items
    // console.log('items', _items, this.value)
    const dd = this.#elList
    if (!dd) return
    while(dd.firstChild) {
      dd.removeChild(dd.lastChild)
    }
    if (typeof _items !== 'object') return

    _items.forEach((item) => {
      const li = document.createElement('option')
      li.innerHTML = typeof item === 'string' ? item : item[this.#key]
      li.value = typeof item === 'string' ? item : item[this.#text]
      // li.onmousedown // useless with datalist & listid...
      dd.appendChild(li)
    })
  }
}

customElements.define('bwc-autocomplete2', BwcAutocomplete)
