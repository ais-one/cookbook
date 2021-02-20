// TBD
// inline edit?

// FEATURES
// handle columns and items
// row select
// pagination (optional)
// filters (optional)
// sorter single column (optional)
// checkbox (optional)
// sticky header (optional)
// sticky coloumn (optional - currently only for 1st column)
// checkbox & check all (optional)
// custom render columns

// STYLING...
// --bwc-table-width: 100%
// --bwc-table-overflow: auto
// --bwc-table-height: 100%
// --bwc-table-navbar-bgcolor: white
// --bwc-table-filter-bgcolor: white
// --bwc-table-filter-color: black
// --bwc-table-filter-top: 56px
// --bwc-table-th-bgcolor: white
// --bwc-table-th-color: black
// --bwc-table-td-bgcolor: transparent
// --bwc-table-td-color: black
// --bwc-table-td-select-bgcolor: black
// --bwc-table-td-select-color: black
// --bwc-table-sticky-header-top: 56px

// PROPERTIES
// commands="reload,filter"
// :pagination="true"
// :sort="true"
// :page="page"
// :pageSize="pageSize"
// :pageSizeList="pageSizeList"
// :columns="columns"
// :items="table.items"
// :total="total"
// style="--bwc-table-height: calc(100vh - 360px);--bwc-table-width: 200%;"
// class="sticky-header sticky-column"

// TBD change some properties to attributes?

// EVENTS
// rowclick { detail: { row, col, data }
// triggered = sort / page / page-size / reload { detail: { name, sortKey, sortDir, page, pageSize, filters: [ { key, op, val, andOr } ] } }
// cmd = show/hide filter, reload, add, del, import, export, goback (if parentKey != null)
// checked = [indexes checked...]

// COLUMN PROPERTIES
// for hidden table columns, please remove before passing it to component
// label: 'ID',
// key: 'id',
// filter: false,
// sort: false,
// render: ({val, key, row, idx}) => `<a class='button' onclick='this.dispatchEvent(new CustomEvent("testevent", { detail: ${JSON.stringify({ val, key, row, idx })} }))'>${val}</a>`
//   cell value, column key, row data, row index (0-based)
//   try not to include row property in event detail... can be too much data

// NOT NEEDED
// loading state and loading spinner

// NOTES
// do not use document.querySelector, use this.querySelector

const template = document.createElement('template')
template.innerHTML = /*html*/`
<style>
#table-wrapper {
  overflow: var(--bwc-table-overflow, auto);
  height: var(--bwc-table-height, 100%);
}
#table-wrapper table {
  table-layout: initial;
  width: var(--bwc-table-width, 100%);
}
#table-wrapper > nav {
  position: -webkit-sticky;
  position: sticky;
  top: 0px;
  left: 0px;
  z-index: 2;
  background-color: var(--bwc-table-navbar-bgcolor, lightslategray) !important;
}
#table-wrapper #filters {
  position: -webkit-sticky;
  position: sticky;
  top: var(--bwc-table-filter-top, 56px);
  left: 0px;
  z-index: 2;
  background-color: var(--bwc-table-filter-bgcolor, white);
  color: var(--bwc-table-filter-color, black);
}
#table-wrapper th {
  background-color:  var(--bwc-table-th-bgcolor, white);
  color: var(--bwc-table-th-color, black);
}
#table-wrapper tr td {
  background-color:  var(--bwc-table-td-bgcolor, transparent);
  color: var(--bwc-table-td-color, black);
}
#table-wrapper tr.is-selected td {
  background-color:  var(--bwc-table-td-select-bgcolor, lightgrey);
  color: var(--bwc-table-td-select-color, black);
}
.sticky-header #table-wrapper th {
  position: -webkit-sticky;
  position: sticky;
  top: var(--bwc-table-sticky-header-top, 56px); /* nav height - TBD filter height*/
  z-index: 2;
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
          <a id="cmd-add" class="button">+</a>
          <a id="cmd-del" class="button">-</a>
          <a id="cmd-import" class="button">↑</a>
          <a id="cmd-export" class="button">↓</a>
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

  // enable pagination
  #pagination = true
  #page = 1 // one based index
  #pageSize = 10
  #pageSizeList = [5, 10, 15]
  #pages = 0 // computed Math.ceil(total / pageSize)
  #total = 0

  // enable sorting
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

  // enable commands menu
  #commands = ''

  // filters
  #filters = []
  #filterCols = []
  #filterOps = ['=', 'like', '!=', '>=', '>', '<=', '<']
  #filterShow = false

  // heights
  #navbarHeight = 56 // #table-navbar
  #filterHeight = 0 // #filters

  constructor() {
    super()
    // this.input = this.input.bind(this)
  }

  _setHeights () {
    // console.log(this.#navbarHeight, this.#filterHeight)
    const el = this.querySelector('#filters')
    if (!el) return
    el.style.top = `${this.#navbarHeight}px`
    const nodes = this.querySelectorAll('.sticky-header #table-wrapper th')
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
    this.querySelector('.navbar-burger').onclick = () => {
      // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
      this.querySelector('#table-navbar-burger').classList.toggle('is-active') // navbar-burger
      this.querySelector('#table-navbar-menu').classList.toggle('is-active') // navbar-menu
    }
    this.querySelector('#page-input').onblur = (e) => {
      const page = e.target.value
      if (page >= 1 && page <= this.#pages && Number(page) !== Number(this.page)) {
        this.page = page
        this._trigger('page')
      } else {
        this._renderPageInput()
      }
    }

    this.querySelector('#cmd-filter').onclick = () => {
      this.#filterShow = !this.#filterShow
      this.querySelector('#filters').style.display = this.#filterShow ? 'block': 'none'
    }

    new ResizeObserver(entries => {
      this.#navbarHeight = entries[0].target.clientHeight
      this._setHeights()
    }).observe(this.querySelector('#table-navbar'))

    new ResizeObserver(entries => {
      this.#filterHeight = entries[0].target.clientHeight
      this._setHeights()
    }).observe(this.querySelector('#filters')) // start observing a DOM node

    this.querySelector('#cmd-reload').onclick = () => this._trigger('reload') 
    this.querySelector('#cmd-add').onclick = () => this.dispatchEvent(new CustomEvent('cmd', { detail: { cmd: 'add' } }))
    this.querySelector('#cmd-del').onclick = () => this.dispatchEvent(new CustomEvent('cmd', { detail: { cmd: 'del', checkedRows: this.#checkedRows } }))
    this.querySelector('#cmd-import').onclick = () => this.dispatchEvent(new CustomEvent('cmd', { detail: { cmd: 'import' } }))
    this.querySelector('#cmd-export').onclick = () => this.dispatchEvent(new CustomEvent('cmd', { detail: { cmd: 'export', checkedRows: this.#checkedRows } }))
    this.querySelector('#page-dec').onclick = (e) => {
      if (this.page > 1) {
        this.page -= 1
        this._renderPageInput()
        this._trigger('page')
      }
    }
    this.querySelector('#page-inc').onclick = (e) => {
      console.log('inc page', this.page, this.#pages)
      if (this.page < this.#pages) {
        this.page += 1
        this._renderPageInput()
        this._trigger('page')
      }
    }
    this.querySelector('#page-select').onchange = (e) => {
      console.log('page select', e.target.value)
      // recompute #pages
      // reset page?
      this.pageSize = e.target.value
      this._trigger('page-size')
    }

    // console.log('connectedCallback 0')

    // initialize non-required properties that are undefined
    if (!this.#sortKey) this.#sortKey = ''
    if (!this.#sortDir) this.#sortDir = ''

    this.querySelector('#filters').style.display = this.#filterShow ? 'block': 'none'
    if (!this.#pagination) this.querySelector('.pagination').style.display = 'none'
    if (!this.#commands || typeof this.#commands !== 'string') {
      this.querySelector('#commands').style.display = 'none'
    }
    else {
      this.querySelector('#cmd-reload').style.display = this.#commands.includes('reload') ? 'block' : 'none'
      this.querySelector('#cmd-filter').style.display = this.#commands.includes('filter') ? 'block' : 'none'
      this.querySelector('#cmd-add').style.display = this.#commands.includes('add') ? 'block' : 'none'
      this.querySelector('#cmd-del').style.display = this.#commands.includes('del') ? 'block' : 'none'
      this.querySelector('#cmd-import').style.display = this.#commands.includes('import') ? 'block' : 'none'
      this.querySelector('#cmd-export').style.display = this.#commands.includes('export') ? 'block' : 'none'
    }
    
    this._render()
    this._renderPageSelect()
    this._renderPageInput()
    this._renderPages()
    this._renderFilters()

    // console.log('connectedCallback 1')
  }

  disconnectedCallback() {
    // this.querySelector('input').removeEventListener('input', this.input)
  }

  // attributeChangedCallback(name, oldVal, newVal) {
  //   switch (name) {
  //     case 'page': { break }
  //   }
  // }
  // static get observedAttributes() {
  //   return ['page']
  // }

  get checkboxes () { return this.#checkboxes }
  set checkboxes (val) { this.#checkboxes = val }
  get pagination () { return this.#pagination }
  set pagination (val) { this.#pagination = val }
  get commands () { return this.#commands }
  set commands (val) { this.#commands = val }
  get sort () { return this.#sort }
  set sort (val) { this.#sort = val }

  get page () { return this.#page }
  set page (val) { this.#page = val } // DONE ELSEWHERE emit event

  get pageSize () { return this.#pageSize }
  set pageSize (val) {
    console.log('set pageSize', this.total , this.pageSize)
    this.#pageSize = val
    this._renderPages()
  } // DONE ELSEWHERE emit event

  get pageSizeList () { return this.#pageSizeList }
  set pageSizeList (val) { this.#pageSizeList = val } // TBD emit event
  get items() { return this.#items }
  set items(val) {
    // console.log('set items')
    this.#items = val
    this._render()
    this._renderPageSelect()
    this._renderPageInput()
    this._renderPages()
  } // if columns do something

  get total () { return this.#total }
  set total (val) {
    this.#total = val
    this._renderPages()
  } // emit event ?

  get selectedItem () { return this.#selectedItem }
  set selectedItem (val) { this.#selectedItem = val }
  get columns() { return this.#columns }
  set columns(val) {
    this.#columns = val
    this._render()
  }
  
  _renderPages () {
    this.#pages = Math.ceil(this.total / this.pageSize)
    const el = this.querySelector('#pages-span')
    if (el) el.textContent = this.#pages
  }

  _renderPageSelect () {
    const el = this.querySelector('#page-select')
    if (!el) return
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
    const el = this.querySelector('#page-input')
    if (!el) return
    el.value = this.page
  }

  _createSelect (items, value) {
    const p = document.createElement('p')
    p.classList.add('control', 'm-0')
    const span = document.createElement('span')
    span.classList.add('select')
    const select = document.createElement('select')
    items.forEach(item => {
      const option = document.createElement('option')
      if (item.key) {
        option.textContent = item.label
        option.value = item.key
      } else {
        option.textContent = item
        option.value = item
      }
      select.appendChild(option)
    })
    select.value = value
    span.appendChild(select)
    p.appendChild(span)
    return p
  }

  _renderFilters () {
    const el = this.querySelector('#filters')
    el.textContent = ''
    if (this.#filters.length) {
      for (let i=0; i < this.#filters.length; i++) {
        const filter = this.#filters[i]
        const div = document.createElement('div')
        div.classList.add('field', 'has-addons', 'm-0', 'p-1')

        div.appendChild( this._createSelect (this.#filterCols, filter.key) )
        div.appendChild( this._createSelect (this.#filterOps, filter.op) )

        const p = document.createElement('p')
        p.classList.add('control', 'm-0')
        const filterInput = document.createElement('input')
        filterInput.classList.add('input')
        filterInput.value = filter.val
        p.appendChild(filterInput)
        div.appendChild(p)

        const pf = document.createElement('p')
        pf.classList.add('control', 'm-0')
        pf.innerHTML = `<span class="select">
        <select id="filter-and-or">
          <option value="and">And</option>
          <option value="or">Or</option>
        </select>
        </span>`
        pf.querySelector('#filter-and-or').value = filter.andOr
        div.appendChild(pf)

        const p1 = document.createElement('p')
        p1.classList.add('control', 'm-0')
        const delBtn = document.createElement('button')
        delBtn.classList.add('button')
        delBtn.textContent = '-'
        delBtn.onclick = () => this._delFilter(i)
        p1.appendChild(delBtn)
        div.appendChild(p1)

        const p2 = document.createElement('p')
        p2.classList.add('control', 'm-0')
        const addBtn = document.createElement('button')
        addBtn.classList.add('button')
        addBtn.textContent = '+'
        addBtn.onclick = () => this._addFilter(i + 1)
        p2.appendChild(addBtn)
        div.appendChild(p2)
  
        el.appendChild(div)  
      }
    } else {
      const div = document.createElement('div')
      div.classList.add('field', 'p-1')
      const p = document.createElement('p')
      p.classList.add('control')
      const btn = document.createElement('button')
      btn.classList.add('button')
      btn.textContent = '+'
      btn.onclick = () => this._addFilter(0)
      p.appendChild(btn)
      div.appendChild(p)
      el.appendChild(div)
    }
  }

  _trigger (name) {
    const filters = []
    const el = this.querySelector('#filters')
    for (let i=0; i<el.children.length; i++) {
      const div = el.children[i]
      if (div.children.length >= 4) {
        filters.push({
          key: div.children[0].querySelector('select').value,
          op: div.children[1].querySelector('select').value,
          val: div.children[2].querySelector('input').value,
          andOr: div.children[3].querySelector('select').value
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
  }

  // filters
  _delFilter (index) {
    this.#filters.splice(index, 1) // console.log('remove filter', index)
    this._renderFilters()
  }
  _addFilter (index) {
    this.#filters.splice(index, 0, { key: this.#filterCols[0].key, label: this.#filterCols[0].label, op: '=', val: '', andOr: 'and' })
    this._renderFilters()
  }
  
  _render() {
    // console.log('bwc-table render fired')
    try {
      const el = this.querySelector('#table-wrapper')
      if (!el) return
      //<tfoot><tr><th><abbr title="Position">Pos</abbr></th>

      let table = el.querySelector('table')
      if (table) {
        // const cNode = table.cloneNode(false)
        // table.parentNode.replaceChild(cNode, table)
        // table.innerHTML = ''
        const parent = el.querySelector('table') // WORKS!
        while (parent.firstChild) {
          parent.firstChild.remove()
        }
        parent.remove()
      }

      if (typeof this.#columns === 'object') {
        // console.log('render thead')
        table = document.createElement('table')
        table.setAttribute('id', 'table')
        el.appendChild(table)
        const thead = document.createElement('thead')
        thead.onclick = (e) => {
          let target = e.target
          if (this.#checkboxes && !target.cellIndex) { // checkbox clicked - target.type === 'checkbox' // e.stopPropagation()?
            this.#checkedRows = [] //  clear first
            const tbody = this.querySelector('table tbody')
            if (tbody && tbody.children) {
              for (let i = 0; i < tbody.children.length; i++) {
                const tr = tbody.children[i]
                const td = tr.firstChild
                if (td) {
                  const checkbox = td.firstChild
                  if (checkbox.type === 'checkbox') {
                    checkbox.checked = target.checked
                    if (target.checked) this.#checkedRows.push(i)
                  }
                }
              }  
            }
            this.dispatchEvent(new CustomEvent('checked', { detail: this.#checkedRows }))
          } else { // sort
            if (!this.sort) return
            const offset = this.#checkboxes ? 1 : 0 //  column offset
            const col = target.cellIndex - offset // TD 0-index based column
            if (!this.#columns[col].sort) return
            const key = this.#columns[col].key

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

            this._trigger('sort') // header is re-rendered,  checkboxes are also cleared...
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
        this.#filterCols = [] // clear this first
        for (const col of this.#columns) {
          const th = document.createElement('th')
          if (col.sort) th.style.cursor = 'pointer'
          let label = col.label
          if (col.sort) {
            if (this.#sortKey === col.key) {
              // &and; (up) & &or; (down)
              label += this.#sortDir === 'asc' ? '↑' : (this.#sortDir === 'desc' ? '↓' : '↕')
            } else {
              label += '↕'
            }  
          }
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
        if (typeof this.#items === 'object' && this.#items.length) {
          // console.log('render tbody')
          const tbody = document.createElement('tbody')
          // TBD function to get checked rows...
          tbody.onclick = (e) => {
            let target = e.target
            if (this.#checkboxes && !target.cellIndex) { // checkbox clicked - target.type === 'checkbox' // e.stopPropagation()?
              if (target.type === 'checkbox') {
                this.#checkedRows = [] //  clear first
                for (let i = 0; i < tbody.children.length; i++) {
                  const tr = tbody.children[i]
                  const td = tr.firstChild
                  if (td) {
                    const checkbox = td.firstChild
                    if (checkbox.type === 'checkbox' && checkbox.checked) {
                      this.#checkedRows.push(i)
                    }
                  }
                }
                this.dispatchEvent(new CustomEvent('checked', { detail: this.#checkedRows }))
              }
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
                  data = { ...this.#items[row] }
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
          for (const [idx, row] of this.#items.entries()) {
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

            for (const col of this.#columns) {
              const { key, sticky, width, render } = col
              const td = document.createElement('td')
              // if (sticky) td.setAttribute('scope', 'row') // not used yet, need to calculate left property value
              if (width) td.style.width = `${width}px`
              if (render) {
                td.innerHTML = render({
                  val: row[key],
                  key,
                  row,
                  idx
                }) // value, key, row - need to sanitize, el (the td element)
              } else {
                td.appendChild(document.createTextNode(row[key]))
              }
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
