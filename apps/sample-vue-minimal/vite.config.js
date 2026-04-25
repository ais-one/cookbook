import { loadEnvFile } from 'node:process';
import vue from '@vitejs/plugin-vue';

export default ({ command, mode }) => {
  // command = serve, build
  loadEnvFile(`.env.${mode}`);
  return {
    define: {
      __VUE_PROD_DEVTOOLS__: false,
    },
    base: process.env.BASE_PATH || '/', // set to '/vite' for dev:build, '/' otherwise
    plugins: [vue()],
    root: '.',
    server: {
      host: '127.0.0.1',
      port: 8081,
    },
  };
};
