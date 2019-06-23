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

# V2 Work

refetch
optimistic

```js

const v2 = {
  idName: 'id', // the id field name usually  'id', for mongo its '_id',
  refetch: false, // do refetch after C U D?
  optimistic: true, // optimistic UI

  filters: {

  }

  form: {

  }

  // operations
  find: null,
  findOne: null,
  update: null,
  create: null,
  remove: null,
  export: null,
  ws: null, // websocket operation?

  parentId: null
}

```

## Events
updated - can be pass or fail
created - can be pass or fail
deleted - can be pass or fail
pagination - pagination update
filter - filter update
form-open
form-close





      <template v-if="isEnabled('item.<name>')" v-slot:item.name="{ item }">
        {{ item.name.toUpperCase() }}
      </template>

      <template v-slot:item.name="{ item }">
        {{ item.name.toUpperCase() }}
      </template>