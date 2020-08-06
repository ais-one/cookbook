// const isDev1 = import.meta.env.MODE === 'development'
// const dev_port1 = import.meta.env.VUE_DEVPORT
module.exports = {
  // base: './',
  // port: dev_port1,
  // sourcemap: isDev1,
  port: 8080,
  vueCompilerOptions: {
    isCustomElement: tag => tag.startsWith('vaadin-') || tag.startsWith('mwc-')
  },
  optimizeDeps: {
    include: [
      '@material/mwc-list/mwc-list-item',
      'vega',
      'vega-lite',
      'vega-embed',
      'echarts',
      'leaflet'
    ]
  }
}

// vueCompilerOptions
// compilerOptions
// app.config.isCustomElement = tag => {
//   console.log('tag', tag)
//   return tag === 'vaadin-button'
// }
