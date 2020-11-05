const template = document.createElement('template')
template.innerHTML = `
<div id="table-wrapper">
</div>
`

class Table extends HTMLElement {
  // properties
  #items = []
  #columns = []
  #page = 1 // one based index
  #pageSize = 10
  #pageSizeList = []
  #checks = [] // checkboxes

  // #sortKey = ''
  // #sortDir = '' // blank, asc, desc
  #checkEnabled = true

  // internal
  #selectedIndex = -1
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

      if (typeof this.columns === 'object') {
        console.log('render thead')
        const table = document.createElement('table')
        table.addEventListener('click', this.rowClick)
        el.appendChild(table)
        const thead = document.createElement('thead')
        thead.onclick =  (e) => {
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
          tbody.onclick =  (e) => {
            const data = {}
            let target = e.target
            if (this.#checkEnabled && !target.cellIndex) { // checkbox clicked - target.type === 'checkbox' // e.stopPropagation()?

            } else {
              const offset = this.#checkEnabled ? 1 : 0 //  column offset
              const col = target.cellIndex - offset // TD 0-index based column

              while (target && target.nodeName !== "TR") {
                target = target.parentNode
              }
              const row = target.rowIndex - 1 // TR 1-index based row
              if (target) {
                const cells = target.getElementsByTagName("td")
                for (let i = offset; i < cells.length; i++) {
                  const key = this.columns[i - offset].key
                  data[key] = cells[i].innerHTML
                }
              }
              // TBD highlight selected row
              // TBD when to unselect highlighted row
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
