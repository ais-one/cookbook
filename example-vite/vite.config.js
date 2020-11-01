// const path = require('path')
// const isDev1 = import.meta.env.MODE === 'development'
// const dev_port1 = import.meta.env.VUE_DEVPORT
module.exports = {
  // alias useless... https://github.com/vitejs/vite/issues/279#issuecomment-636110354
  // alias: {
  //   '/@/': path.resolve(__dirname, './lib/') // import aa from '/@/esm/aaa.js'
  // },
  port: 8080,
  // proxy: {
  //   // string shorthand
  //   '/foo': 'http://localhost:4567/foo',
  //   // with options
  //   '/api': {
  //     target: 'http://jsonplaceholder.typicode.com',
  //     changeOrigin: true,
  //     rewrite: path => path.replace(/^\/api/, '')
  //   }
  // },
  // base: '/',
  // sourcemap: isDev1,
  vueCompilerOptions: {
    isCustomElement: (tag) => tag.startsWith('vaadin-') || tag.startsWith('mwc-') || tag.startsWith('vcxwc-') || tag.startsWith('sl-')
  },
  optimizeDeps: {
    include: [
      // '@material/mwc-icon/mwc-icon-font',
      '@material/mwc-list/mwc-list-item',
      '@material/mwc-list/mwc-check-list-item',
      '@vaadin/vaadin-grid/vaadin-grid-selection-column',
      '@vaadin/vaadin-grid/vaadin-grid-sort-column',
      'echarts',
      'leaflet',
      '@apollo/client/core',
      '@apollo/client/cache',
      '@apollo/client/link/ws',
      '@apollo/client/link/context',
      '@apollo/client/utilities'
    ]
  },
  rollupInputOptions: {
    // ignore react stuff
    external: ['react']
  }
}

// vueCompilerOptions
// compilerOptions
// app.config.isCustomElement = tag => {
//   console.log('tag', tag)
//   return tag === 'vaadin-button'
// }
