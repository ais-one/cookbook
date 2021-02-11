// const isDev1 = import.meta.env.MODE === 'development'
// import.meta is undefined, process.env is not populated with custom values
import vue from '@vitejs/plugin-vue'

// module.exports = {
export default {
  alias: {
    // https://github.com/vitejs/vite/issues/279#issuecomment-636110354
    // '/@/': path.resolve(__dirname, './lib/') // import aa from '/@/esm/aaa.js'
    '/lib/esm/': require('path').join(__dirname, '..', 'lib', 'esm')
  },
  base: process.env.BASE_PATH || '/', // set to '/vite' for dev:build, '/' otherwise
  build: {
    // sourcemap: isDev1,
    rollupOptions: { // vite 2
      external: [
        'react' // ignore react stuff
      ]
    }  
  },
  optimizeDeps: {
    include: [
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
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: tag => tag.startsWith('bwc-') || tag.startsWith('vaadin-') || tag.startsWith('mwc-') || tag.startsWith('vcxwc-') || tag.startsWith('sl-')
        }
      }
    })
  ],
  server: {
    port: 8080,
    // proxy: { // use alias instead
    //   // '/esm': 'http://127.0.0.1:3000/esm', // does not seem to work
    //   '/lib/esm': {
    //     target: 'http://127.0.0.1:3000',
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/lib\/esm/, '/esm')
    //   }
    // },
  }
}
