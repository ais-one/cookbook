import Vue from 'vue'
// import Vuetify from 'vuetify'
// import colors from 'vuetify/es5/util/colors'

import Vuetify, {
  VTextField, VSelect
} from 'vuetify/lib'
// import i18n from '../lang'


// Vue.use(Vuetify)
// Vue.use(Vuetify, {
//   theme: {
//     primary: '#121212', // a color that is not in the material colors palette
//     accent: colors.grey.darken3,
//     secondary: colors.amber.darken3,
//     info: colors.teal.lighten1,
//     warning: colors.amber.base,
//     error: colors.deepOrange.accent4,
//     success: colors.green.accent3
//   }
// })

import '@mdi/font/css/materialdesignicons.css'

Vue.use(Vuetify, {
  components: {
    VTextField, VSelect
  }
})

// export default new Vuetify({
//   theme: {
//     primary: '#1c325f',
//     secondary: '#219ad6',
//     accent: '#0c74bb',
//     info: '#2196f3',
//     success: '#a4d6e3',
//     error: '#f44336',
//     warning: '#ffeb3b'
//   },
//   lang: {
//     t: (key, ...params) => i18n.t(key, params)
//   }
// })
