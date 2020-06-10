module.exports = {
  apps : [
    // dev, not needed
    // production
    {
      name      : 'api',
      script    : 'common-app/index.js',
      output    : 'example-app/logs/api-out.log',
      error     : 'example-app/logs/api-error.log',
      log_type  : 'json',
      env_production : { NODE_ENV: 'production' }
    }
  ]
  /*
  deploy : {
    production : {
      user : 'node',
      host : '212.83.163.1',
      ref  : 'origin/master',
      repo : 'git@github.com:repo.git',
      path : '/var/www/production',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
  */
};
