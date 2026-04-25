(async () => {
  const path = require('node:path');
  console.log('To be called by cron', __filename);
  await require('@ais-one/node/config')(path.join(process.cwd(), '..', 'services')); //  first thing to run
  console.log('Its better for cron call an API than to run this');
  console.log('unless this is long running job');
})();
