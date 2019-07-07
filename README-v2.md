1.

https://github.com/vuetifyjs/vuetify/releases/tag/v2.0.0-beta.0

2.
a-la-carte vuetify loader...

3.
slot & activator

4.
VBtn:
The flat prop is now text
The round prop is now rounded
No longer has explicit margin

search in v-btn... ' flat' to ' text'


5.
VChip:
value no longer controls visibility. input event emitted when clicking
the selected prop is now input-value or v-model
close is now click:close

6.
VDataIterator/VDataTable:
disable-initial-sort has been removed. Neither component initially sorts data anymore. Use sort-by or options props to sort.

filter prop has been removed. Instead use custom-filter. This was done in an effort to make custom filtering less confusing.

pagination prop has been removed. Instead use options prop.

total-items prop has been renamed to server-items-length

hide-actions prop has been renamed to hide-default-footer. Also it no longer changes the visible items per page

Props related to the default footer have been move to the footer-props prop. These are:

prev-icon

next-icon

rows-per-page-items now renamed to items-per-page-options

rows-per-page-text now renamed to items-per-page-text

7.
VDataTable:
hide-header has been renamed to hide-default-header
select-all has been renamed to show-select. This will also render a checkbox on each item row as long as you are not defining your own scoped item row.
Props related to the default header have been moved to the header-props prop. These are:
sort-icon

9.
VFooter:
Now has explicit padding to match other similar MD components. Can be removed with the padless prop or a helper class, class="pa-0"

---

10.
VList:
many components have been renamed
<v-list-tile> -> <v-list-item> et al (anything -tile is now -item)
<v-list-tile-sub-title> -> <v-list-item-subtitle>
The avatar prop has been removed

11.
VListGroup:
Can no longer use <v-list-item>'s in the activator slot
listeners on <v-list-group> are now passed through to the internal v-list-item for activators
use <v-list-item-content> and <v-list-item-title> instead



Begin The Journey


npm i -D sass-loader node-sass sass fibers deepmerge

npm i -D vuetify-loader

vue.config.js

const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')

module.exports = {
  configureWebpack: {
    plugins: [
      new VuetifyLoaderPlugin()
    ]
  }
}

npm install @mdi/font -D

Remove stylus

---


Moving to Vuetify 2 has many bloody breaking changes. I have decided to reduce dependancy on as much components as possible...
And try to may it more generic for other frameworks

Somethings You May Need To Change

persPerPage -> itemsPerPage

hide-headers -> hide-default-headers


Move vuex store out of the component, but allow user to access and store the info elsewhere...
 - filter settings
 - current pagedata
 - emit an event...

TBD remove snackbar, emit event

crudTable
- formatters - removed

permissions now on backend

properties removed:
- hasFilterVue
- FilterVue
- FormVue
- doPage

crudFilter.filterData -> filter

- hasFormVue
- hasFilterData
- formAutoData
- record
- defaultRec

Form - property type changed to field
Filter - property type changed to field

store & storename - removed

crud operations payload 'user' - removed (set JWT outside instead) 

merge 'crudForm.defaultRec' & 'crudForm.formAutoData' to 'form'


getRecordsHelper -> getRecords


# V2 Work

refetch
optimistic

```js

const v2 = {
  idName: 'id', // the id field name usually  'id', for mongo its '_id',
  refetch: false, // do refetch after C U D?
  optimistic: true, // optimistic UI

  pageOpts: {
    infinite: false, // infinite scroll
    page: 1, // initial page
    limit: 2
  },
  inline: {
    add: false,
    edit: false
  }
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

  // overridable CRUD operations
  crud: {
    find: async ({parentId, filters, pagination, sorters}) => {
      this.$emit { status, error }
      notifyFind { status, error }
    },
    findOne: async (id) => {
      this.$emit { status, error }
      notifyFindOne { status, error }
    },
    update: async ({ record }) => {
      this.$emit { status, error, data: record } // updated record, table or form record?
      notifyUpdate { status, error }
    },
    create: async ({ record }) => {
      this.$emit { status, error, data: record } // new record, table fields (NOT form fields) must match
      notifyCreate { status, error }
    },
    delete: async (id) => {
      this.$emit { status, error, data: id }
      notifyDelete { status, error }
    },
    export: async ({parentId, filters, pagination, sorters}) => {
      this.$emit { status, error }
      notifyExport { status, error }
    }),
    parentId: null,

    ws: null, // websocket operation, not implemented currently
  }

  // overridable functions - see source for defaults 
  onRowClick(item, $event) { } // clicking a row
  updated({ record }) { } // override after successful update method
  created({ record }) { } // override after successful creation method
  deleted(id) { } // override after successful deletion method
  confirmCreate() { } // override confirmation, return true to confirm, false to abort
  confirmUpdate() { } // override confirmation, return true to confirm, false to abort
  confirmDelete() { } // override confirmation, return true to confirm, false to abort
  notifyCreate({ status, error }) { } // override notifications
  notifyUpdate({ status, error }) { }
  notifyDelete({ status, error }) { }
  notifyExport({ status, error }) { }
  notifyFindOne({ status, error }) { }
  notifyFind({ status, error }) { }
}

```

## Events

@row-selected

emitted when row clicked

properties emitted: { item, event }

@form-open

emitted when CRUD form is open this.form

@form-close

emitted when CRUD form closes

@ops-find

emitted after a find CRUD operation

{ status, error }

@ops-findone

{ status, error }

@ops-update

{ status, error, data }

@ops-create

{ status, error, data }

@ops-delete

{ status, error, data }

@ops-export

{ status, error }


## Named Scoped SLots

**progress**
  - vcx: access to the component itself

**table-toolbar**
  - vcx: access to the component itself

**filter**
  - filters: access to filters
  - parentId: access to parentId (if any)
  - vcx: access to the component itself

**table**
  - records: the records found
  - totalRecords: to total unpaged records
  - pagination: the pagination object
  - vcx: access to the component itself

**td**
  - headers: table headers
  - item: the record item
  - vcx: access to the component itself

**form-toolbar**
  - vcx: access to the component itself

**form**
  - record: the selected record
  - parentId: access to parentId (if any)
  - vcx: access to the component itself




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





# DESIGN CONSIDERATIONS
1. reload & optimization strategy
2. real-time updating
3. inline update improvements
4. more modular design
5. interoperability with multiple UI frameworks
6. improvement on protocol
7. events
8. overridable methods with defaults

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
