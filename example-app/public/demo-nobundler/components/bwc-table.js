// TBD custom render columns
// TBD sticky header, sticky column
// TBD action buttons
// TBD filtering

// search (show hide filter), refresh, add, delete, upload, download, goback (if parentKey != null), loading
const template = document.createElement('template')
template.innerHTML = `
<div id="table-wrapper">
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <a id="table-navbar-burger" role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="table-navbar-menu">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>
    <div id="table-navbar-menu" class="navbar-menu">
      <div class="navbar-start">
        <div class="navbar-item">
          <a class="button">o</a>
          <a class="button">r</a>
          <a class="button">+</a>
          <a class="button">-</a>
          <a class="button">^</a>
          <a class="button">v</a>
          <a class="button">↻</a>
        </div>
      </div>

      <div class="navbar-end">
        <div class="navbar-item">
          <a id="page-dec" class="button is-primary">&larr;</a>
          <div class="select">
            <select id="page-select">
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </div>
          <input id="page-input" class="input" type="number" min="1" max="10" style="width: auto;"/>
          <a id="page-inc" class="button is-light">&rarr;</a>
        </div>
      </div>
    </div>
  </nav>

</div>
`

class Table extends HTMLElement {
  // properties
  #page = 1 // one based index
  #pageSize = 10
  #pageSizeList = [5, 10, 15]
  #columns = []
  #items = []
  #total = 0
  #pages = 0 // computed Math.ceil(total / pageSize)

  // #sortKey = ''
  // #sortDir = '' // blank, asc, desc
  #checkEnabled = true
  #checks = [] // checkboxes

  // internal
  #selectedIndex = -1
  #selectedNode = null
  #selectedItem = null
  #checkedRows = []

  // methods

  // events
  // rowclicked
  // checked
  // triggered = sort / page / pagesize / pageSizeList

  constructor() {
    super()
    // this.input = this.input.bind(this)
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
        this._setPageInput()
      }
    }
    document.querySelector('#page-dec').onclick = (e) => {
      if (this.page > 1) {
        this.page -= 1
        this._setPageInput()
        this._trigger('page')
      }
    }
    document.querySelector('#page-inc').onclick = (e) => {
      console.log('inc page', this.page, this.#pages)
      if (this.page < this.#pages) {
        this.page += 1
        this._setPageInput()
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
    if (!this.sortKey) this.sortKey = ''
    if (!this.sortDir) this.sortDir = ''

    this.render()
    this._setPageSelect()
    this._setPageInput()
    console.log('connectedCallback 1')
  }

  disconnectedCallback() {
    // this.querySelector('input').removeEventListener('input', this.input)
  }

  attributeChangedCallback(name, oldVal, newVal) {
    switch (name) {
      case 'page': {
        // const event = new CustomEvent('input', { detail: newVal })
        // this.dispatchEvent(event)
        break
      }
    }
  }

  static get observedAttributes() {
    return ['page', 'page-size', 'total']
  }

  get checkEnabled () {
    return this.#checkEnabled
  }

  set checkEnabled (val) {
    this.#checkEnabled = val
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

    this.#pages = Math.ceil(this.total / this.pageSize)
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

    this.#pages = Math.ceil(this.total / this.pageSize)
    // emit event
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

  _setPageSelect () {
    const el = document.querySelector('#page-select')
    el.textContent = '' // remove all children
    this.pageSizeList.forEach(item => {
      const option = document.createElement('option')
      option.value = item
      option.innerHTML = item
      if (Number(item) === Number(this.pageSize)) option.selected = true
      el.appendChild(option)
    })
  }

  _setPageInput () {
    const el = document.querySelector('#page-input')
    el.value = this.page
  }

  _trigger (name) {
    this.dispatchEvent(new CustomEvent('triggered', {
      detail: {
        name, // page, sort
        sortKey: this.sortKey,
        sortDir: this.sortDir,
        page: this.page || 0,
        pageSize: this.pageSize || 0
      }
    }))  
    // console.log('sort', col, this.columns[col].key, this.sortKey, this.sortDir)
  }

  render() {
    try {
      const el = document.querySelector('#table-wrapper')
      //<tfoot><tr><th><abbr title="Position">Pos</abbr></th>

      // add pagination

      if (typeof this.columns === 'object') {
        console.log('render thead')
        const table = document.createElement('table')
        el.appendChild(table)
        const thead = document.createElement('thead')
        thead.onclick = (e) => {
          let target = e.target
          if (this.#checkEnabled && !target.cellIndex) { // checkbox clicked - target.type === 'checkbox' // e.stopPropagation()?
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
            const offset = this.#checkEnabled ? 1 : 0 //  column offset
            const col = target.cellIndex - offset // TD 0-index based column
            const key = this.columns[col].key

            if (key !== this.sortKey) {
              this.sortKey = key
              this.sortDir = 'asc'
            } else {
              if (this.sortDir === 'asc') {
                this.sortDir = 'desc'
              } else if (this.sortDir === 'desc') {
                this.sortKey = ''
                this.sortDir = ''
              }
            }

            // update header
            const theadTr = document.querySelector('table thead tr')
            for (let i = offset; i < theadTr.children.length; i++) {
              const th = theadTr.children[i]
              let label = this.columns[i - offset].label
              if (this.columns[i - offset].key === this.sortKey && this.sortDir) {
                label = label + (this.sortDir === 'asc' ? '&and;': '&or;')
              }
              th.innerHTML = label
            }

            this._trigger('sort')
          }
        }

        table.appendChild(thead)
        table.classList.add('table')
        const tr = document.createElement('tr')
        thead.appendChild(tr)
        if (this.#checkEnabled) { // check all
          const th = document.createElement('th')
          th.style.width = '50px' // TBD do not hardcode
          const checkbox = document.createElement('input')
          checkbox.type = 'checkbox' // value

          th.appendChild(checkbox)
          tr.appendChild(th)
        }
        for (const col of this.columns) {
          const th = document.createElement('th')
          const label = col.label + ((this.sortKey) ? (this.sortDir === 'asc' ? '&and;': '&or') : '') // &and; (up) & &or; (down)
          if (col.width) th.style.width = `${col.width}px`
          th.appendChild(document.createTextNode(label))
          tr.appendChild(th)
        }

        // populate the data
        if (typeof this.items === 'object' && this.items.length) {
          console.log('render tbody')
          const tbody = document.createElement('tbody')
          // TBD function to get checked rows...
          tbody.onclick = (e) => {
            let target = e.target
            if (this.#checkEnabled && !target.cellIndex) { // checkbox clicked - target.type === 'checkbox' // e.stopPropagation()?

            } else {
              const offset = this.#checkEnabled ? 1 : 0 //  column offset
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
                } else {
                  const cells = target.getElementsByTagName("td")
                  data = {}
                  for (let i = offset; i < cells.length; i++) {
                    const key = this.columns[i - offset].key
                    data[key] = cells[i].innerHTML
                  }  
                  this.#selectedNode = target // set selected
                  this.#selectedIndex = row
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

            if (this.#checkEnabled) { // add checkbox
              const td = document.createElement('td')
              const checkbox = document.createElement('input')
              checkbox.type = 'checkbox' // value 
              td.appendChild(checkbox)
              tr.appendChild(td)
            }

            for (const col in row) {
              const td = document.createElement('td');
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
