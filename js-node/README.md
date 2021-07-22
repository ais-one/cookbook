# Description

Projects
- expressjs
  - see [expressjs/README.md](expressjs/README.md)
- openapi-file-joiner
  - utility to join multiple openapi yaml files to a single file to be consumed by openapi ui and validation libraries
- serialserver
  - serial server receive RS232 and send via tcp
    - serialport
    - pkg
    - logging
- tcpserver
  - tcp server - stream (keep client, connected and can reply to client, but need to take note on number of client connections)
    - knex & mysql
  - tcp server - event (close after receiving packet from client)
    - knex & mysql
- wip
  - fido2
  - k8s
  - kafkaRx.js
    - kafka consumer
    - requires kafka to run (see /docker-devenv/kafka)
  - kafkaTx.js
    - kafka producer
    - requires kafka to run (see /docker-devenv/kafka)
  - process-cron.js
  - process-long.js

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
