# Version 0.2.0 API Documentation

refetch
optimistic

##  Props

### parentId

type: String

default: null




## Injected Properties - Vuetify Components

You can customise the look and feel by passing in styling and other properties based on the vuetify components supported.

This will be different if another UI framework is used.

Refer to vue-crud-x (VueCrudX.vue) source file for the default settings.


### vtable

inject properties for v-datatable except the following properties
- items
- server-items-length
- options.sync
- hide-default-footer
- item-key
- headers


#### vtable headers field

Take note of the headers object. It is important for describing the columns and its behaviour.

It is specific to Vuetify 2, for other frameworks. This may be different.

```js
vtable: {
  // Describe the table header here
  headers: { // this is important
    ...
    // additional properties
    render: value => value // how to display the data
    edit: { // null // inline editable TBD more input types for the cell editor
      type: null //  type of edit control - e.g. v-text-field
      props: null // properties related to the type of edit control - 
    }
    action: true // column is an action column
  }
}
```


### vform

inject properties for v-form (used by filter and by CRUD form)

### vbtn

inject properties for v-btn (the button style)

### vtoolbar

inject properties for v-toolbar

### vcontainer (may be removed as it may not be necessary)

inject properties for container

### actionicon

inject properties for action column buttons

default

```js
{ small: true, class: 'mr-1' }
```

### buttons

configure button icons and labels

default

```js
{
  back: { icon: 'reply', label: '' },
  filter: { icon: 'search', label: '', icon2: 'keyboard_arrow_up' },
  reload: { icon: 'replay', label: '' },
  create: { icon: 'add', label: '' },
  export: { icon: 'print', label: '' },
  close: { icon: 'close', label: '' },
  delete: { icon: 'delete', label: '' },
  update: { icon: 'save', label: '' }
}
```

## Paging And Sorting Properties

### pagination:

Contains pagination object data for Vuetify 2.

Properties can be different if using other UI frameworks

default:

```js
{
  page: 1,
  itemsPerPage: 2,
  sortBy: [],
  sortDesc: []
}
```

### sorters

Not used in Vuetify 2, as pagination objection includes sorting. May be used in other UI frameworks

```js
{

}
```

### pageDefaults

Contains pagination object default values for Vuetify 2.

Properties can be different if using other UI frameworks

default:

```js
{
  start: 1,
  itemsPerPage: 2,
  sortBy: [],
  sortDesc: []
}
```

### sortDefaults
Not used in Vuetify 2, as pagination objection includes sorting. May be used in other UI frameworks

```js
{

}
```


## General Properties

### idName

the id field name usually 'id', for mongo its '_id',

default: 'id'

### infinite

is table infinite scroll or paged

default: false

### inline

indicate which inline operations are supported

default: 

```js
{
  create: false,
  update: false,
  delete: false
}
```

### title

title for the vue-crud-x component

default: ''



## Filter Fields Configuration

supported types: v-text-field, v-select

types to test: v-combobox, v-autocomplete, v-textarea, v-date-picker, v-time-picker

```js
filters: {
  'name': { // filter parameter name
    type: 'v-text-field', // component name
    value: '',
    'field-wrapper': { xs12: true, sm6: true },
    'field-input': {
      label: 'Author', clearable: true
    }
  },
  'startDate': { // filter parameter name
    type: 'v-text-field', // component name
    value: '',
    'field-wrapper': { xs12: true, sm6: true },
    'field-input': {
      label: 'Start Date', type: 'date'
    }
  }
  // Add More Fields...
}
```


## Form Fields Configuration

supported types: v-text-field, v-select

types to test: v-combobox, v-autocomplete, v-textarea, v-date-picker, v-time-picker

```js
form: {
  'id': { // field name
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
  // Add More Fields...
}
```

## CRUD Operations

customize your CRUD operations

```js
crud: {
  find: async ({parentId, filters, pagination, sorters}) => {
    // Add you own code here
    return { status: 500, data: { records = [], totalRecords = 0, cursor = '' }, error: null }
  },
  findOne: async (id) => {
    // Add you own code here
    return { status = 500, data = null, error = null }
  },
  update: async ({ record }) => {
    // Add you own code here
    return { status = 500, data = null, error = null }
  },
  create: async ({ record }) => {
    // Add you own code here
    return { status = 500, data = null, error = null }
  },
  delete: async (id) => {
    // Add you own code here
    return { status = 500, data = null, error = null }
  },
  export: async ({parentId, filters, pagination, sorters}) => {
    // Add you own code here
    return { status = 500, data = null, error = null }
  }),
  ws: null, // websocket operation, NOT IMPLEMENTED YET
}
```

## Overridable Functions

### Row Click

override row click event

default is do nothing

```js
onRowClick(item, $event) { }
```

### Action Confirmation

override confirmation feedback

default is show confirm popup

return true to confirm, false to abort


```js
confirmCreate() { }
confirmUpdate() { }
confirmDelete() { }
```

### Post Create, Update Delete Action

override post create, update, delete action

```js
updated({ record }) { }
created({ record }) { }
deleted(id) { }
```

## Notifications

override notification called after each crud operation

default is to popup alert message

```js
notifyCreate({ status, error }) { }
notifyUpdate({ status, error }) { }
notifyDelete({ status, error }) { }
notifyExport({ status, error }) { }
notifyFindOne({ status, error }) { }
notifyFind({ status, error }) { }
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


## Scoped SLots

Use scoped slots to customise the look and feel of the various sub-components in vue-crud-x

The slots available are named:
- progress
- table-toolbar
- filter
- table
- td
- form-toolbar
- form

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

crud operations payload 'user' - removed (set JWT outside instead) 
merge 'crudForm.defaultRec' & 'crudForm.formAutoData' to 'form'



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
