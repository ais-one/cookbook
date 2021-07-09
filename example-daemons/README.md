# Description

Projects
- serialserver
  - serial server receive RS232 and send via tcp
    - serialport
    - pkg
    - logging
- tcpserver
  - tcp server
    - knex & mysql

# Useful commands

redirect to a file with date 

```bash
echo abc.java >> logfile.`date +'%Y-%m-%d'`.log
#or
echo abc.java >> "logfile.$(date +'%Y-%m-%d').log"
```
