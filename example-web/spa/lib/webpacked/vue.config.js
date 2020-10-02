const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
  configureWebpack: {
    module: {
      rules: [
        // ... other rules
        {
          test: /\.vue$/,
          loader: 'vue-loader'
        }
      ]
    },
    plugins: [
      new VueLoaderPlugin()
    ],
    output: {
      libraryExport: 'default'
    }
  },
  productionSourceMap: false,
  css: { extract: false }
}