[![npm version](https://badge.fury.io/js/vue-crud-x.svg)](https://badge.fury.io/js/vue-crud-x) [![npm](https://img.shields.io/npm/dm/vue-crud-x.svg)](https://www.npmjs.com/package/vue-crud-x) [![MadeWithVueJs.com shield](https://madewithvuejs.com/storage/repo-shields/823-shield.svg)](https://madewithvuejs.com/p/vue-crud-x/shield-link)

# NOTICES & UPDATES

## 1 Better Quickstart

The **example-rest** folder is now the preferred project for quickstart. Everything runs locally from a sample REST backend included in this repository, no firebase signup/setup required.

Read the following <a href="https://medium.com/@aaronjxz/vue-crud-x-a-highly-customisable-crud-component-using-vuejs-and-vuetify-2b1539ce2054" target="_blank">supporting article</a> (with usage and explanations updated as and when required)

## 2 Major Improvements (Without Breaking Changes)

From Version 0.1.7 onwards, **scoped-slots** can and should be used for customized form and filter. Please use this instead of the previous way of **importing component files** as it is much cleaner. **importing component files** will be deprecated in a later version.

Usage example can be found:
 - in **example-rest** project (see example-rest/README.md on quickstart)
   - example-rest/src/pages/Page.vue
   - example-rest/src/pages/Book.vue
   - example-rest/src/pages/author.js
   - example-rest/src/pages/category.js
 - in **example-firebase** project
   - example-firebase/src/pages/MultiCrud/Example.vue (also, demonstrates multiple vue-crud-x used in a single page)

## 3 Roadmap & Dependencies

We are monitoring the progress of the following packages and will update when they are released for production:
 - VueJS 3
 - Vuetify 2

Roadmap and latest updates can be found on the <a href="https://github.com/ais-one/vue-crud-x/wiki" target="_blank">Wiki</a>

# What Is vue-crud-x

> A VueJS CRUD component which is customisable and extensible to suit more complex situations such as Nested CRUD, custom filters, forms, use of GraphQL or REST to access various datastores. Vuetify is used for frontend UI components but can be changed to alternatives such as ElementUI (with some effort)

The following differentiates vue-crud-x from other CRUD repositories:
 - Able to do nested CRUD operations (parent table call child table),
 - Inline edit, pagination, sorting & filtering
 - Handle authentication tokens, user permissions
 - Customise table, search filter, CRUD form, validation, CRUD operations (e.g. disallow delete, call REST, GraphQL, Firestore, etc.)
 - Auto-configure/generate Search filter, CRUD Form from JSON
 - Export to CSV/JSON, File/Image Upload, i18n

Our examples showcase the following (unrelated to the vue-crud-x features above)
 - in **example-rest**
   - rxJs for cleaner code (auto-complete, debounce, fetch latest)
   - 2FA OTP signin with Google Authenticator
 - in **example-firebase**
   - Use multiple vue-crud-x in single page
   - recaptcha, image capture from webcam

This repository also contains an Express backend server for testing the vue-crud-x component, and has the following features:
 - ObjectionJS + SQLite (Sample SQL DB with 1-1, 1-m, m-n use cases, transactions, migrations, seeders, OpenAPI documentation), Mongo (connect test only)
 - Login, JWT & 2FA OTP (using Google Authenticator)
 - Key-Value Store for user token storage on server (can replace with redis)
 - Websocket (use https://www.websocket.org/echo.html & ngrok to test)


## Example Project List

There are currently 4 example projects for show-casing vue-crud-x:

1. example-rest **(Best for quick start - Please use this to try things out)**
  - everything runs locally
  - you do not need to build and run the backend seperately, the run scripts here will help to build the backend and run it with the frontend
  - https://github.com/ais-one/vue-crud-x/tree/master/example-rest
 
2. example-firebase
  - Serverless backend, using Firebase, need to register and setup
  - real-time updates from Firestore
  - https://github.com/ais-one/vue-crud-x/tree/master/example-firebase

3. example-nuxt
  - NUXT implementation, show case SSR
  - **work in progress, do not use yet**
  - https://github.com/ais-one/vue-crud-x/tree/master/example-nuxt

4. backend 
  - Supporting project backend for **example-rest** and **example-nuxt**
  - https://github.com/ais-one/vue-crud-x/tree/master/backend

Refer to the respective projects README.md files for more information

---

## Usage

### Option 1 Use NPM package

Install it as in NPM package and import it

```
npm i vue-crud-x
```

### Option 2 Use the source file

Just copy the VueCrudX.vue file into your project and include it as a component

### Option 3 Build and Install

If you ever need to build this library from source...

1. Install dependencies

```
npm i
```

2. Build project

```
npm run build
```

The build output can be found in the **dist** folder

3. Publishing to npm (only for repo owner)

```
npm publish
```

4. Or build as local package vue-crud-x

```
npm pack
# A local npm package will be created (e.g. vue-crud-x-?.?.?.tgz file)
# If you want to install without saving to package.json, npm i --no-save vue-crud-x-?.?.?.tgz
```

## What is bad about this CRUD Component

Because of its flexible nature, quite a number of things need to be coded to fit your needs.

However, the good part is that these parts need to be coded anyway and once you find your way around the design, you will be able to quickly create custom CRUD in many of your use cases

# Notes

None at the moment

# Changes

See RELEASE.MD file

---

# vue-crud-x DOCUMENTATION (WIP)

## Properties

Refer to @/pages/Crud/party-inline.js for more description for now...

## Table - crudTable

```
crudTable: {
  saveRow: '#ffaaaa', // add save row button & specify color when row is changed, used with inline edit only and action column
  inlineReload: { // default true, set to false and use snapshot for large firestore dataset (or similar mechanisms where reads are chargeable)
    update: false,
    create: true,
    delete: true
  },
  addrowCreate: [
    {
      field: 'name',
      label: 'Name'
    }
  ], // add button creates new record by adding row, you can specified fields that use needs to pre-enter data,
  // empty array if no need to,
  // false if no need addrowCreate button
  inline: { // editable fields on the table and what type of edit are they
    // fields supported v-text-field, v-select, v-combobox, v-autocomplete, v-textarea, v-date-picker, v-time-picker
    'name': {
      field: 'v-text-field', // v-text-field (blur will update contents if it was changed)
      attrs: {
        type: 'text', // number, email, password
        class: ['caption']
      }
    },
    'remarks': {
      field: 'v-textarea', // edit dialog with v-textarea
      buttons: false
    },
    'languages': {
      field: 'v-select', // select, combobox
      attrs: {
        items: ['French', 'Thai', 'Chinese', 'Bahasa'],
        multiple: true,
        dense: true,
        class: ['caption']
      }
    },
    'created': {
      buttons: true,
      field: 'v-date-picker', // edit dialog with v-date-picker or v-time-picker
      attrs: { }
    },
    'photo': {
      field: 'v-textarea',
      buttons: true
    }
    // base: { field: 'v-btn-toggle', attrs: { }, group: { type: 'v-btn', attrs: { flat: true, block: true }, items: { 'WCP': 'WCP', 'MSP': 'MSP' } } },
  },
  confirmCreate: true, // show operation confirmation dialog flags
  confirmUpdate: true,
  confirmDelete: true,
  // REMOVE THIS, NO LONGER NEEDED: actionColumn: true, // action buttons (edit/delete)on the left most table column
  headers: [
    { text: 'Action', value: '', align: 'center', sortable: false, class: 'pa-1 text-xs-center' }, // IMPORTANT: blank value means it is action column
    { text: 'Party Name', value: 'name' },
    { text: 'Remarks', value: 'remarks', align: 'right', class: 'pa-1', 'cell-class': 'text-xs-right pa-1' }, // align header and cell
    { text: 'Languages', value: 'languages' },
    { text: 'Status', value: 'status' },
    { text: 'Created', value: 'created' },
    { text: 'Photo URL', value: 'photo' }
  ],
  formatters: (value, _type) => {
    if (_type === 'languages') return value.join(',')
    return value
  },
  crudTitle: 'Custom Title',

  onCreatedOpenForm: false, // open form on created - need to have record.id to show info, this is true in cases when you want to go back to the parent form and not parent table
  onRowClickOpenForm: true, // set to false of you do not want row click to open form

  doPage: true, // pagination enabled
  showGoBack: false, // do net show go back button on table
  showFilterButton: true, // show expand filter button on toolbar? if hide means you do not want user to play with the filters

  attrs: {
    // you can add attributes used by the component and customize style and classes
    snackbar: { // v-snackbar Component - null means no snack bar
      bottom: true,
      timeout: 6000
    },
    container: { // v-container Component
      fluid: true,
      class: 'pa-0',
      style: { } // you can add more styles here
    },
    dialog: { // v-dialog Component
      fullscreen: false, // dialog form is not fullscreen
      scrollable: true,
      transition: 'dialog-bottom-transition',
      overlay: false
    },
    form: { // v-form Component
      class: 'grey lighten-3 pa-2',
      'lazy-validation': true
    },
    alert: { // v-alert Component
      color: 'grey',
      icon: ''
    },
    toolbar: { // v-toolbar Component
      height: 48,
      dark: false,
      light: true,
      color: 'grey'
    },
    table: { // v-data-table Component
      dark: false,
      light: true,
      'rows-per-page-items': [2, 5, 10, 20],
      'hide-headers': false,
      'loading-color': '#ff0000'
    },
    button: { // v-btn Component
      dark: false,
      light: true,
      icon: true,
      fab: false
    },
    'v-progress-linear': { // v-progress-linear, can also be v-progress-circular
      class: 'ma-0'
    },
    'edit-indicator-left': '🖊️',
    'edit-indicator-right': '',
    'action-icon': { // for the action column
      small: true,
      class: 'mr-1'
    },
    buttons: {
      // table
      back: { icon: 'reply', label: '' },
      filter: { icon: 'search', label: '', icon2: 'keyboard_arrow_up' },
      reload: { icon: 'replay', label: '' },
      create: { icon: 'add', label: '' },
      export: { icon: 'print', label: '' },
      // form
      close: { icon: 'close', label: '' },
      delete: { icon: 'delete', label: '' },
      update: { icon: 'save', label: '' }
    }
  }
}
```

## Filter - crudFilter

```
crudFilter: {
  FilterVue: null,
  filterData: {
    // fields supported v-text-field, v-select, v-combobox, v-autocomplete, v-textarea, v-date-picker, v-time-picker
    // new way of defining, use attrs
    active: {
      type: 'v-select',
      value: 'active',
      attrs: {
        label: 'Active Status',
        multiple: false,
        items: [ 'active', 'inactive' ], // can be async loaded from db?
        rules: [v => !!v || 'Item is required']
      }
    }
  }
}

```

## Form - crudForm


```
crudForm: {
  FormVue: () => ({ component: import('./PartyForm.vue') }),
  // FormVue: null, // not needed
  formAutoData: { // this is for automated form creation - if undefined use FormVue
    id: { type: 'input', attrs: { hidden: true } }, // need id if there is delete
    name: {
      type: 'v-text-field',
      halfSize: true,
      attrs: {
        label: 'Name',
        rules: [v => !!v || 'Item is required']
      }
    },
    status: {
      type: 'v-select',
      halfSize: true,
      attrs: {
        label: 'Active Status',
        multiple: false,
        items: [ 'active', 'inactive' ], // can be async loaded from db?
        rules: [v => !!v || 'Item is required']
      }
    },
    remarks: {
      type: 'v-textarea',
      attrs: {
        label: 'Remarks'
      }
    },
    photo: { type: 'hidden' },
    languages: { type: 'hidden' }
  },

  defaultRec: () => ({ // you can use function to initialize record as well
    id: '',
    name: '',
    status: 'active',
    remarks: '',
    languages: [],
    created: format(new Date(), 'YYYY-MM-DD HH:mm:ss'), // set value during setRecord() function
    photo: ''
  })
}
```

## CRUD Operations - crudOps

1. user property in payload can be used for authentication, and logging

2. crudOps create, update & delete operation - return object properties

```
{
  msg: if defined and not blank, snackbar will show the string in msg if enabled (msg can be an vue-i18n keystring)
  code: if defined, snackbar will show message based on code number. 200, 201, 509, 500 is handled, other values will show 'unknown operation'
  ok:  is operation success or not, used by inline update to revert data to original value on the table
}
```

The return object and properties are optional, if you do not return, then the following can potentially result:
- no snackbar (you will need to listen to event emitted do your own error display instead)
- value will not revert to original for failed inline update


```
crudOps: {
  'export': {
    const { user } = payload
    ...
    // no return
  },
  create: {
    const { record: { id, ...noIdData }, user } = payload
    ...
    return { // EXAMPLE return object with code property omitted
      ok: true,
      msg: 'OK'
    }
  },
  update: {
    const { record: { id, ...noIdData }, user } = payload
    ...
    return { // EXAMPLE return object with ok property only
      ok: true
    }
  },
  delete: {
    const { id, user } = payload
    ...
    // EXAMPLE no return at all
  },
  find: {
    let records = []
    const { pagination, user } = payload // sort order is in pagination 
    ...
    return { records, pagination }
  },
  findOne: {
    const { id, user } = payload
    let record = { }
    ...
    return record
  }
}
```

## Events

1. **form-open** - emit event if open form, returns selected record

1. **form-close** - emit event if close form

2. **selected** - row selected, returns object with row item and event, does not fire if inline is truthy...

3. **loaded** - table data is loaded, returns Date.now()

4. **created** - emitted in createRecord(), returns { res, payload } (no create ID yet, will be improved)

5. **updated** - emitted in updateRecord(), returns { res, payload }

6. **deleted** - emitted in deleteRecord(), returns { res, payload }

Note: **res** is the result for the C, U, D operation, payload is the payload passed in to the C, U, D operation
