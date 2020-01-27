
import Vue from 'vue'
import Vuetify, {
  VTextField, VSelect, VAutocomplete, VCombobox, VTextarea
} from 'vuetify/lib'
import { Scroll } from 'vuetify/lib/directives'
import i18n from '../lang'

// import '@mdi/font/css/materialdesignicons.css'

Vue.use(Vuetify, {
  components: {
    VTextField, VSelect, VAutocomplete, VCombobox, VTextarea
  },
  directives: {
    Scroll
  }
})

export default new Vuetify({
  theme: {
    primary: '#1c325f',
    secondary: '#219ad6',
    accent: '#0c74bb',
    info: '#2196f3',
    success: '#a4d6e3',
    error: '#f44336',
    warning: '#ffeb3b'
  },
  lang: {
    t: (key, ...params) => i18n.t(key, params)
  }
})
