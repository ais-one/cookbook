// const isDev1 = import.meta.env.MODE === 'development'
// import.meta is undefined, process.env is not populated with custom values
import vue from '@vitejs/plugin-vue'
// const EXT_ESM_PATH = require('path').join(__dirname, '..', 'common-lib', 'esm')

// module.exports = {
export default {
  alias: {
    // https://github.com/vitejs/vite/issues/279#issuecomment-636110354
    // '/@/': path.resolve(__dirname, './lib/') // import aa from '/@/esm/aaa.js'
    // '/common-lib/esm/': EXT_ESM_PATH
  },
  base: process.env.BASE_PATH || '/', // set to '/vite' for dev:build, '/' otherwise
  build: {
    // rollupOptions: { // vite 2
    //   external: [
    //     'react' // ignore react stuff
    //   ]
    // }  
  },
  // optimizeDeps: {
  //   include: [
  //   ]
  // },
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
    //   '/common-lib/esm': {
    //     target: 'http://127.0.0.1:3000',
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/common-lib\/esm/, '/esm')
    //   }
    // },
  }
}
