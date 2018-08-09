import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

// Ready translated locale messages
const messages = {
  en: {
    vueCrudX: {
      noData: 'No Data',
      confirm: 'Confirm',
      itemRequired: 'Item is required'
    },
    myApp: {
      languages: 'Languages'
    }
  },
  id: {
    vueCrudX: {
      noData: 'Tidak Ada Data',
      confirm: 'memastikan',
      itemRequired: 'Item wajib diisi'
    },
    myApp: {
      languages: 'Bahasa'
    }
  }
}

// Create VueI18n instance with options
const i18n = new VueI18n({
  locale: 'en', // set locale
  messages // set locale messages
})

export default i18n
