// poi.config.js
module.exports = {
  entry: './src/VueCrudX.vue',
  output: {
    dir: 'dist',
    fileNames: {
      js: 'VueCrudX.js'
    },
    html: false,
    format: 'cjs',
    sourceMap: false
  },
  // filename: {
  //   js: 'VueCrudX.js'
  //   // css: 'vue-crud-x.css'
  // },
  css: {
    extract: false
  }
  // extractCSS: false
}