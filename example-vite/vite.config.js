// import.meta is undefined, process.env is not populated with custom values
import vue from '@vitejs/plugin-vue'
export default ({ command, mode }) => {
  // command = serve, build
  // mode = development, staging, production
  // console.log(command, mode)
  const path = require('path')
  const env = require('dotenv').config({ path: path.join(__dirname, '.env.' + mode) }).parsed
  console.log('env.BASE_PATH', env.BASE_PATH)

  return {
    base: env.BASE_PATH || '/', // set to '/vite' for dev:build, '/' otherwise
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
            isCustomElement: tag => tag.startsWith('bwc-') || tag.startsWith('mwc-') || tag.startsWith('vcxwc-') || tag.startsWith('sl-')
          }
        }
      })
    ],
    resolve: {
      alias: {
        // https://github.com/vitejs/vite/issues/279#issuecomment-636110354
        // '@': path.resolve(__dirname, 'src') // import aa from '@/esm/aaa.js',
        '/@es-labs/esm/': require('path').join(__dirname, '..', '@es-labs', 'esm')
      }
    },
    server: {
      port: 8080,
      // proxy: { // use alias instead
      //   // '/esm': 'http://127.0.0.1:3000/esm', // does not seem to work
      //   '/@es-labs/esm': {
      //     target: 'http://127.0.0.1:3000',
      //     changeOrigin: true,
      //     rewrite: (path) => path.replace(/^\/@es-labs\/esm/, '/esm')
      //   }
      // },
    }
  }
}
