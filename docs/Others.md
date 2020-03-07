## JWT
- http://self-issued.info/docs/draft-ietf-oauth-v2-bearer.html#ExAccTokResp
- https://stackoverflow.com/questions/42917170/setting-the-httponly-attribute-for-the-nodejs-cookie-header

## Technical Debt
- try to use as little libraries/dependencies as possible
- use native NodeJS or Javascript
  - vee-validate from version 2 to 3 broke many things, might as well stick with HTML5 validation
  - momentjs is too big, date-fns from version 1 to 2 broke things, use native JS Date Object, Intl.DateTimeFormat, etc. instead
  - nuxt-auth could not handle 2FA or refresh token so cannot be used


## Local (without docker)

WSL Ubuntu
- SQLite
- MongoDB
- Redis
- bullmq
- agenda.js

## Google Cloud

0. Download and install Google Cloud SDK
1. create project
2. add users
3. create service keys
4. setup cloud storage
5. setup Mongo Atlas on Google Cloud
https://cloud.google.com/appengine/docs/standard/nodejs/quickstart
https://cloud.google.com/memorystore/docs/redis
https://www.mongodb.com/cloud/atlas
https://cloud.google.com/pubsub/docs


## Node Modules Singleton

### Method 1

```js
// modules.js
exports.init = (init) => {
  console.log(init)
  return this
}
exports.myMethod = () => console.log('Has access to this')
```

```js
// index.js
var mod = require('./module.js').init('test'); //Prints 'test'
mod.myMethod(); // Will print 'Has access to this.'
```

### Method 2 - Or you could use a constructor

```js
// modules.js
module.exports = function(config) {
  this.config = config
  this.myMethod = () => console.log('Has access to this')
  return this
}
```

```js
// index.js
var myModule = require('./module.js')(config)
myModule.myMethod() // Prints 'Has access to this'
```





# NodeJS

## App Design Considerations

https://12factor.net/


Always Learning. Always Work In Progress

> https://www.udemy.com/nodejs-the-complete-guide/learn/v4/t/lecture/12198026?start=0
> https://www.udemy.com/nodejs-the-complete-guide/learn/v4/t/lecture/12198028?start=0
> https://www.udemy.com/nodejs-the-complete-guide/learn/v4/t/lecture/12198030?start=0

## Do in application or hand-off to 3rd party

### Logging
https://github.com/expressjs/morgan
https://github.com/winstonjs/winston - use console.log / console.error and send to streams instead
https://blog.heroku.com/best-practices-nodejs-errors
https://itnext.io/nodejs-logging-made-right-117a19e8b4ce
https://www.coreycleary.me/should-you-use-a-logging-framework-or-console-log-in-node/

https://googleapis.dev/nodejs/logging-winston/latest/index.html


## Proxying, Compression, Rate-Limiting

https://github.com/chimurai/http-proxy-middleware
https://github.com/nfriedly/express-rate-limit
https://github.com/nfriedly/express-slow-down

- or use Nginx / Apache, or API gateway

## Security

### Express Libraries For Security
- helmet (to configure)
- url-regex, path-to-regexp (to filter paths)

### JWT, HTTPONLY REFRESH TOKEN
- auto refresh
- revokable (requires state)
- support HttpOnly cookies

### CORS
- support cross origin requests


## SCALING & DEPLOYMENT

TBD

## Libraries Of Note

qrcode
cron
ioredis
uuid
csurf
helmet

## Message Queues
https://github.com/agenda/agenda - mongodb
https://github.com/OptimalBits/bull - redis
https://github.com/taskforcesh/bullmq - redis
