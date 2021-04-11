// Combobox with autocomplete component using input, datalist and tags
// TBD fix multi select init in bwc-t4t-form.js
// TBD Initially if no data for the list, please fetch some
// TBD allow configurable classnames for tag and tag wrapper, clear icons (for bootstrap, muicss)
// TBD single select clear value if not found and custom tags not allowed
// TBD use ul/li instead of datalist (big change)
// OR https://stackoverflow.com/questions/30022728/perform-action-when-clicking-html5-datalist-option

/*
attributes:
- value (via v-model), at the text input
- required
- disabled
- listid (needed if using more than 2 components on the same page)
- input-class (style the input)
- multiple (v2)
- repeat (v2) for multiple selects allow same item to be selected many times
- allow-custom-tag (v2) - allow user defined tags
- object-key
- object-text
- tag-limit - maximum allowed tags

properties:
- items [string] or [{ key, text }]
- tags [string] or [{ key, text }]

methods:
- _setList(items) // should be private, called when items property changes
- _setTags(tags) // should be private, called with tags property changes

events emitted:
- @input (via v-model) - e.target.value
- @search - e.detail String
- @select - e.detail String or Object or null

if selected data is null (no match found, else match found)

Usage with (VueJS):

<bwc-combobox required :items="ac.items" v-model="ac.value" @search="(e) => autoComplete(e)" @select="(e) => selectItem"></bwc-combobox>

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

const template = document.createElement('template')
template.innerHTML = /*html*/`
<input type="text" list="json-datalist" placeholder="search..." autocomplete="off">
<span class="icon is-small is-left clear-btn" style="pointer-events: all; cursor:pointer;">
  <i class="fas fa-times"></i>
</span>
<datalist id="json-datalist"></datalist>
`

class BwcCombobox extends HTMLElement {
  // local properties
  #items = [] // list of items
  #tags = [] // multi-select
  #selected = null // single-select
  #key = '' // must have both, other wise string is assumed?
  #text = ''

  #elTags = null // div.tags element
  #elInput = null // input element
  #elList = null // datalist element
  #elClearBtn = null // clear button

  #multiple = false // hold readonly attributes
  #repeat = false // for multiselect, tag can be added multiple times
  #allowCustomTag = false // can add new items
  #tagLimit = 0 // unlimited tags

  constructor() {
    super()
    this._onInput = this._onInput.bind(this)
  }

  connectedCallback() {
    this.appendChild(template.content.cloneNode(true))

    this.#elInput = this.querySelector('input')
    this.#elList = this.querySelector('datalist')
    this.#elClearBtn = this.querySelector('.clear-btn')
    
    this.#elList.id = this.listid // console.log('listid', this.listid)
    this.#elInput.setAttribute('list', this.listid)
    this.#elInput.addEventListener('input', this._onInput)

    this.#allowCustomTag = this.hasAttribute('allow-custom-tag')
    this.#multiple = this.hasAttribute('multiple')
    this.#repeat = this.hasAttribute('repeat')

    if (this.hasAttribute('tag-limit')) this.#tagLimit = Number(this.getAttribute('tag-limit'))
    if (this.hasAttribute('object-key')) this.#key = this.getAttribute('object-key')
    if (this.hasAttribute('object-text')) this.#text = this.getAttribute('object-text')

    if (this.#multiple) { // if multiple... use tags
      this.#elTags = document.createElement('div')
      this.#elTags.className = 'tags'
      // this.prepend(this.#elTags)
      this.append(this.#elTags)
    }

    this.#elClearBtn.onclick = (e) => {
      this.#elInput.value = ''
      if (!this.#multiple) {
        // console.log('clear button click')
        this.#selected = null
        this.dispatchEvent(new CustomEvent('select', { detail: this.#selected }))
      }
    }
    this.#elInput.onblur = (e) => {
      // console.log('onblur', e)
      const found = this.items.find(item => this._itemMatchInput(item))
      if (this.#multiple) {
        // multiple
        if (!found) { // not found
          if (this.#allowCustomTag) { // can add new
            this._addTag(this._makeItemFromValue())
            this.dispatchEvent(new CustomEvent('select', { detail: this.#tags }))
          }
        } else {
          // if repeatable? set tags list if not there already
          this._addTag(found)
          this.dispatchEvent(new CustomEvent('select', { detail: this.#tags }))
        }
        this.value = ''
      } else {
        // single
        if (!found) { // not found
          if (this.#selected) {
            console.log('onBlur - single select - not found and this.#selected truthy')
            this.#selected = null
            this.dispatchEvent(new CustomEvent('select', { detail: this.#selected }))
          }
        } else {
          if (!this.#selected) {
            console.log('onBlur - single select - found and this.#selected falsy')
            this.#selected = found
            this.dispatchEvent(new CustomEvent('select', { detail: this.#selected }))
          }
        }
      }
    }

    // console.log('combo box connected', this.required, this.disabled, this.inputClass)
    this.#elInput.value = this.value
    this.#elInput.className = this.inputClass || 'input' // default to bulma - // if (this.hasAttribute('input-class')) el.setAttribute('class', this.getAttribute('input-class'))
    this.required ? this.#elInput.setAttribute('required', '') : this.#elInput.removeAttribute('required')
    this.disabled ? this.#elInput.setAttribute('disabled', '') : this.#elInput.removeAttribute('disabled')
    this._setList(this.items)

    this.dispatchEvent(new CustomEvent('load'))
  }

  disconnectedCallback() {
    this.#elInput.removeEventListener('input', this._onInput)
  }

  attributeChangedCallback(name, oldVal, newVal) {
    const el = this.#elInput
    switch (name) {
      case 'value': {
        if (el) el.value = newVal // v-model affects this
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
  set required(val) { val ? this.setAttribute('required', '') : this.removeAttribute('required') }

  get listid() { return this.getAttribute('listid') }
  set listid(val) { this.setAttribute('listid', val) }

  get disabled() { return this.hasAttribute('disabled') }
  set disabled(val) { val ? this.setAttribute('disabled', '') : this.removeAttribute('disabled') }

  get inputClass() { return this.getAttribute('input-class') }
  set inputClass(val) { this.setAttribute('input-class', val) }

  // properties
  get items() { return this.#items }
  set items(val) {
    // console.log('set items', val.length)
    this.#items = val
    this._setList(val)
  }

  // multi-select
  get tags() { return this.#tags }
  set tags(val) { this._setTags(val) } // this.#tags will be set in _setTags()

  // single-select
  get selected() { return this.#selected }
  set selected(val) { this.#selected = val } // TBD set it correctly

  _isStringType() { // is list item and selected values string ?
    return !(this.#key && this.#text) // console.log('_isStringType', !(this.#key && this.#text))
  }
  _itemMatchInput(item) { // item match to text input
    return this._isStringType() ? item === this.value : item[this.#key] === this.value || item[this.#text] === this.value
  }
  _matchItems(item1, item2) { //  item match to another item
    if (item1 === null && item2 === null) return true
    else if (item1 === null) return false
    else if (item2 === null) return false
    return this._isStringType() ? item1 === item2 : item1[this.#key] === item2[this.#key] || item1[this.#text] === item2[this.#text]
  }
  _makeItemFromValue () {
    // TBD if all spaces only... return? trim white spaces?
    return this._isStringType() ? this.value : { [this.#key]: this.value, [this.#text]: this.value }    
  }

  _tagLimitReached() {
    return this.#tagLimit && this.#elTags.children.length >= this.#tagLimit
  }
  _addTag(item) {
    if (this._tagLimitReached()) return
    const itemExists = this.#tags.find(tag => this._isStringType() ? tag === item : (tag[this.#key] === item[this.#key] && tag[this.#text] === item[this.#text]))
    if (!this.#repeat && itemExists) return // duplicates not allowed
    const span = document.createElement('span')
    span.className = 'tag is-black'
    span.innerText = this._isStringType() ? item : item[this.#text]
    span.value = this._isStringType() ? item : item[this.#key]
    span.onclick = (e) => { // e.target.innerText, e.target.value
      this._removeTag(span)
      this.dispatchEvent(new CustomEvent('select', { detail: this.#tags }))
    }
    this.#elTags.appendChild(span)
    this._updateTags()
    if (this._tagLimitReached()) this.#elInput.setAttribute('disabled', '')
  }
  _updateTags() {
    let tags = [...this.#elTags.children]
    this.#tags = tags.map(tag => this._isStringType() ? tag.innerText : ({ [this.#key]: tag.value, [this.#text]: tag.innerText }))
    // console.log('_updateTags', this.#tags)
  }
  _removeTag(span) {
    this.#elTags.removeChild(span)
    this._updateTags()
    if (!this._tagLimitReached() && !this.disabled) this.#elInput.removeAttribute('disabled')    
  }

  _onInput(e) { // whether clicked or typed
    // console.log('_onInput', e.target.value, this.items.length)
    const prevItem = this.#selected
    this.value = this.#elInput.value

    const found = this.items.find(item => this._itemMatchInput(item))
    if (!found) { // not found
      this.#selected = null
      this.dispatchEvent(new CustomEvent('search', { detail: this.value }))
    } else {
      this.#selected = found
    }
    if (!this._matchItems(prevItem, this.#selected) && !this.#multiple) {
      console.log('_onInput - selected && provItem not match this.#selected')
      if (!this.#selected && this.allowCustomTag) {
        this.#selected = this._makeItemFromValue()
      }
      this.dispatchEvent(new CustomEvent('select', { detail: this.#selected }))
    }
  }

  _setTags(_tags) {
    // console.log('_setTags', _tags, this.#elTags)
    if (!this.#elTags) return
    this.#elTags.innerHTML = ''
    this.#tags = []
    _tags.forEach(tag => this._addTag(tag))
    this.dispatchEvent(new CustomEvent('select', { detail: this.#tags }))
  }

  _setList(_items) { // set list items
    // console.log('items', _items, this.value)
    const dd = this.#elList
    if (!dd) return
    while(dd.firstChild) {
      dd.removeChild(dd.lastChild)
    }
    if (typeof _items !== 'object') return

    // EVENT TEST START
    // dd.style.pointerEvents = 'all'
    // dd.style.cursor = 'pointer'
    // dd.onclick = (e) => console.log('whwhwhwh22a')
    // dd.onmousedown = (e) => console.log('whwhwhwh22b')
    // EVENT TEST END
    _items.forEach((item) => {
      const li = document.createElement('option')
      li.innerHTML = typeof item === 'string' ? item : item[this.#key]
      li.value = typeof item === 'string' ? item : item[this.#text]
      // EVENT TEST START
      // li.style.pointerEvents = 'all'
      // li.style.cursor = 'pointer'
      // li.onclick = (e) => console.log('whwhwhwha')
      // li.onmousedown = (e) => console.log('whwhwhwhb')
      // li.addEventListener('click', (e) => console.log('whwhwhwh'), true)
      // li.onmousedown // useless on a datalist with listid...
      // EVENT TEST END
      dd.appendChild(li)
    })
  }
}

customElements.define('bwc-combobox', BwcCombobox)
