module.exports = {
  // configureWebpack: config => {
  //   console.log(config)
  //   if (process.env.NODE_ENV === 'production') {
  //     // mutate config for production...
  //   } else {
  //     // mutate for development...
  //   }
  // },
  // configureWebpack: {
  //   output: {
  //     library: 'someLibName',
  //     libraryTarget: 'umd',
  //     filename: 'abc.js'
  //   }
  // },
  configureWebpack: {
    output: {
      libraryExport: 'default'
    }
  },
  productionSourceMap: false,
  css: { extract: false }
}