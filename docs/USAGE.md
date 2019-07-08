
Begin The Journey

npm i -D sass-loader node-sass sass fibers deepmerge
npm i -D vuetify-loader
npm install @mdi/font -D

vue.config.js

const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')

module.exports = {
  configureWebpack: {
    plugins: [
      new VuetifyLoaderPlugin()
    ]
  }
}

---
crud operations payload 'user' - removed (set JWT outside instead) 
merge 'crudForm.defaultRec' & 'crudForm.formAutoData' to 'form'

# Version 0.2.0  API

refetch
optimistic

```js

const v2 = {
  parentId: null,

  // Vuetify properties
  vtable: {
    // Describe the table header here
    headers: { // this is important
      ...
      // additional properties
      render: value => value // how to display the data
      edit: { // null // inline editable TBD more input types for the cell editor
        type: null //  type of edit control
        props: null // properties for the edit control
      }
      action: { // column is an action column
        edit: true,
        delete: true
      }
    }
  }

  // configure button icons and labels
  buttons: {
    back: { icon: 'reply', label: '' },
    filter: { icon: 'search', label: '', icon2: 'keyboard_arrow_up' },
    reload: { icon: 'replay', label: '' },
    create: { icon: 'add', label: '' },
    export: { icon: 'print', label: '' },
    close: { icon: 'close', label: '' },
    delete: { icon: 'delete', label: '' },
    update: { icon: 'save', label: '' }
  }

  // inject properties for action column buttons
  actionicon: { small: true, class: 'mr-1' },

  // inject properties for v-form (used by filter and by CRUD form)
  vform: {
  }
  // inject properties for v-btn (the button style)
  vbtn: {
  }
  // inject properties for v-toolbar
  vtoolbar: {
  }
  // inject properties for container
  vcontainer: { // TBD remove this???
  }
  // Vuetify properties



  pagination: {
    // VARIATION - Start Vuetify2
    page: 1,
    itemsPerPage: 2,
    sortBy: [],
    sortDesc: []
    // totalItems: 0 // completely useless at the moment
    // VARIATION - End Vuetify2
  },
  sorters: {
    // VARIATION - Start Vuetify 2
    // Not Used In Vuetify
    // VARIATION - End Vuetify 2
  },
  pageDefaults: { // page options
    // VARIATION - Start Vuetify2
    start: 1,
    itemsPerPage: 2,
    sortBy: [],
    sortDesc: []
    // VARIATION - End Vuetify2
  },
  sortDefaults: {
    // VARIATION - Start Vuetify 2
    // Not Used In Vuetify
    // VARIATION - End Vuetify 2
  },

  idName: 'id', // the id field name usually  'id', for mongo its '_id',
  infinite: false, // infinite scroll
  inline: { create: false, update: false, delete: false },
  selectedId: null,
  // refetch: false, // do refetch after C U D?
  // optimistic: true, // optimistic UI

  options: {
    crudTitle: '', // title
    showGoBack: true, // hide go back button - default true
    showFilterButton: true // show filter button - default true
  },

  filters: {
    'name': { // field
      // supported types: v-text-field, v-select
      // types to test: v-combobox, v-autocomplete, v-textarea, v-date-picker, v-time-picker
      type: 'v-text-field', // component name
      value: '',
      'field-wrapper': { xs12: true, sm6: true },
      'field-input': {
        label: 'Author', clearable: true
      }
    }
    ...
  }

  form: {
    'id': { // field
      // supported types: v-text-field, v-select
      // types to test: v-combobox, v-autocomplete, v-textarea, v-date-picker, v-time-picker
      type: 'v-text-field',
      value: '',
      default: '',
      hidden: 'add', // add, edit, all, null
      readonly: 'all', // add, edit, all, null
      validation: null, // validation function no in place yet
      'field-wrapper': { xs12: true, sm6: true },
      'field-input': {
        label: 'ID'
      }
    },
  }

  // overridable CRUD operations
  crud: {
    find: async ({parentId, filters, pagination, sorters}) => {
      return { status: 500, data: { records = [], totalRecords = 0, cursor = '' }, error: null }
    },
    findOne: async (id) => {
      return { status = 500, data = null, error = null }
    },
    update: async ({ record }) => {
      return { status = 500, data = null, error = null }
    },
    create: async ({ record }) => {
      return { status = 500, data = null, error = null }
    },
    delete: async (id) => {
      return { status = 500, data = null, error = null }
    },
    export: async ({parentId, filters, pagination, sorters}) => {
      return { status = 500, data = null, error = null }
    }),

    ws: null, // websocket operation, not implemented currently
  }

  // overrideable methods - see source for defaults 

  // override row click event
  onRowClick(item, $event) { } // clicking a row

  // override confirmation, return true to confirm, false to abort
  confirmCreate() { }
  confirmUpdate() { }
  confirmDelete() { }

  // override post create, update, delete action
  updated({ record }) { } // override after successful update method
  created({ record }) { } // override after successful creation method
  deleted(id) { } // override after successful deletion method

  // override notification called after each crud operation
  notifyCreate({ status, error }) { }
  notifyUpdate({ status, error }) { }
  notifyDelete({ status, error }) { }
  notifyExport({ status, error }) { }
  notifyFindOne({ status, error }) { }
  notifyFind({ status, error }) { }
}

```

## Events

### @form-open

Emitted when CRUD form is open

Properties emitted:
- this.form

### @form-close

#mitted when CRUD form closes

Properties emitted:
- none


## Named Scoped SLots

### progress

Scope Properties:
- vcx: access to the component itself

### table-toolbar

Scope Properties:
- vcx: access to the component itself

### filter

Scope Properties:
- filters: access to filters
- parentId: access to parentId (if any)
- vcx: access to the component itself

### table

Scope Properties:
  - records: the records found
  - totalRecords: to total unpaged records
  - pagination: the pagination object
  - vcx: access to the component itself

### td

Scope Properties:
  - headers: table headers
  - item: the record item
  - vcx: access to the component itself

### form-toolbar

Scope Properties:
  - vcx: access to the component itself

### form

Scope Properties:
  - record: the selected record
  - parentId: access to parentId (if any)
  - vcx: access to the component itself



---

# TO FIX

## In Progress


1. page, sort events, reloads, post crud & default methods - TOTEST

### Fired by pager & sorter - **done**
change page
 - paged: page change
 - infinite: page change (is load more operation, increment record count)
change limit
 - paged: page start, filters same, sort same
 - infinite: page start
change sortBy / sortDesc
 - paged: page same, filters same, sort change
 - infinite: page start
filters & sort follow





ISSUE: https://github.com/vuetifyjs/vuetify/issues/7657
FIXED: https://github.com/vuetifyjs/vuetify/pull/7665

ISSUE: https://github.com/apollographql/apollo-server/issues/2921
FIXED: https://github.com/apollographql/apollo-server/pull/2924






---

### fired by user **done**
reload
 - paged: page start
 - infinite: page start
filters & sort follow

### Fired by crud
update record
 - paged: just update in memory
 - infinite: just update in memory
create record
 - paged: page start, filters start, sort start
 - infinite: as above - because cursor may not be valid
delete record
 - paged: page change (if remainder 1, reduce page by 1), filters same, sort same
 - infinite: page start, filters start, sort start - because cursor may not be valid


- delete
 * paginate form
   * paginate inline
 * infinite form
   * infinite inline
reset filter and sort, goto page 1 ?

- insert
 * paginate form
   * paginate inline
 * infinite form (createTableRow)
   * infinite inline
reset filter and sort, goto page 1 ?

- update (no reload needed...)
 * paginate form (updated)
   * paginate inline (updated)
 * infinite form (updated)
   * infinite inline (updated)

2. firm up events
3. real-time updates...
4. if delete need to unrelate from Book Author
5. make better attributes...
