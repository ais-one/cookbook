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



const template = document.createElement('template')
template.innerHTML = `
<div>
  <form id="form-wrapper">
    <div class="field">
      <p class="control">
        <input class="input" type="email" placeholder="Email">
      </p>
    </div>
  </form>
</div>
`

class Form extends HTMLElement {
  constructor() {
    super()
  }

  #config = []
  #record = []
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

  _render() {
    try {
      const el = this.querySelector('#form-wrapper')
      if (!el) return
      const { cols, auto, pk, required, multiKey } = this.#config
      for (let col in cols) {
        if (!auto.includes(col)) {
          const val = cols[col]
        } else {
          console.log('auto', col)
        }
      }

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