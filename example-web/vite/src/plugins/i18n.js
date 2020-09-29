// i18n.js
// Improvement use polyglot,  lazy load language?

import { ref, provide, inject } from 'vue'

const createI18n = config => ({
  locale: ref(config.locale),
  messages: config.messages,
  $t(key) {
    return this.messages[this.locale.value] && this.messages[this.locale.value][key] ? 
      this.messages[this.locale.value][key] : key
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
