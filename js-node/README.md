# Description

Below are a list of NodeJS applications

- dbdeploy
  - see [dbdeploy/README.md](expressjs/README.md)
- expressjs
  - see [expressjs/README.md](expressjs/README.md)
- jsdoc-ts
  - see [jsdoc-ts/README.md](jsdoc-ts/README.md) may eventually replace swagger-jsdoc-swagger
- scaled-ws
  - how to scale websockets using Redis (or some other) PubSub
- serialserver
  - serial server receive RS232 and send via tcp, use pkg to build binary, winston logging
- services
  - tcp_server - stream (keep client, connected and can reply to client, but need to take note on number of client connections) or event (close after receiving packet from client)
    - knex & mysql
  - kafkaRx.js
    - kafka consumer
    - requires kafka to run (see /docker-devenv/kafka)
  - kafkaTx.js
    - kafka producer
    - requires kafka to run (see /docker-devenv/kafka)
  - process-cron.js
  - process-long.js
- worker-threads
  - how to use worker threads

## 

To test out

```
cd js-node/services

# Command to simulate long running process (do take note of caveats, for production need a monitor to handle restart strategy)
# command: npm run process-long -- development
npm run process-long

# Command to simulate process triggered by cron (**NOTE:** may be better to use cron to call API than trigger a process)
# command: npm run process-cron -- development
npm run process-cron
```




# Useful commands

redirect to a file with date 

```bash
echo abc.java >> logfile.`date +'%Y-%m-%d'`.log
#or
echo abc.java >> "logfile.$(date +'%Y-%m-%d').log"
```

Null Modem Emulator
https://sourceforge.net/projects/com0com/

TCP
https://gist.github.com/sid24rane/2b10b8f4b2f814bd0851d861d3515a10
