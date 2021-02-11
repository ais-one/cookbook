// const isDev1 = import.meta.env.MODE === 'development'
// import.meta is undefined, process.env is not populated with custom values
import vue from '@vitejs/plugin-vue'

// module.exports = {
export default {
  alias: {
    // https://github.com/vitejs/vite/issues/279#issuecomment-636110354
    // '/@/': path.resolve(__dirname, './lib/') // import aa from '/@/esm/aaa.js'
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
  }
}
