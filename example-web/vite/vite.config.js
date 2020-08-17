// const isDev1 = import.meta.env.MODE === 'development'
// const dev_port1 = import.meta.env.VUE_DEVPORT
module.exports = {
  port: 8080,
  proxy: {
    // string shorthand
    '/foo': 'http://localhost:4567/foo',
    // with options
    '/api': {
      target: 'http://jsonplaceholder.typicode.com',
      changeOrigin: true,
      rewrite: path => path.replace(/^\/api/, '')
    }
  },
  // base: '/',
  // port: dev_port1,
  // sourcemap: isDev1,
  vueCompilerOptions: {
    isCustomElement: tag => tag.startsWith('vaadin-') || tag.startsWith('mwc-') || tag.startsWith('vcxwc-')
  },
  optimizeDeps: {
    include: [
      '@material/mwc-list/mwc-list-item',
      '@material/mwc-list/mwc-check-list-item',
      '@vaadin/vaadin-grid/vaadin-grid-selection-column',
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
