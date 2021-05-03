// TBD fix
// onsubmit --> multi select
// error messages on submit

// attributes
// - mode: add, edit
//
// properties
// - record
// - config (t4t config)
//
// methods
//
// events

//
// requires bwc-combobox, debounce, autocomplete
import './bwc-combobox.js'
import { debounce } from './util.js'
import { autocomplete } from './t4t-fe.js'

const bulma = {
  // the keys are from t4t cols.<col>.ui.tag
  input: {
    tag: 'div',
    className: 'field',
    children: [
      { tag: 'label', className: 'label' },
      { tag: 'div', className: 'control', children: [
        { tag: 'input-placeholder', className: 'input' },
      ] },
      { tag: 'p', className: 'help is-danger', errorLabel: true }
    ]
  }, // end input
  textarea: {
    tag: 'div',
    className: 'field',
    children: [
      { tag: 'label', className: 'label' },
      { tag: 'div', className: 'control', children: [
        { tag: 'input-placeholder', className: 'textarea' },
      ] },
      { tag: 'p', className: 'help is-danger', errorLabel: true }
    ]
  },
  select: { // ugly multiple
    tag: 'div',
    className: 'field',
    children: [
      {
        tag: 'div',
        className: 'control',
        children: [
          { tag: 'label', className: 'label' },
          {
            tag: 'div',
            className: 'select is-fullwidth', // need to add is-multiple for bulma
            children: [
              { tag: 'input-placeholder' },
            ]
          }
        ]
      }
    ]
  }, // end select
  'bwc-combobox': {
    tag: 'div',
    className: 'field',
    children: [
      { tag: 'label', className: 'label' },
      { tag: 'div', className: 'control has-icons-left', children: [
        { tag: 'input-placeholder' }, // tbd className = 'input'
      ] },
      { tag: 'p', className: 'help is-danger', errorLabel: true }
    ]
  }
} // end bulma

// Bootstrap - TBD VERIFY
const bootstrap = {
  input: {
    tag: 'div',
    children: [
      { tag: 'label', className: 'form-label' },
      { tag: 'input-placeholder', className: 'form-control' },
      { tag: 'div', className: 'form-text', errorLabel: true }
    ]
  },
  textarea: {
    tag: 'div',
    children: [
      { tag: 'label', className: 'form-label' },
      { tag: 'input-placeholder', className: 'form-control' },
      { tag: 'div', className: 'form-text', errorLabel: true }
    ]
  },
  select: {
    tag: 'div',
    children: [
      { tag: 'label', className: 'form-label' },
      { tag: 'input-placeholder', className: 'form-select' },
    ]
  },
  'bwc-combobox': {
  }
}

// Mui CSS - TBD VERIFY
const muicss = {
  input: {
    tag: 'div',
    className: 'mui-textfield',
    children: [
      { tag: 'label', children: [ { tag: 'span', className: 'mui--text-danger', errorLabel: true } ] },
      { tag: 'input-placeholder' },
    ]
  },
  textarea: {
    tag: 'div',
    className: 'mui-textfield',
    children: [
      { tag: 'label', children: [ { tag: 'span', className: 'mui--text-danger', errorLabel: true } ] },
      { tag: 'input-placeholder' },
    ]
  },
  select: {
    tag: 'div',
    className: 'mui-select',
    children: [
      { tag: 'label' },
      { tag: 'input-placeholder' },
    ]
  },
  'bwc-combobox': {
  }
}

const framework = bulma // set as bulma first

const template = document.createElement('template')

template.innerHTML = /*html*/`
<style>
.input-widget {
  /* background-color: red; */
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: var(--bwc-t4t-form-height, calc(100vh - 100px));
}
.form-area {
  align-self: center;
  /* background-color: lightgray; */
  overflow: auto;
  height: 96%;
  width: 80%;
}
.top-area {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  padding: 8px;
  position: sticky;
  top: 0px;
  background-color: lightgray;
  z-index: 1;
}
.bottom-area {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  padding: 8px;
  position: sticky;
  bottom: 0px;
  background-color: lightgray;
  z-index: 1;
}
</style>
<div class="input-widget">
  <form class="form-area" onsubmit="return false;">
    <div class="top-area"><h1>Hello</h1></div>
    <div class="content-area">
    </div>
    <div class="bottom-area">
      <div class="button-group">
        <!-- create buttons here -->
        <button type="submit" class="btn-submit button is-link">Submit</button>
        <button type="button" class="btn-cancel button is-link is-light">Cancel</button>
      </div>
    </div>
  <form>
</div>
`

class BwcT4tForm extends HTMLElement {
  constructor() {
    super()
  }

  #config = [] // from table config property passed in
  #record = {} // from record property passed in
  #xcols = {} // extended column information - info on input element, event, etc...

  get config () { return this.#config }
  set config (val) { this.#config = val }

  get record () { return this.#record }
  set record (val) { 
    this.#record = val
    if (this.#config && this.#record) {
      // console.log('do render - val (this.#record)', val)
      // console.log('do render - config', this.#config)
      this._render()
    }
  }

  connectedCallback() {
    // console.log('bwc-t4t-form', this.#config, this.#record)
    this.appendChild(template.content.cloneNode(true))
    if (this.#config && this.#record) {
      this._render()
    }
  }

  static get observedAttributes() { return ['mode'] }
  
  // attributeChangedCallback(name, oldVal, newVal) {
  //   switch (name) {
  //     case 'mode': break
  //     default: break
  //   }
  // }

  get mode() { return this.getAttribute('mode') }
  set mode(val) { this.setAttribute('mode', val) }

  // node is current node in tree, k = column key, c = column object
  formEl (node, k, c) {
    const mode = this.mode
    if (c[mode] === 'hide') return null

    // console.log(k, c)
    const { tag, className, attrs, children, errorLabel } = node
    // console.log(tag, className, attrs)
    const elementTag = (tag === 'input-placeholder') ? c.ui.tag : tag // replace for this
    const el = document.createElement(elementTag)

    if (!this.#xcols[k]) this.#xcols[k] = { }

    if (tag === 'label') el.innerText = c.label // set the label

    const inputAttrs = c?.ui?.attrs // set col specific attributes for the input
    if (inputAttrs) {
      for (let key in inputAttrs) {
        el.setAttribute(key, inputAttrs[key])
      }
    }
  
    // DONE: input - text, integer, decimal, date, time, datetime, file(upload)
    // DONE: select (single and multiple, limited options)
    // DONE: textarea
    // DONE: bwc-combobox (multiple with tags), TBD: need to test more

    if (['input', 'textarea', 'select', 'bwc-combobox'].includes(elementTag)) { // its an input
      if (c.mode === 'readonly') el.setAttribute('disabled', true) // select is disabled, as it applies to more html tags
      if (c.required) el.setAttribute('required', true)

      if (elementTag === 'select') { // set the options
        // console.log('select', el.value, k, this.#record[k], this.mode)
        const selectString = (this.mode === 'add') ? c.default || '' : this.#record[k] || ''
        const selected = !selectString ? [] : (c?.ui?.attrs?.multiple) ? selectString.split(',') : [selectString]
        const options = c?.ui?.options
        for (let option of options) {
          const optEl = document.createElement('option')
          optEl.value = option.key
          optEl.innerText = option.text
          if (selected.includes(option.key)) {
            optEl.selected = true // set selected
          }
          el.appendChild(optEl)
        }
      } else { // other input
        if (elementTag === 'bwc-combobox') {
          // console.log('bwc-combobox', this.#record)
          el.setAttribute('listid', 'list-'+k)
          el.setAttribute('object-key', 'key')
          el.setAttribute('object-text', 'text')
          if (c?.ui?.attrs?.multiple) el.setAttribute('multiple', '')
          if (c?.ui?.attrs?.repeat) el.setAttribute('repeat', '')
          if (c?.ui?.attrs?.allowCustomTag) el.setAttribute('allow-custom-tag', '')
          if (c?.ui?.attrs?.tagLimit) el.setAttribute('tag-limit', c.ui.attrs.tagLimit)
          // disbled and required already set
          // TBD set input class

          el.onload = (e) => { // need to wait for component to load before setting the values
            // console.log('bwc loaded')
            const valueType = c?.ui?.valueType // TBD transform value
            if (c?.ui?.attrs?.multiple) { // can be array in column or join table
              const val = this.mode === 'add' ? c.default : this.#record[k]
              if (valueType === '') {
                el.tags = val.split(',').map(item => ({ key: item, text: item })) || []
              } else { // object
                el.tags = val || []
              }
            } else { // single
              const val = this.mode === 'add' ? c.default : this.#record[k]  
              if (valueType === '') {
                el.value = val || ''
                el.selected = val ? { key: val, text: val } : null
              } else { // object
                el.value = val.text || '' // key and text should be same
                el.selected = val || null
              }
            }
          } // onload end

          el.onsearch = debounce(async (e) => {
            // this.#xcols['state'].el.value // use this.#xcols to get latest values
            // console.log(e.target.value, k, this.#record) // this.#record does not change until validated and submit
            let parentVal = null
            if (c?.options?.parentCol) {
              const col = this.#xcols[c?.options?.parentCol]
              if (col && col.el) parentVal = col.el.value
            }
            const res = await autocomplete(e.target.value, k, this.#record, parentVal)
            el.items = res
          }, 500)
          el.onselect = (e) => { // onselect works (events handled by DOM), onselected need to use addEventListener
            // TBD reset child value - may cascade down further
            const childColName = c?.options?.childCol
            if (childColName) {
              const col = this.#xcols[childColName]
              const childColObj = this.#config.cols[childColName]
              if (col && col.el) {
                if (childColObj?.ui?.attrs?.multiple) { // multiple
                  col.el.tags = []
                } else {
                  col.el.value = ''
                  col.el.selected = null
                }
              }
            }
            console.log('t4t combobox onselect', e.detail)
          }
        } else { // input, textarea
          if (this.mode === 'add') { // set the value
            el.value = c.default || ''
          } else if (this.mode === 'edit') {
            // console.log('is FileList',this.#record[k] instanceof FileList, k, el.type === 'file')
            el.value = el.type === 'file' ? '' : (this.#record[k] || '')
          }  
        }
      }
      this.#xcols[k].el = el // set input element
    }  

    if (errorLabel) {
      this.#xcols[k].errorEl = el
    }

    if (className) el.className = className // set classes

    // Bulma Specific Note (TBD tmprove this): if className has 'select' - it is bulma need to set is-multiple here if is multi select
    if (node?.className && node.className.includes('select')) {
      if (c?.ui?.attrs?.multiple) {
        el.classList.add('is-multiple')
      }
    }

    if (attrs) {
      for (let key in attrs) {
        el.setAttribute(key, attrs[key])
      }
    }
    if (children) {
      children.forEach(child => {
        const childEl = this.formEl(child, k, c)
        if (childEl) el.appendChild(childEl)
      })
    }
    return el
  }
    
  _render() {
    try {
      // const el = this.querySelector('#form-wrapper')
      const el = this.querySelector('.content-area')
      if (!el) return // .content-area not found
      el.innerHTML = ''
      const { cols, auto, pk, required, multiKey } = this.#config
      // console.log('this.#record', this.#record)
      for (let col in cols) {
        if (!auto.includes(col)) {
          const c = cols[col]
          // console.log('nonauto', c, this.mode)
          if ((this.mode === 'add' && c.add !== 'hide') || (this.mode === 'edit' && c.edit !== 'hide')) {
            const tagKey = c?.ui?.tag
            if (tagKey) {
              const fieldEl = this.formEl(framework[tagKey], col, c)

              if (c?.ui?.attrs?.type === 'file' && this.mode === 'edit') { // field is file...
                this.#xcols[col].errorEl.innerText = this.#record[col] || 'No Files Found'
                // console.log(fieldEl, col)
              }
              el.appendChild(fieldEl)
            }
          }
        } else {
          // console.log('auto', col)
        }
      }

      const btnSubmit = this.querySelector('.btn-submit')
      // btnSubmit.classList.add('button')
      btnSubmit.onclick = (e) => {
        let error = false
        // console.log('submit clicked')
        e.preventDefault() // e.stopPropagation()

        // check validity
        for (let col in this.#xcols) {
          if (this.#xcols[col].el) {
            if (this.#xcols[col]?.el?.checkValidity) {
              const valid = this.#xcols[col].el.checkValidity()
              if (!valid) error = true
              if (this.#xcols[col].errorEl) this.#xcols[col].errorEl.innerText = valid ? '' : this.#xcols[col].el.validationMessage  
            }
          }
        }

        // console.log(this.#record)
        if (!error) {
          for (let col in this.#xcols) {
            // console.log('this.#xcols', this.#xcols[col].el.tagName)
            const inputEl = this.#xcols[col].el
            if (inputEl) {
              if (inputEl.tagName.toLowerCase() === 'select') {
                // select options, [string] - done, [{ key, text }] - next
                const selected = []
                for (let opt of inputEl.selectedOptions) {
                  selected.push(opt.value)
                }
                this.#record[col] = selected.join(',')
              } else if (inputEl.tagName.toLowerCase() === 'bwc-combobox') {
                // TBD set the value
                const c = this.#config.cols[col]
                const val = c?.ui?.attrs?.multiple ? inputEl.tags : inputEl.selected
                const valueType = c?.ui?.valueType

                if (c?.ui?.attrs?.multiple) { // can be array in column or join table
                  if (valueType === '') {
                    this.#record[col] = val.map(item => item.text).join(',')
                  } else { // object
                    this.#record[col] = val
                  }
                } else { // single
                  if (valueType === '') {
                    this.#record[col] = val.text
                  } else { // object
                    this.#record[col] = val
                  }
                }
              } else { // input, textarea
                this.#record[col] = inputEl.value
                if (inputEl.files) {
                  // console.log(inputEl.files instanceof FileList)
                  this.#record[col] = inputEl.files
                }
              }
            }
          }
          // console.log('test submit', this.#record)
          this.dispatchEvent(new CustomEvent('submit', { detail: { data: this.#record } }))
        } else {
          this.dispatchEvent(new CustomEvent('submit', { detail: { error } }))
        }
      }
  
      const btnCancel = this.querySelector('.btn-cancel')
      // btnCancel.classList.add('button')
      btnCancel.onclick = (e) => {
        e.preventDefault()
        this.dispatchEvent(new CustomEvent('cancel'))
      }
    } catch (e) {
      console.log('bwc-t4t-form', e)
    }
  }
}

customElements.define('bwc-t4t-form', BwcT4tForm) // or bwc-form-t4t

/*
<template v-if="tableCfg.cols[col].input === 'link'">
  <mwc-textfield
    @click="router.push('/' + tableCfg.cols[col].options.to + '?keyval=' + recordObj[showForm].key + '&keycol=' + tableCfg.cols[col].options.relatedCol)"
    disabled
    class="field-item"
    :key="col + index"
    :label="tableCfg.cols[col].label"
    outlined
    type="text"
    v-model="recordObj[showForm][col]"
  ></mwc-textfield>
</template>
*/