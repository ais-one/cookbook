const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')

const EXT_LIB_PATH = require('path').join(__dirname, 'lib') // C:\Users\user\test\vue-crud-x\example-webpack\lib
const EXT_ESM_PATH = require('path').join(__dirname, '..', '@es-labs', 'esm') // C:\Users\user\test\vue-crud-x\@es-labs\esm

module.exports = {
  publicPath: '/webpack/',
  configureWebpack: {
    plugins: [
      new VuetifyLoaderPlugin()
    ],
    resolve: {
      alias: {
        'ext-lib': EXT_LIB_PATH,
        'ext-esm': EXT_ESM_PATH
      },
      modules: [EXT_LIB_PATH, EXT_ESM_PATH]
    },
    resolveLoader: {
      modules: [EXT_LIB_PATH, EXT_ESM_PATH]
    }
  }
}
