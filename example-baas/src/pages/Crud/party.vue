<template>
  <vue-crud-x :parentId="null" v-bind="partyDefs">
    <template v-slot:filter="{ filters, parentId }">
      <my-filter :filters="filters" :parentId="parentId" />
    </template>
    <template v-slot:form="{ record, parentId }">
      <my-form :record="record" :parentId="parentId" />
    </template>
  </vue-crud-x>
</template>

<script>
import { firestore } from '@/firebase' // hasDuplicate
// import { makeCsvRow, exportCsv } from '@/assets/util'
import { format } from 'date-fns'
import VueCrudX from '../../../../src/VueCrudX' // Component shared between projects // const VueCrudX = Vue.component('vue-crud-x') this does not work...
import MyFilter from './Filter'
import MyForm from './PartyForm'
import { crudOps as partyCrudOps } from './party-common'

// import {app} from '@/main' // to use store, router, i18n, etc...
// import i18n from '@/lang' // to use store, router, i18n, etc...

// console.log(app, i18n, i18n.messages[i18n.locale])

export default {
  components: {
    VueCrudX,
    MyFilter,
    MyForm
  },
  data: () => ({
    partyDefs: {
      crudTable: {
        actionColumn: false,
        addrowCreate: false,
        // inline: false,
        confirmCreate: true,
        confirmUpdate: true,
        confirmDelete: true,
        headers: [
          { text: 'Party Name', value: 'name', class: 'pa-1' },
          { text: 'Status', value: 'status', class: 'pa-1' }
        ],
        formatters: (value, _type) => value,
        doPage: false,
        buttons: {
          // table
          back: { icon: 'reply', label: 'Back' },
          filter: { icon: 'search', label: 'Search', icon2: 'keyboard_arrow_up' },
          reload: { icon: 'replay', label: 'Reload' },
          create: { icon: 'add', label: 'Add' },
          export: { icon: 'print', label: 'Export' },
          // form
          close: { icon: 'close', label: 'Close' },
          delete: { icon: 'delete', label: 'Delete' },
          update: { icon: 'save', label: 'Save' }
        }
      },
      filters: {
        languages: {
          // this will be deprecated
          type: 'v-select',
          value: '',
          attrs: {
            label: 'Languages', // i18n.messages[i18n.locale].myApp.languages, // 'Languages', NOT WORKING... DOES NOT CHANGE
            multiple: false,
            rules: [],
            items: []
          },
          itemsFn: async () => {
            let records = []
            try {
              const rv = await firestore.collection('languages').limit(10).get() // create index
              rv.forEach(record => {
                let tmp = record.data()
                records.push(tmp.name)
              })
            } catch (e) { }
            return records
          }
        },
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
      },
      crudForm: {
        // defaultRec: {
        //   id: '',
        //   name: '',
        //   status: 'active',
        //   remarks: '',
        //   languages: [],
        //   created: '' // set value in the create() function
        //   photo: ''
        // }
        defaultRec: () => ({ // you can use function to initialize record as well
          id: '',
          name: '',
          status: 'active',
          remarks: '',
          languages: [],
          created: format(new Date(), 'YYYY-MM-DD HH:mm:ss'), // set value during setRecord() function
          photo: ''
        })
      },
      crudOps: partyCrudOps
    }
  })
}
</script>
