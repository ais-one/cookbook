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
const bulma = {
  // the keys are from t4t cols.<col>.ui.tag
  input: {
    tag: 'div',
    className: 'field',
    children: [
      { tag: 'label', className: 'field' },
      { tag: 'div', className: 'control', children: [
        { tag: 'input', className: 'input' },
        // { tag: 'textarea', className: 'textarea is-primary' }
        // { tag: 'bwc-autocomplete', className: '' }
      ] },
      { tag: 'p', className: 'help is-danger', errorLabel: true }
    ]
  }, // end input
  textarea: {
    tag: 'div',
    className: 'field',
    children: [
      { tag: 'label', className: 'field' },
      { tag: 'div', className: 'control', children: [
        { tag: 'textarea', className: 'textarea' },
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
            className: 'select',
            children: [
              { tag: 'select' },
            ]
          }
        ]
      }
    ]
  } // end select
} // end bulma

// Bootstrap
const bootstrap = {
  input: {
    tag: 'div',
    children: [
      { tag: 'label', className: 'form-label' },
      { tag: 'input', className: 'form-control' },
      { tag: 'div', className: 'form-text', errorLabel: true }
    ]
  },
  textarea: {
    tag: 'div',
    children: [
      { tag: 'label', className: 'form-label' },
      { tag: 'textarea', className: 'form-control' },
      { tag: 'div', className: 'form-text', errorLabel: true }
    ]
  },
  select: {
    tag: 'div',
    children: [
      { tag: 'label', className: 'form-label' },
      { tag: 'select', className: 'form-select' },
    ]
  },
}

// Mui CSS
const muicss = {
  input: {
    tag: 'div',
    className: 'mui-textfield',
    children: [
      { tag: 'label', children: [ { tag: 'span', className: 'mui--text-danger', errorLabel: true } ] },
      { tag: 'input' },
    ]
  },
  textarea: {
    tag: 'div',
    className: 'mui-textfield',
    children: [
      { tag: 'label', children: [ { tag: 'span', className: 'mui--text-danger', errorLabel: true } ] },
      { tag: 'textarea' },
    ]
  },
  // no multiple
  select: {
    tag: 'div',
    className: 'mui-select',
    children: [
      { tag: 'label' },
      { tag: 'select' },
    ]
  },
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

class T4tForm extends HTMLElement {
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

  // k = column key
  // c = column object
  // node is 
  formEl (node, k, c) {
    const mode = this.mode
    if (c[mode] === 'hide') return null

    // console.log(k, c)
    const { tag, className, attrs, children, errorLabel } = node
    // console.log(tag, className, attrs)
    const elementTag = (tag === 'input') ? c.ui.tag : tag
    const el = document.createElement(elementTag)

    if (!this.#xcols[k]) this.#xcols[k] = { }

    if (tag === 'label') el.innerText = c.label // set the label

    if (errorLabel) {
      this.#xcols[k].errorEl = el
    }
    
    if (['input', 'textarea', 'select', 'autocomplete'].includes(elementTag)) { // its an input
      if (c[mode] === 'readonly') el.setAttribute('disabled', true) // select is disabled, as it applies to more html tags
      if (c.required) el.setAttribute('required', true)
  
      if (this.mode === 'add') { // set the value
        el.value = c.default || ''
      } else if (this.mode === 'edit') {
        el.value = this.#record[k] || ''
      }
  
      // input - text, integer, decimal, date, time, datetime, file(upload), TBD textarea...
      // select
      // textarea
      // textfield, textarea, autocomplete, select, multi-select, link - to child table
      if (elementTag === 'select') {

      }

      const inputAttrs = c?.ui?.attrs // set col specific attributes for the input
      if (inputAttrs) {
        for (let key in inputAttrs) {
          el.setAttribute(key, inputAttrs[key])
        }
      }
      // el.setAttribute('type', c?.ui?.attrs?.type || 'text')
      this.#xcols[k].el = el
    }  

    if (className) el.className = className // set classes
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
      if (!el) {
        console.log('no content-area')
        return
      } else {
        console.log('content-area found')
      }
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
              el.appendChild(fieldEl)
            }
          }
        } else {
          console.log('auto', col)
        }
      }

      const btnSubmit = this.querySelector('.btn-submit')
      // btnSubmit.classList.add('button')
      btnSubmit.onclick = (e) => {
        let error = false
        // console.log('submit clicked')
        // e.stopPropagation()
        e.preventDefault()
        for (let col in this.#xcols) {
          if (this.#xcols[col].el) {
            const valid = this.#xcols[col].el.checkValidity()
            if (!valid) error = true
            if (this.#xcols[col].errorEl) this.#xcols[col].errorEl.innerText = valid ? '' : this.#xcols[col].el.validationMessage
          }
        }
        // console.log(this.#record)
        if (!error) {
          for (let col in this.#xcols) {
            if (this.#xcols[col].el) {
              this.#record[col] = this.#xcols[col].el.value
            }
          }
          this.dispatchEvent(new CustomEvent('submit', { detail: { data: this.#record } }))
        } else {
          this.dispatchEvent(new CustomEvent('submit', { detail: { error } }))
        }
      }
  
      const btnCancel = this.querySelector('.btn-cancel')
      // btnCancel.classList.add('button')
      btnCancel.onclick = (e) => {
        // console.log('cancel clicked')
        e.preventDefault()
        this.dispatchEvent(new CustomEvent('cancel'))
      }
    } catch (e) {
      console.log('bwc-t4t-form', e)
    }
  }
}

customElements.define('bwc-t4t-form', T4tForm) // or bwc-form-t4t

/*
    <p>{{ showForm !== 'add' ? 'Edit' : 'Add' }}</p>
    <div class="field-set-flex">
      <template v-for="(val, col, index) of recordObj[showForm]">
        <template v-if="tableCfg.cols[col]">
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
          <template v-else-if="tableCfg.cols[col].input === 'select'">
            <mwc-select :key="col + index" :label="tableCfg.cols[col].label" :value="recordObj[showForm][col]" @change="(e) => (recordObj[showForm][col] = e.target.value)">
              <mwc-list-item v-for="(option, index2) of tableCfg.cols[col].options" :value="option.key" :key="col + index + '-' + index2">{{ option.text }}</mwc-list-item>
            </mwc-select>
          </template>
          <template v-else-if="tableCfg.cols[col].input === 'multi-select'">
            <mwc-multiselect :required="isRequired(col)" :key="col + index" :label="tableCfg.cols[col].label" v-model="recordObj[showForm][col]" :options="JSON.stringify(tableCfg.cols[col].options)"></mwc-multiselect>
          </template>
          <template v-else-if="tableCfg.cols[col].input === 'autocomplete'">
            <mwc-autocomplete :class="col" :required="isRequired(col)" :key="col + index" :label="tableCfg.cols[col].label" v-model="recordObj[showForm][col]" @search="(e) => autoComplete(e, col, showForm)"></mwc-autocomplete>
          </template>
          <template v-else>
            <mwc-textfield :required="isRequired(col)" class="field-item" :key="col + index" :label="tableCfg.cols[col].label" outlined type="text" v-model="recordObj[showForm][col]"></mwc-textfield>
          </template>
        </template>
      </template>
    </div>
    <mwc-button type="button" @click="showForm = ''">Cancel</mwc-button>
    <mwc-button type="button" @click="doAddOrEdit" :disabled="loading">Confirm</mwc-button>
*/