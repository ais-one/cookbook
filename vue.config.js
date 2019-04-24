module.exports = {
  configureWebpack: {
    output: {
      filename: () => '[name].js'
    }
  },
  css: { extract: false }
}