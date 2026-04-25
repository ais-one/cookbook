export default {
  apps: [
    // dev, not needed
    {
      // production
      name: 'api',
      script: './index.js', // path relative to calling package.json
      output: './logs/api-out.log',
      error: './logs/api-error.log',
      log_type: 'json',
      env_production: { NODE_ENV: 'production' },
    },
  ],
};
