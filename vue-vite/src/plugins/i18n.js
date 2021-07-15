// i18n.js
// Improvement use polyglot,  lazy load language?

import { ref, provide, inject } from 'vue'

const _createI18n = (config) => ({
  locale: ref(config.locale),
  messages: config.messages,
  $t(key) {
    return this.messages[this.locale.value] && this.messages[this.locale.value][key] ? this.messages[this.locale.value][key] : key
  }
})

const I18nSymbol = Symbol('I18nSymbol')

export function provideI18n(i18nConfig) {
  const i18n = _createI18n(i18nConfig)
  provide(I18nSymbol, i18n)
}

export function useI18n() {
  const i18n = inject(I18nSymbol)
  if (!i18n) throw new Error('No i18n provided!!!')
  return i18n
}
