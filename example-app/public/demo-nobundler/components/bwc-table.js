// TBD add pagination
// TBD custom render columns

// search (show hide filter), refresh, add, delete, upload, download, goback (if parentKey != null), loading
const template = document.createElement('template')
template.innerHTML = `
<div id="table-wrapper">
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <a id="aa" role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>
    <div id="navbarBasicExample" class="navbar-menu">
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
          <a class="button is-primary">&larr;</a>
          <div class="select"> 
            <select>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </div>
          <input class="input" type="number" min="1" max="10" style="width: auto;"/>
          <a class="button is-light">&rarr;</a>
        </div>
      </div>
    </div>
  </nav>

</div>
`

class Table extends HTMLElement {
  // properties
  #items = []
  #columns = []
  #page = 1 // one based index
  #pageSize = 10
  #pageSizeList = [5, 10, 15]
  #checks = [] // checkboxes

  // #sortKey = ''
  // #sortDir = '' // blank, asc, desc
  #checkEnabled = true

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
      console.log('ffff')
      // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
      document.querySelector('#aa').classList.toggle('is-active') // navbar-burger
      document.querySelector('#navbarBasicExample').classList.toggle('is-active') // navbar-menu
      console.log('ggg')
    }
    console.log('connectedCallback 0')
    this.render()
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

  get items() {
    return this.#items
  }

  set items(val) {
    console.log('set items 0', this.columns && this.columns.length)
    this.#items = val
    console.log('set items 1')
    // if columns do something
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

  _trigger () {
    this.dispatchEvent(new CustomEvent('triggered', {
      detail: {
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

            this._trigger()
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
