// const path = require('path')
// const isDev1 = import.meta.env.MODE === 'development'
// const dev_port1 = import.meta.env.VUE_DEVPORT
module.exports = {
  // alias useless... https://github.com/vitejs/vite/issues/279#issuecomment-636110354
  // alias: {
  //   '/@/': path.resolve(__dirname, './lib/') // import aa from '/@/esm/aaa.js'
  // },
  port: 8080,
  proxy: {
    // string shorthand
    // '/esm': 'http://127.0.0.1:3000/esm',
    '/common-lib/esm': {
      target: 'http://127.0.0.1:3000',
      changeOrigin: true,
      rewrite: path => path.replace(/^\/common-lib\/esm/, '/esm')
    }
  },
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
    external: [
      'react', // ignore react stuff
    ]
  }
}

// vueCompilerOptions
// compilerOptions
// app.config.isCustomElement = tag => {
//   console.log('tag', tag)
//   return tag === 'vaadin-button'
// }
