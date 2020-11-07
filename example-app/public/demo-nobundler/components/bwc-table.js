// TBD
// make sticky header optional
// sticky column (make optional)
// custom render columns (inline edit?)
// cmd buttons (add, delete, upload, download, goback)
// checkbox events & collect checked items...

// FEATURES
// handle columns and items
// row select
// pagination (optional)
// filters (optional)
// sorters (optional)
// checkbox (optional)
// sticky header

// NOT NEEDED
// loading state and loading spinner

// filters: JSON.stringify(keycol.value ? [...filters, { col: keycol.value, op: '=', val: keyval.value, andOr: 'and' }] : filters),
// sorter: JSON.stringify(sorter)

// STYLING...
// --bwc-table-height
// --bwc-table-overflow

// show hide filter, reload, add, delete, upload, download, goback (if parentKey != null), loading
const template = document.createElement('template')
template.innerHTML = `
<style>
#table-wrapper {
  overflow: var(--bwc-table-overflow, auto);
  height: var(--bwc-table-height, calc(100vh - 250px));
}
#table-wrapper > nav {
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  z-index: 2;
  background-color: lightgray !important;
}
#table-wrapper #filters {
  position: -webkit-sticky;
  position: sticky;
  top: 56px;
  z-index: 2;
  background-color: cyan;
}
.sticky-header #table-wrapper th {
  position: -webkit-sticky;
  position: sticky;
  top: 56px; /* nav height - TBD filter height*/
  z-index: 2;
  background-color: red;
}
.sticky-column #table-wrapper th[scope=row] {
  position: -webkit-sticky;
  position: sticky;
  left: 0;
  z-index: 3;
}
.sticky-column #table-wrapper th:not([scope=row]) {
}
.sticky-column #table-wrapper td[scope=row] {
  position: -webkit-sticky;
  position: sticky;
  left: 0;
  z-index: 1;
  background-color: yellow;
}
</style>
<div id="table-wrapper">
  <nav id="table-navbar" class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <a id="table-navbar-burger" role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="table-navbar-menu">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>
    <div id="table-navbar-menu" class="navbar-menu">
      <div class="navbar-start">
        <div id="commands" class="navbar-item">
          <a id="cmd-filter" class="button">o</a>
          <a id="cmd-reload" class="button">↻</a>
          <a class="button">+</a>
          <a class="button">-</a>
          <a class="button">&uarr;</a>
          <a class="button">&darr;</a>
        </div>
      </div>
    
      <div class="navbar-end pagination">
        <div class="navbar-item">
          <a id="page-dec" class="button">&lt;</a>
          <a><input id="page-input" class="input" type="number" min="1" style="width: auto;"/></a>
          <a class="button is-static">&nbsp;/&nbsp;<span id="pages-span"></span></a>
          <a id="page-inc" class="button">&gt;</a>
        </div>
        <div class="navbar-item">
          <a>
            <span class="select">
              <select id="page-select">
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
              </select>
            </span>
          </a>
          <a class="button is-static">Rows/Page</a>
        </div>
      </div>
    </div>
  </nav>
  <div id="filters"></div>
</div>
`

class Table extends HTMLElement {
  // basic
  #columns = []
  #items = []

  // pagination
  #pagination = true
  #page = 1 // one based index
  #pageSize = 10
  #pageSizeList = [5, 10, 15]
  #pages = 0 // computed Math.ceil(total / pageSize)
  #total = 0

  // sorting
  #sort = true
  #sortKey = ''
  #sortDir = '' // blank, asc, desc

  // checkbox
  #checkboxes = true
  #checkedRows = []

  // selected
  #selectedIndex = -1
  #selectedNode = null
  #selectedItem = null

  // commands menu
  #commands = true

  // filters
  #filters = []
  #filterCols = []
  #filterOps = ['=', 'like', '!=', '>=', '>', '<=', '<']
  #filterShow = false

  // heights
  #navbarHeight = 56 // #table-navbar
  #filterHeight = 0 // #filters

  // events
  // rowclicked, triggered = sort / page / pagesize / pageSizeList, cmd (reload), checked

  constructor() {
    super()
    // this.input = this.input.bind(this)
  }

  _setHeights () {
    console.log(this.#navbarHeight, this.#filterHeight)
    document.querySelector('#filters').style.top = `${this.#navbarHeight}px`
    const nodes = document.querySelectorAll('.sticky-header #table-wrapper th')
    for (let i = 0; i<nodes.length; i++) {
      // console.log('nodes', nodes[i])
      nodes[i].style.top = `${this.#navbarHeight + this.#filterHeight}px`
    }
  }

  connectedCallback() {
    console.log('connected callback')

    // console.log(this.value, this.required, typeof this.required)
    this.appendChild(template.content.cloneNode(true))

    // this.querySelector('input').addEventListener('input', this.input)
    // if (this.required !== null) el.setAttribute('required', '')

    // Check for click events on the navbar burger icon
    document.querySelector('.navbar-burger').onclick = () => {
      // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
      document.querySelector('#table-navbar-burger').classList.toggle('is-active') // navbar-burger
      document.querySelector('#table-navbar-menu').classList.toggle('is-active') // navbar-menu
    }
    document.querySelector('#page-input').onblur = (e) => {
      const page = e.target.value
      if (page >= 1 && page <= this.#pages && Number(page) !== Number(this.page)) {
        this.page = page
        this._trigger('page')
      } else {
        this._renderPageInput()
      }
    }

    document.querySelector('#cmd-filter').onclick = () => {
      this.#filterShow = !this.#filterShow
      document.querySelector('#filters').style.display = this.#filterShow ? 'block': 'none'
    }

    new ResizeObserver(entries => {
      this.#navbarHeight = entries[0].target.clientHeight
      this._setHeights()
    }).observe(document.querySelector('#table-navbar'))

    new ResizeObserver(entries => {
      this.#filterHeight = entries[0].target.clientHeight
      this._setHeights()
    }).observe(document.querySelector('#filters')) // start observing a DOM node

    document.querySelector('#cmd-reload').onclick = () => this._trigger('reload') 
    document.querySelector('#page-dec').onclick = (e) => {
      if (this.page > 1) {
        this.page -= 1
        this._renderPageInput()
        this._trigger('page')
      }
    }
    document.querySelector('#page-inc').onclick = (e) => {
      console.log('inc page', this.page, this.#pages)
      if (this.page < this.#pages) {
        this.page += 1
        this._renderPageInput()
        this._trigger('page')
      }
    }
    document.querySelector('#page-select').onchange = (e) => {
      console.log('page select', e.target.value)
      // recompute #pages
      // reset page?
      this.pageSize = e.target.value
      this._trigger('page-size')
    }

    console.log('connectedCallback 0')

    // initialize non-required properties that are undefined
    if (!this.#sortKey) this.#sortKey = ''
    if (!this.#sortDir) this.#sortDir = ''

    document.querySelector('#filters').style.display = this.#filterShow ? 'block': 'none'
    if (!this.#pagination) document.querySelector('.pagination').style.display = 'none'
    if (!this.#commands) document.querySelector('#commands').style.display = 'none'
    
    this.render()
    this._renderPageSelect()
    this._renderPageInput()
    this._renderPages()
    this._renderFilters()

    console.log('connectedCallback 1')
  }

  disconnectedCallback() {
    // this.querySelector('input').removeEventListener('input', this.input)
  }

  // attributeChangedCallback(name, oldVal, newVal) {
  //   switch (name) {
  //     case 'page': {
  //       // const event = new CustomEvent('input', { detail: newVal })
  //       // this.dispatchEvent(event)
  //       break
  //     }
  //   }
  // }

  // static get observedAttributes() {
  //   return ['page', 'page-size', 'total']
  // }

  get checkboxes () {
    return this.#checkboxes
  }

  set checkboxes (val) {
    this.#checkboxes = val
  }

  get pagination () {
    return this.#pagination
  }

  set pagination (val) {
    this.#pagination = val
  }

  get commands () {
    return this.#commands
  }

  set commands (val) {
    this.#commands = val
  }

  get sort () {
    return this.#sort
  }

  set sort (val) {
    this.#sort = val
  }

  get page () {
    console.log('get page', this.#page)
    return this.#page
  }

  set page (val) {
    console.log('set page')
    this.#page = val
    // DONE ELSEWHERE emit event
  }

  get pageSize () {
    console.log('get pageSize')
    return this.#pageSize
  }

  set pageSize (val) {
    console.log('set pageSize', this.total , this.pageSize)
    this.#pageSize = val
    this._renderPages()
    // DONE ELSEWHERE emit event
  }

  get pageSizeList () {
    console.log('get pageSizeList')
    return this.#pageSizeList
  }

  set pageSizeList (val) {
    console.log('set pageSizeList')
    this.#pageSizeList = val
    // TBD emit event
  }

  get items() {
    return this.#items
  }

  set items(val) {
    console.log('set items 0', this.columns && this.columns.length)
    this.#items = val
    console.log('set items 1')
    // if columns do something
  }

  get total () {
    console.log('get total')
    return this.#total
  }

  set total (val) {
    console.log('set total xx', val, this.total , this.pageSize)
    this.#total = val

    this._renderPages()
    // emit event ?
  }

  get selectedItem () {
    return this.#selectedItem    
  }

  set selectedItem (val) {
    this.#selectedItem = val
  }

  get columns() {
    return this.#columns
  }

  set columns(val) {
    console.log('set columns 0')
    this.#columns = val
    console.log('set columns 1')
    // do something
  }

  _renderPages () {
    this.#pages = Math.ceil(this.total / this.pageSize)
    const el = document.querySelector('#pages-span')
    if (el) el.textContent = this.#pages
  }

  _renderPageSelect () {
    const el = document.querySelector('#page-select')
    el.textContent = '' // remove all children
    this.pageSizeList.forEach(item => {
      const option = document.createElement('option')
      option.value = item
      option.textContent = item
      if (Number(item) === Number(this.pageSize)) option.selected = true
      el.appendChild(option)
    })
  }

  _renderPageInput () {
    const el = document.querySelector('#page-input')
    el.value = this.page
  }

  _renderFilters () {
    const el = document.querySelector('#filters')
    el.textContent = ''
    if (this.#filters.length) {
      for (let i=0; i < this.#filters.length; i++) {
        const filter = this.#filters[i]
        const div = document.createElement('div')
        const filterCol = document.createElement('select')
        this.#filterCols.forEach(item => {
          const option = document.createElement('option')
          option.textContent = item.label
          option.value = item.key
          filterCol.appendChild(option)
        })
        filterCol.value = filter.key
        div.appendChild(filterCol)

        const filterOp = document.createElement('select')
        this.#filterOps.forEach(item => {
          const option = document.createElement('option')
          option.textContent = item
          option.value = item
          filterOp.appendChild(option)
        })
        filterOp.value = filter.op
        div.appendChild(filterOp)

        const filterInput = document.createElement('input')
        filterInput.value = filter.val
        div.appendChild(filterInput)

        const filterAndOr = new DOMParser().parseFromString(
          `<select id="filter-and-or">
            <option value="and">And</option>
            <option value="or">Or</option>
          </select>`, "text/html")
        const filterAndOrNode = filterAndOr.body.childNodes[0]
        filterAndOrNode.value = filter.andOr
        div.appendChild(filterAndOrNode)

        const delBtn = document.createElement('button')
        delBtn.textContent = '-'
        delBtn.onclick = () => this._delFilter(i)
        div.appendChild(delBtn)

        const addBtn = document.createElement('button')
        addBtn.textContent = '+'
        addBtn.onclick = () => this._addFilter(i + 1)
        div.appendChild(addBtn)
  
        el.appendChild(div)  
      }
    } else {
      const btn = document.createElement('button')
      btn.textContent = '+'
      btn.onclick = () => this._addFilter(0)
      el.appendChild(btn)
    }
  }

  _trigger (name) {
    const filters = []
    const el = document.querySelector('#filters')
    console.log(el)
    for (let i=0; i<el.children.length; i++) {
      const div = el.children[i]
      if (div.children.length >= 4) {
        filters.push({
          key: div.children[0].value,
          op: div.children[1].value,
          val: div.children[2].value,
          andOr: div.children[3].value
        })
      }
    }
    this.dispatchEvent(new CustomEvent('triggered', {
      // get filter information
      detail: {
        name, // page, sort
        sortKey: this.#sortKey,
        sortDir: this.#sortDir,
        page: this.page || 0,
        pageSize: this.pageSize || 0,
        filters
      }
    }))  
    // console.log('sort', col, this.columns[col].key, this.#sortKey, this.#sortDir)
  }

  // filters
  _delFilter (index) {
    this.#filters.splice(index, 1) // console.log('remove filter', index)
    this._renderFilters()
  }
  _addFilter (index) {
    this.#filters.splice(index, 0, { key: this.#filterCols[0].key, label: this.#filterCols[0].label, op: '=', val: '88', andOr: 'and' })
    this._renderFilters()
  }
  
  render() {
    try {
      const el = document.querySelector('#table-wrapper')
      //<tfoot><tr><th><abbr title="Position">Pos</abbr></th>

      if (typeof this.columns === 'object') {
        console.log('render thead')
        const table = document.createElement('table')
        el.appendChild(table)
        const thead = document.createElement('thead')
        thead.onclick = (e) => {
          let target = e.target
          if (this.#checkboxes && !target.cellIndex) { // checkbox clicked - target.type === 'checkbox' // e.stopPropagation()?
            const tbody = document.querySelector('table tbody')
            for (let i = 0; i < tbody.children.length; i++) {
              const tr = tbody.children[i]
              const td = tr.firstChild
              if (td) {
                const checkbox = td.firstChild
                if (checkbox.type === 'checkbox') {
                  checkbox.checked = target.checked
                }
              }
            }
          } else { // sort
            if (!this.sort) return
            const offset = this.#checkboxes ? 1 : 0 //  column offset
            const col = target.cellIndex - offset // TD 0-index based column
            const key = this.columns[col].key

            if (key !== this.#sortKey) {
              this.#sortKey = key
              this.#sortDir = 'asc'
            } else {
              if (this.#sortDir === 'asc') {
                this.#sortDir = 'desc'
              } else if (this.#sortDir === 'desc') {
                this.#sortKey = ''
                this.#sortDir = ''
              }
            }

            // update header
            const theadTr = document.querySelector('table thead tr')
            for (let i = offset; i < theadTr.children.length; i++) {
              const th = theadTr.children[i]
              let label = this.columns[i - offset].label
              if (this.columns[i - offset].key === this.#sortKey && this.#sortDir) {
                label = label + (this.#sortDir === 'asc' ? '&and;': '&or;')
              }
              th.innerHTML = label // cannot textContent (need to parse the HTML)
            }

            this._trigger('sort')
          }
        }

        table.appendChild(thead)
        table.classList.add('table')
        const tr = document.createElement('tr')
        thead.appendChild(tr)
        if (this.#checkboxes) { // check all
          const th = document.createElement('th')
          th.style.width = '50px' // TBD do not hardcode
          const checkbox = document.createElement('input')
          checkbox.type = 'checkbox' // value
          th.setAttribute('scope', 'row')
          th.appendChild(checkbox)
          tr.appendChild(th)
        }
        for (const col of this.columns) {
          const th = document.createElement('th')
          const label = col.label + ((this.#sortKey) ? (this.#sortDir === 'asc' ? '&and;': '&or') : '') // &and; (up) & &or; (down)
          if (col.width) th.style.width = `${col.width}px`
          if (col.sticky) th.setAttribute('scope', 'row')

          th.appendChild(document.createTextNode(label))
          tr.appendChild(th)

          // set filters...
          if (col.filter) this.#filterCols.push({
            key: col.key,
            label: col.label
          }) // process filters (col is key)
        }

        // populate the data
        if (typeof this.items === 'object' && this.items.length) {
          console.log('render tbody')
          const tbody = document.createElement('tbody')
          // TBD function to get checked rows...
          tbody.onclick = (e) => {
            let target = e.target
            if (this.#checkboxes && !target.cellIndex) { // checkbox clicked - target.type === 'checkbox' // e.stopPropagation()?

            } else {
              const offset = this.#checkboxes ? 1 : 0 //  column offset
              const col = target.cellIndex - offset // TD 0-index based column

              while (target && target.nodeName !== "TR") {
                target = target.parentNode
              }
              const row = target.rowIndex - 1 // TR 1-index based row
              let data = null
              if (target) {
                if (this.#selectedNode) { // clear class is-selected
                  this.#selectedNode.classList.remove('is-selected')
                }
                if (this.#selectedIndex === row && this.#selectedIndex !== -1) { // unselect
                  this.#selectedIndex = -1
                  this.selectedItem = null
                } else {
                  const cells = target.getElementsByTagName("td")
                  data = {}
                  for (let i = offset; i < cells.length; i++) {
                    const key = this.columns[i - offset].key
                    data[key] = cells[i].textContent // no need innerHTML
                  }  
                  this.#selectedNode = target // set selected
                  this.#selectedIndex = row
                  this.selectedItem = { row, col, data }
                  target.classList.add('is-selected')  
                }
              }
              this.dispatchEvent(new CustomEvent('rowclick', { detail: { row, col, data } }))
            }
          }
 
          table.appendChild(tbody)
          for (const row of this.items) {
            const tr = document.createElement('tr')
            tbody.appendChild(tr)

            if (this.#checkboxes) { // add checkbox
              const td = document.createElement('td')
              const checkbox = document.createElement('input')
              checkbox.type = 'checkbox' // value 
              td.setAttribute('scope', 'row')
              td.appendChild(checkbox)
              tr.appendChild(td)
            }

            let i = 0
            for (const col in row) {
              const td = document.createElement('td')
              if (this.columns[i].sticky) td.setAttribute('scope', 'row')
              i++
              td.appendChild(document.createTextNode(row[col]))
              tr.appendChild(td)
            }   
          }      
        }
      }
    } catch (e) {
      console.log(e)
    }
  }
}

customElements.define('bwc-table', Table)

/* FORM
      <slot name="form" :tableCfg="tableCfg" :recordObj="recordObj" :showForm="showForm">
        <form class="form-box-flex">
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
        </form>
      </slot>

*/