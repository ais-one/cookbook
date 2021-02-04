/*
<bwc-multiselect id="queues" placeholder="Select Queue">
  <li value="1">Queue One</li>
  <li value="2">Queue Two</li>
</bwc-multiselect>

<bwc-multiselect id="queues" placeholder="Select Queue" :items="queueItems"></bwc-multiselect>

Attributes
Properties
Methods
*/

const template = document.createElement('template')
template.innerHTML = /*html*/`
<style>
.caret {
  display: inline-block;
  width: 0;
  height: 0;
  /*margin-left: 2px;*/
  margin-left: 0;
  vertical-align: middle;
  border-top-color: #000 !important;
  border-top: 4px dashed;
  border-top: 4px solid;
  border-right: 4px solid transparent;
  border-left: 4px solid transparent;

  /* Position to right of container */
  position: absolute;
  top: .75em;
  right: .5em;
}

.multiselect {
  position: relative;
  box-sizing: border-box;
  display: inline-block;
  width: 20em;
}

.multiselect-field {
  overflow: hidden;
  padding: .2em .2em 0 .2em;
  border: 1px solid #adadad;
  border-radius: .2em;
  cursor: pointer;
  -webkit-user-select: none;
  user-select: none;
}

.multiselect-field-placeholder {
  padding: .25em .5em;
  margin-bottom: .2em;
  color: #888;
  line-height: 1;
}

.multiselect-tag {
  position: relative;
  display: inline-block;
  padding: .25em 1.5em .25em .5em;
  border: 1px solid #bdbdbd;
  border-radius: .2em;
  margin: 0 .2em .2em 0;
  line-height: 1;
  vertical-align: middle;
}

.multiselect-tag:last-child {
  margin-right: 0;
}

.multiselect-tag:hover {
  background: #efefef;
}

.multiselect-tag-text {
  min-height: 1em;
}

.multiselect-tag-remove-button {
  position: absolute;
  top: .25em;
  right: .25em;
  width: 1em;
  height: 1em;
  opacity: 0.3;
}

.multiselect-tag-remove-button:hover {
  opacity: 1;
}

.multiselect-tag-remove-button:before,
.multiselect-tag-remove-button:after {
  content: ' ';
  position: absolute;
  left: .5em;
  width: 2px;
  height: 1em;
  background-color: #333;
}

.multiselect-tag-remove-button:before {
  transform: rotate(45deg);
}

.multiselect-tag-remove-button:after {
  transform: rotate(-45deg);
}

.multiselect-popup {
  position: absolute;
  z-index: 1000;
  display: none;
  overflow-y: auto;
  width: 100%;
  max-height: 300px;
  box-sizing: border-box;
  border: 1px solid #bdbdbd;
  border-radius: .2em;
  background: white;
}

.multiselect-list {
  padding: 0;
  margin: 0;
}

::content li {
  padding: .5em 1em;
  min-height: 1em;
  list-style: none;
  cursor: pointer;
}

::content li[selected] {
  background: #f3f3f3;
}

::content li:focus {
  outline: dotted 1px #333;
  background: #e9e9e9;
}

::content li:hover {
    background: #e9e9e9;
}
</style>

<div class="multiselect" role="combobox">
  <div class="multiselect-field" tabindex="0"></div>
  <div class="multiselect-popup">
    <ul class="multiselect-list" role="listbox" aria-multiselectable="true">
      <content class="content" select="li"></content>
    </ul>
  </div>
</div>
`

class BwcMultiselect extends HTMLElement {
  _options = {}
  _root = null
  _control = null
  _field = null
  _popup = null
  _list = null

  constructor() {
    super()
    this._root = this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))

    this.fieldClickHandler = this.fieldClickHandler.bind(this)
    this.keyDownHandler = this.keyDownHandler.bind(this)
    this.listClickHandler = this.listClickHandler.bind(this)
  }

  connectedCallback() {
    this._options = {
      placeholder: this.getAttribute("placeholder") || 'Select'
    }
    this._control = this.shadowRoot.querySelector('.multiselect')
    this._field = this.shadowRoot.querySelector('.multiselect-field')
    this._popup = this.shadowRoot.querySelector('.multiselect-popup')
    this._list = this.shadowRoot.querySelector('.multiselect-list')

    this.render()
  }

  attributeChangedCallback(name, oldVal, newVal) {
    switch (name) {
      case 'items': {
        console.log('items changed', newVal)
        this.addItems(newVal)
        break
      }
      default:
        break
    }
  }

  static get observedAttributes() {
    return ['items']
  }

  get items() {
    return this.getAttribute('items')
  }

  set items(val) {
    this.setAttribute('items', val)
    this.addItems(val)
  }

  addItems(_items) {
    const fragment = document.createDocumentFragment()
    _items.forEach(function (item) {
      const li = document.createElement('li')
      li.textContent = item.text
      li.setAttribute('value', item.value || item.text) // Set value attribute if it exists
      fragment.appendChild(li)
    })
    // this.appendChild(fragment)
    this._list.appendChild(fragment)
    
  }

  fieldClickHandler() {
    this._isOpened ? this.close() : this.open();
  }

  refreshFocusedItem () {
    if (this._focusedItemIndex && this._focusedItemIndex > -1) this.itemElements()[this._focusedItemIndex].focus()
  }

  keyDownHandler(event) {
    switch (event.which) {
      case 8: // backspace
        const selectedItemElements = this.shadowRoot.querySelectorAll('li[selected]')
        if (selectedItemElements.length) {
            this.unselectItem(selectedItemElements[selectedItemElements.length - 1])
        }
        break
      case 13: // enter
        if(this._isOpened) {
          const focusedItem = this.itemElements()[this._focusedItemIndex];
          this.selectItem(focusedItem);
        }
        break
      case 27: // escape
        this.close()
        break
      case 38: // uparrow
        if (event.altKey) {
          this.close();
        } else {
          this._focusedItemIndex = (this._focusedItemIndex > 0)
          ? this._focusedItemIndex - 1
          : this.itemElements().length - 1;
          this.refreshFocusedItem()
        }
        break
      case 40: // dowm arrow
        if (event.altKey) {
          this.open();
        } else {
          this._focusedItemIndex = (this._focusedItemIndex < this.itemElements().length - 1)
          ? this._focusedItemIndex + 1
          : 0;
          this.refreshFocusedItem()
        }
        break
      default:
        return
    }
    event.preventDefault()
  }

  listClickHandler(event) {
    let item = event.target
    while(item && item.tagName !== 'LI') {
      item = item.parentNode
    }
    this.selectItem(item)
  }

  selectItem (item) {
    if(!item.hasAttribute('selected')) {
      item.setAttribute('selected', 'selected')
      item.setAttribute('aria-selected', true)
      this.fireChangeEvent()
      this.refreshField()
    }
    this.close()
  }

  fireChangeEvent () {
    this.dispatchEvent(new CustomEvent("change"))
  }
  togglePopup (show) {
    this._isOpened = show
    this._popup.style.display = show ? 'block' : 'none'
    this._control.setAttribute("aria-expanded", show)
  }

  createPlaceholder () {
    const placeholder = document.createElement('div')
    placeholder.className = 'multiselect-field-placeholder'
    placeholder.textContent = this._options.placeholder
    return placeholder
  }
  // * Create caret icon to indicate this is a dropdown select menu
  createCaret () {
    const caret = document.createElement('span')
    caret.className = 'caret'
    return caret
  }

  itemElements () {
    return this.shadowRoot.querySelectorAll('li')
  }

  createTag (item) {
    const tag = document.createElement('div')
    tag.className = 'multiselect-tag'

    const content = document.createElement('div')
    content.className = 'multiselect-tag-text'
    content.textContent = item.textContent

    const removeButton = document.createElement('div')
    removeButton.className = 'multiselect-tag-remove-button'
    removeButton.addEventListener('click', this.removeTag.bind(this, tag, item))

    tag.appendChild(content)
    tag.appendChild(removeButton)

    return tag
  }

  removeTag (tag, item, event) {
    this.unselectItem(item)
    event.stopPropagation()
  }

  refreshField () {
    this._field.innerHTML = ''
    const selectedItems = this.shadowRoot.querySelectorAll('li[selected]')

    // No items have been selected, show placeholder text
    if(!selectedItems.length) {
        const placeholder = this.createPlaceholder()
        // Create and append caret to placeholder
        const caret = this.createCaret()
        placeholder.appendChild(caret)
        this._field.appendChild(placeholder)
    } else { // Display selected item tags
        for(let i = 0; i < selectedItems.length; i++) {
            this._field.appendChild(this.createTag(selectedItems[i]))
        }
        // Append caret
        this._field.appendChild(this.createCaret())
    }
  }

  refreshItems () {
    const itemElements = this.itemElements()
    for(let i = 0; i < itemElements.length; i++) {
      const itemElement = itemElements[i]
      itemElement.setAttribute("role", "option")
      itemElement.setAttribute("aria-selected", itemElement.hasAttribute("selected"))
      itemElement.setAttribute("tabindex", -1)
    }
    this._focusedItemIndex = 0
  }

  unselectItem (item) {
    item.removeAttribute('selected')
    item.setAttribute('aria-selected', false)
    this.fireChangeEvent()
    this.refreshField()
  }

  attributeChangedCallback = function(optionName, oldValue, newValue) {
    this._options[optionName] = newValue
    this.refreshField()
  }

  open () {
    this.togglePopup(true)
    this.refreshFocusedItem()
  }

  close = function() {
    this.togglePopup(false)
    this._field.focus()
  }

  selectedItems () {
    const result = [];
    const selectedItems = this.shadowRoot.querySelectorAll('li[selected]')

    for (let i = 0; i < selectedItems.length; i++) {
      const selectedItem = selectedItems[i]

      const item = { value: "", text: ""}
      item.value = selectedItem.hasAttribute('value') ? selectedItem.getAttribute('value') : selectedItem.textContent
      item.text = selectedItem.textContent
      result.push(item)
    }
    return result
  }

  attachHandlers() {
    this._field.addEventListener('click', this.fieldClickHandler)
    this._control.addEventListener('keydown', this.keyDownHandler)
    this._list.addEventListener('click', this.listClickHandler)
  }

  render() {
    this.attachHandlers()
    this.refreshField()
    this.refreshItems()
  }


  disconnectedCallback() {
    this._field.removeEventListener('click', this.fieldClickHandler)
    this._control.removeEventListener('keydown', this.keyDownHandler)
    this._list.removeEventListener('click', this.listClickHandler)
  }
}

customElements.define('bwc-multiselect', BwcMultiselect)
