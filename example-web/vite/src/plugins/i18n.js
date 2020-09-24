// i18nPlugin.js
import { ref, provide, inject } from 'vue'

const createI18n = config => ({
  locale: ref(config.locale),
  messages: config.messages,
  $t(key) {
    return this.messages[this.locale.value][key]
  }
})

const i18nSymbol = Symbol()

export function provideI18n(i18nConfig) {
  const i18n = createI18n(i18nConfig)
  provide(i18nSymbol, i18n)
}

export function useI18n() {
  const i18n = inject(i18nSymbol)
  if (!i18n) throw new Error("No i18n provided!!!")
  return i18n
}

// import { provideI18n } from "./i18nPlugin";
// export default {
//   setup() {
//     provideI18n({
//       locale: "en",
//       messages: {
//         en: {
//           hello_world: "Hello world"
//         },
//         es: {
//           hello_world: "Hola mundo"
//         }
//       }
//     })
//   }
// }

// {{ i18n.$t('hello_world') }}
// import { useI18n } from "./i18nPlugin";
// export default {
//   setup() {
//     const i18n = useI18n();
//     i18n.locale.value = 'en' // setting language
//     return { i18n };
//   }
// };