// import.meta is undefined, process.env is not populated with custom values
import vue from '@vitejs/plugin-vue'

// module.exports = {
export default {
  base: process.env.BASE_PATH || '/', // set to '/vite' for dev:build, '/' otherwise
  // build: {
  //   rollupOptions: { // vite 2
  //     external: [
  //       'react' // ignore react stuff
  //     ]
  //   }  
  // },
  // optimizeDeps: {
  //   include: [
  //   ]
  // },
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: tag => tag.startsWith('bwc-') || tag.startsWith('vcxwc-')
        }
      }
    })
  ],
  server: {
    port: 8080,
  }
}
