import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

// Ready translated locale messages
const messages = {
  en: {
    $vuetify: {
      close: 'Close',
      dataIterator: {
        pageText: '{0}-{1} of {2}',
        noResultsText: 'No matching records found',
        loadingText: 'Loading items...'
      },
      dataTable: {
        itemsPerPageText: 'Rows per page:',
        ariaLabel: {
          sortDescending: ': Sorted descending. Activate to remove sorting.',
          sortAscending: ': Sorted ascending. Activate to sort descending.',
          sortNone: ': Not sorted. Activate to sort ascending.'
        },
        sortBy: 'Sort By'
      },
      dataFooter: {
        pageText: '{0}-{1} of {2}',
        itemsPerPageText: 'Items per page:',
        itemsPerPageAll: 'All',
        nextPage: 'Next page',
        prevPage: 'Previous page',
        firstPage: 'First page',
        lastPage: 'Last page'
      },
      datePicker: {
        itemsSelected: '{0} selected'
      },
      noDataText: 'No data available',
      carousel: {
        prev: 'Previous visual',
        next: 'Next visual'
      }
    },
    vueCrudX: {
      noData: 'No Data',
      confirm: 'Confirm',
      itemRequired: 'Item is required',
      more: 'Load More'
    },
    myApp: {
      languages: 'Languages'
    }
  },
  id: {
    $vuetify: {
      close: 'Close',
      dataIterator: {
        pageText: '{0}-{1} dari {2}',
        noResultsText: 'Tidak ada catatan yang cocok',
        loadingText: 'Loading items...'
      },
      dataTable: {
        itemsPerPageText: 'Baris per halaman:',
        ariaLabel: {
          sortDescending: ': Sorted descending. Activate to remove sorting.',
          sortAscending: ': Sorted ascending. Activate to sort descending.',
          sortNone: ': Not sorted. Activate to sort ascending.'
        },
        sortBy: 'Sort By'
      },
      dataFooter: {
        pageText: '{0}-{1} of {2}',
        itemsPerPageText: 'Item per Halaman:',
        itemsPerPageAll: 'Semua',
        nextPage: 'Halaman selanjutnya',
        prevPage: 'Halaman sebelumnya',
        firstPage: 'First page',
        lastPage: 'Last page'
      },
      datePicker: {
        itemsSelected: '{0} selected'
      },
      noDataText: 'Tidak ada data yang tersedia',
      carousel: {
        prev: 'Previous visual',
        next: 'Next visual'
      }
    },
    vueCrudX: {
      noData: 'Tidak Ada Data',
      confirm: 'Memastikan',
      itemRequired: 'Item wajib diisi',
      more: 'Load More'
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
  silentTranslationWarn: true
})

export default i18n
