// import.meta is undefined, process.env is not populated with custom values
import vue from '@vitejs/plugin-vue'
export default ({ command, mode }) => {
  // command = serve, build
  const path = require('path')
  const env = require('dotenv').config({ path: path.join(__dirname, '.env.' + mode) }).parsed

  return {
    base: env.BASE_PATH || '/', // set to '/vite' for dev:build, '/' otherwise
    build: {
      // sourcemap: true,
      rollupOptions: {
        // external: [
        //   'react' // ignore react stuff
        // ]
        input: {
          main: path.resolve(__dirname, 'index.html'),
          nested: path.resolve(__dirname, 'nested/index.html')
        }
      }
    },
    optimizeDeps: {
      include: ['echarts', 'leaflet']
    },
    plugins: [
      vue({
        template: {
          compilerOptions: {
            isCustomElement: (tag) => tag.startsWith('bwc-') || tag.startsWith('vcxwc-')
          }
        }
      })
    ],
    resolve: {
      alias: {
        // https://github.com/vitejs/vite/issues/279#issuecomment-636110354
        // '@': path.resolve(__dirname, 'src') // import aa from '@/esm/aaa.js',
        '/@es-labs/esm': require('path').join(__dirname, '..', '..', '@es-labs', 'esm')
      }
    },
    server: {
      port: 8080
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
