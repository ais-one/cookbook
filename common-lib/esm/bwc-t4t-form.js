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
  input: {
    tag: 'div',
    className: 'field',
    children: [
      { tag: 'label', className: 'field' },
      { tag: 'div', className: 'control', children: [
        { tag: 'input', className: 'input', attrs: { type: 'text' } },
      ] },
      { tag: 'p', className: 'help is-danger' }
    ]
  }, // end input
  // <textarea class="textarea is-primary" placeholder="Primary textarea"></textarea>
  // ugly multiple
  select: {
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
      { tag: 'input', className: 'form-control', attrs: { type: 'text' } },
      { tag: 'div', className: 'form-text' }
    ]
  },
  // <textarea class="form-control" rows="3"></textarea>
  // ugly multiple
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
      { tag: 'label' },
      { tag: 'input', attrs: { type: 'text' } },
    ]
  },
  // <textarea placeholder="Textarea"></textarea>
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

const template = {
  bulma,
  bootstrap,
  muicss
}


const template = document.createElement('template')
template.innerHTML = `
<div>
  <form id="form-wrapper">
  </form>
</div>
`

class Form extends HTMLElement {
  constructor() {
    super()
  }

  #config = []
  #record = {}
  get config () { return this.#config }
  set config (val) {
    // console.log('vvvv config', val)
    this.#config = val
  }
  get record () { return this.#record }
  set record (val) { 
    this.#record = val
    if (this.#config && this.#record) {
      // console.log('do render', val, this.#config)
      this._render()
    }
  }

  connectedCallback() {
    this.appendChild(template.content.cloneNode(true))
    console.log('t4t-form', this.#config)
    this._render()
  }

  static get observedAttributes() {
    return ['mode']
  }

  get mode() {
    return this.getAttribute('mode')
  }

  set mode(val) {
    this.setAttribute('mode', val)
  }

  formEl (node) {
    const { tag, className, attrs, children } = node
    const el = document.createElement(tag)
    if (className) {
      el.className = className
    }
    if (attrs) {
      for (let key in attrs) {
        el.setAttirbutes(key, attrs[key])
      }
    }
    if (children) {
      children.forEach(child => {
        childEl = formEl(child)
        el.appendChild(childEl)
      })
    }
    return el
  }
    
  _render() {
    try {
      const el = this.querySelector('#form-wrapper')
      if (!el) return
      el.innerHTML = ''
      const { cols, auto, pk, required, multiKey } = this.#config
      console.log('this.#record', this.#record)
      for (let col in cols) {
        if (!auto.includes(col)) {
          const c = cols[col]
          // console.log('nonauto', c, this.mode)
          if ((this.mode === 'add' && c.add !== 'hide') || (this.mode === 'edit' && c.edit !== 'hide')) {
            const div = document.createElement('div')
            div.classList.add('field')
            const p = document.createElement('p')
            p.classList.add('control')

            // input..., autocomplete, select/multiselect, upload, link?, textarea
            const input = document.createElement('input')
            input.classList.add('input')
            input.setAttribute('type', 'text')
            input.setAttribute('placeholder', c.label)
            if (this.mode === 'add') {
              if (c.add === 'readonly') input.setAttribute('readonly', true)
              input.value = c.default || ''
            } else if (this.mode === 'edit') {
              if (c.edit === 'readonly') input.setAttribute('readonly', true)
              // input.value = this.#record[col] || ''
            }

            // textfield, textarea, autocomplete, integer, decimal, select, multi-select, date, time, datetime, upload, link - to child table
            if (c.input === 'datetime') input.setAttribute('type', 'datetime-local')
            else if (c.input === 'date') input.setAttribute('type', 'date')
            else if (c.input === 'time') input.setAttribute('type', 'time')
            else if (c.input === 'number') {
              input.setAttribute('type', 'number')
              if (c.type === 'integer') input.setAttribute('step', 1)
              // c.type === 'decimal'
            }
            if (c.required) input.setAttribute('required', true)

            p.appendChild(input)
            div.appendChild(p)
            el.appendChild(div)
          }
        } else {
          console.log('auto', col)
        }
      }
      this.btnSubmit = document.createElement('button')
      this.btnSubmit.classList.add('button')
      this.btnSubmit.textContent = 'Submit'
      this.btnSubmit.onclick = (e) => {
        console.log('submit clicked')
        e.stopPropagation()
        this.dispatchEvent(new CustomEvent('submit', { detail: this.#record })) // TBD populate this.#record for add
      }
      el.appendChild(this.btnSubmit)
  
      this.btnCancel = document.createElement('button')
      this.btnCancel.classList.add('button')
      this.btnCancel.textContent = 'Cancel'
      this.btnCancel.onclick = (e) => {
        console.log('cancel clicked')
        e.preventDefault()
        this.dispatchEvent(new CustomEvent('cancel'))
      }
      el.appendChild(this.btnCancel)

    } catch (e) {
    }
  }
}

customElements.define('bwc-t4t-form', Form) // or bwc-form-t4t

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
          <template v-else-if="tableCfg.cols[col][showForm] === 'readonly'">
            <mwc-textfield disabled class="field-item" :key="col + index" :label="tableCfg.cols[col].label" outlined type="text" v-model="recordObj[showForm][col]"></mwc-textfield>
          </template>
          <template v-else-if="tableCfg.cols[col].input === 'number'">
            <mwc-textfield :required="isRequired(col)" class="field-item" :key="col + index" :label="tableCfg.cols[col].label" outlined type="number" v-model="recordObj[showForm][col]"></mwc-textfield>
          </template>
          <template v-else-if="tableCfg.cols[col].input === 'datetime'">
            <mwc-textfield :required="isRequired(col)" class="field-item" :key="col + index" :label="tableCfg.cols[col].label" outlined type="datetime-local" v-model="recordObj[showForm][col]"></mwc-textfield>
          </template>
          <template v-else-if="tableCfg.cols[col].input === 'date'">
            <mwc-textfield :required="isRequired(col)" class="field-item" :key="col + index" :label="tableCfg.cols[col].label" outlined type="date" v-model="recordObj[showForm][col]"></mwc-textfield>
          </template>
          <template v-else-if="tableCfg.cols[col].input === 'time'">
            <mwc-textfield :required="isRequired(col)" class="field-item" :key="col + index" :label="tableCfg.cols[col].label" outlined type="time" v-model="recordObj[showForm][col]"></mwc-textfield>
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