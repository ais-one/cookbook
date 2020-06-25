const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')

const EXT_LIB_PATH = require('path').join(__dirname, '..', '..', '..', 'common-lib') // C:\Users\user\test\vue-crud-x\example-app\web\spa

module.exports = {
  configureWebpack: {
    plugins: [
      new VuetifyLoaderPlugin()
    ],
    resolve: {
      alias: { 'ext-lib': EXT_LIB_PATH },
      modules: [EXT_LIB_PATH]
    },
    resolveLoader: {
      modules: [EXT_LIB_PATH]
    }
  }
}
