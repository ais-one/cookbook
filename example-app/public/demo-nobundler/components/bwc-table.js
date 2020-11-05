const template = document.createElement('template')
template.innerHTML = `
<div id="table-wrapper">
</div>
`

class Table extends HTMLElement {
  // properties
  #items = []
  #columns = []
  #pageSize = 10
  #page = 1 // one based index
  #checks = [] // checkboxes

  #sortKey = ''
  #sortDir = '' // blank, asc, desc

  #checkEnabled = true

  // #sort

  // methods

  // events
  onRowClick (e) {
    console.log('onRowClick', e)
  }
  onCheck (e) {
  }

  constructor() {
    super()
    this.input = this.input.bind(this)
  }

  connectedCallback() {
    console.log('connected callback')
    // console.log(this.value, this.required, typeof this.required)
    this.appendChild(template.content.cloneNode(true))

    // const el = this.querySelector('input')
    // el.addEventListener('input', this.input)

    // el.value = this.value
    // if (this.required !== null) el.setAttribute('required', '')
    // this.setList(this.items)
    console.log(this.columns)
    console.log(this.items)
    this.render()
    // if ((this.#columns && this.#items)
  }

  disconnectedCallback() {
    // const el = this.querySelector('input')
    // el.removeEventListener('input', this.input)
  }

  attributeChangedCallback(name, oldVal, newVal) {
    // console.log('attributeChangedCallback', name, oldVal, newVal, typeof newVal)
    const el = this.querySelector('input')
    const dd = this.querySelector('datalist')
    switch (name) {
      case 'value': {
        if (el) el.value = newVal
        const event = new CustomEvent('input', { detail: newVal })
        this.dispatchEvent(event)
        break
      }
      case 'items': {
        if (!dd) return
        this.setList(newVal)
        break
      }
      case 'required':
        if (el) el.setAttribute('required', newVal)
        break
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
    this.#items = val
    // do something
  }

  get columns() {
    return this.#columns
  }

  set columns(val) {
    this.#columns = val
    // do something
  }

  render() {
    try {
      const el = document.querySelector('#table-wrapper')

      //<tfoot><tr><th><abbr title="Position">Pos</abbr></th>

      if (typeof this.columns === 'object') {
        console.log('render column')
        const table = document.createElement('table')
        table.addEventListener('click', this.rowClick)
        el.appendChild(table)
        const thead = document.createElement('thead')
        thead.onclick =  (e) => {
          let target = e.target
          if (this.#checkEnabled && !target.cellIndex) { // checkbox clicked - target.type === 'checkbox' // e.stopPropagation()?

          } else { // sort
            const offset = this.#checkEnabled ? 1 : 0 //  column offset
            const col = target.cellIndex - offset // TD 0-index based column
            const key = this.columns[col].key
            if (key !== this.sortKey) {
              this.sortKey = key
              this.sortVal = 'asc'
              // TBD update header?
            } else {
              if (this.sortVal === 'asc') {
                this.sortVal = 'desc'
                // TBD update header?
              } else if (this.sortVal === 'desc') {
                this.sortKey = ''
                this.sortVal = ''
                // TBD update header?
              }
            }
            console.log('sort', col, this.columns[col].key, this.sortKey, this.sortVal)
          }
        }

        table.appendChild(thead)
        const tr = document.createElement('tr')
        thead.appendChild(tr)

        if (this.#checkEnabled) { // check all
          const th = document.createElement('th')

          const checkbox = document.createElement('input'); 
          checkbox.type = 'checkbox' // value 

          th.appendChild(checkbox)
          tr.appendChild(th)
        }
        for (const col of this.columns) {
          const th = document.createElement('th')
          th.appendChild(document.createTextNode(col.label))
          tr.appendChild(th)
        }

        // populate the data
        if (typeof this.items === 'object' && this.items.length) {
          const tbody = document.createElement('thead')
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

  input(e) {
    const el = this.querySelector('input')
    this.value = el.value
    if (!this.list.includes(this.value)) {
      const event = new CustomEvent('search', { detail: this.value })
      this.dispatchEvent(event)  
    }
  }

  setList(items) { // private
    const itema = items && items.split(',')
    if (!itema || !itema.length) return
    // console.log('setList', items.length, items)
    const dd = this.querySelector('datalist')
    this.list = []
    while(dd.firstChild) {
      dd.removeChild(dd.lastChild)
    }
    itema.forEach((item) => {
      const li = document.createElement('option')
      const val = typeof item === 'string' ? item : item.key
      li.innerHTML = val
      dd.appendChild(li)
      this.list.push(val)
    })
  }
}

customElements.define('bwc-table', Table)
