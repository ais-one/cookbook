module.exports = {
  configureWebpack: {
    output: {
      libraryExport: 'default'
    }
  },
  productionSourceMap: false,
  css: { extract: false }
}