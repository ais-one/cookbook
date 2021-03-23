// https://phrase.com/blog/posts/detecting-a-users-locale/
// https://gist.github.com/ashour/5f169a6dd9b6293691629ee0d06cae6f
// get languages / locales from browser
// sample output: ['en-US', 'en-GB']

function getBrowserLocales(options = {}) {
  const defaultOptions = {
    languageCodeOnly: false
  }
  const opt = {
    ...defaultOptions,
    ...options
  }
  const browserLocales = navigator.languages === undefined ? [navigator.language] : navigator.languages
  if (!browserLocales) {
    return undefined
  }
  return browserLocales.map((locale) => {
    const trimmedLocale = locale.trim()
    return opt.languageCodeOnly ? trimmedLocale.split(/-|_/)[0] : trimmedLocale
  })
}

export default getBrowserLocales
