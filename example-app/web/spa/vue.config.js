const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')

const path = require('path')
const EXT_LIB_PATH = path.join(__dirname, '..', '..', '..', 'common-app') // C:\Users\user\test\vue-crud-x\example-app\web\spa

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
