import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

// Ready translated locale messages
const messages = {
  en: {
    $vuetify: {
      dataIterator: {
        rowsPerPageText: 'Items per page:',
        rowsPerPageAll: 'All',
        pageText: '{0}-{1} of {2}',
        noResultsText: 'No matching records found',
        nextPage: 'Next page',
        prevPage: 'Previous page'
      },
      dataTable: {
        rowsPerPageText: 'Rows per page:'
      },
      noDataText: 'No data available'
    },
    vueCrudX: {
      actions: 'Actions',
      noData: 'No Data',
      confirm: 'Confirm',
      itemRequired: 'Item is required',
      duplicateError: 'Duplicate Error',
      operationError: 'Operation Error',
      unknownOperation: 'Unknown Operation',
      operationOk: 'OK',
      save: 'Save',
      cancel: 'Cancel',
      pleaseSave: 'Please Save'
    },
    myApp: {
      languages: 'Languages'
    }
  },
  id: {
    $vuetify: {
      dataIterator: {
        rowsPerPageText: 'Item Per Halaman:',
        rowsPerPageAll: 'Semua',
        pageText: '{0}-{1} dari {2}',
        noResultsText: 'Tidak ada catatan yang cocok',
        nextPage: 'Halaman selanjutnya',
        prevPage: 'Halaman sebelumnya'
      },
      dataTable: {
        rowsPerPageText: 'Baris per halaman:'
      },
      noDataText: 'Tidak ada data yang tersedia'
    },
    vueCrudX: {
      actions: 'Actions',
      noData: 'Tidak Ada Data',
      confirm: 'Memastikan',
      itemRequired: 'Item wajib diisi',
      duplicateError: 'Duplicate Error',
      operationError: 'Operation Error',
      unknownOperation: 'Unknown Operation',
      operationOk: 'OK',
      save: 'Save',
      cancel: 'Cancel',
      pleaseSave: 'Please Save'
    },
    myApp: {
      languages: 'Bahasa'
    }
  }
}

// Create VueI18n instance with options
const i18n = new VueI18n({
  locale: 'en', // set locale
  messages, // set locale messages
  silentTranslationWarn: true // hide warnings
})

export default i18n
