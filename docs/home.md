
# Technical Debt Reduction

- try to use as little libraries/dependencies as possible

- use native NodeJS or Javascript
  - vee-validate from version 2 to 3 broke many things, might as well stick with HTML5 validation
  - momentjs is too big, date-fns from version 1 to 2 broke things, use native JS Date Object, Intl.DateTimeFormat, etc. instead
  - nuxt-auth could not handle 2FA or refresh token so cannot be used


# Deployment And Scaling

See [deployment.md](deployment.md) - WORK IN PROGRESS

# Mongo DB

[mongodb/home.md](mongodb/home.md)


---

# NodeJS Notes

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

## App Design Considerations

https://12factor.net/


Always Learning. Always Work In Progress

> https://www.udemy.com/nodejs-the-complete-guide/learn/v4/t/lecture/12198026?start=0
> https://www.udemy.com/nodejs-the-complete-guide/learn/v4/t/lecture/12198028?start=0
> https://www.udemy.com/nodejs-the-complete-guide/learn/v4/t/lecture/12198030?start=0


# ExpressJS Notes

Do not rely on req object, e.g. putting mongo, redis, etc. objects in req as you may also need them in websockets

Do not add to app object because app is not global and needs to be exported for other modules to use


## Logging & Application Performance Monitoring

Choose to do in application or hand-off to 3rd party

https://github.com/expressjs/morgan
https://github.com/winstonjs/winston - use console.log / console.error and send to streams instead
https://blog.heroku.com/best-practices-nodejs-errors
https://itnext.io/nodejs-logging-made-right-117a19e8b4ce
https://www.coreycleary.me/should-you-use-a-logging-framework-or-console-log-in-node/

https://googleapis.dev/nodejs/logging-winston/latest/index.html


## Proxying, Compression, Rate-Limiting

Choose to do in application or use Nginx / Apache, or API gateway

https://github.com/chimurai/http-proxy-middleware
https://github.com/nfriedly/express-rate-limit
https://github.com/nfriedly/express-slow-down

## Security

### JWT
- http://self-issued.info/docs/draft-ietf-oauth-v2-bearer.html#ExAccTokResp
- https://stackoverflow.com/questions/42917170/setting-the-httponly-attribute-for-the-nodejs-cookie-header


### Express Libraries For Security
- helmet (to configure), csurf
- url-regex, path-to-regexp (to filter paths)

### JWT, HTTPONLY REFRESH TOKEN
- auto refresh
- revokable (requires state)
- support HttpOnly cookies

### CORS
- support cross origin requests


## Libraries Of Note (not used currently)

qrcode
cron
ioredis
uuid
busboy, formidable

## Message Queues
- https://github.com/agenda/agenda - mongodb
- https://github.com/OptimalBits/bull - redis
- https://github.com/taskforcesh/bullmq - redis


## SQL
- https://dev.to/helenanders26/sql-series-from-a-to-z-2pk9
- https://dev.to/helenanders26/sql-series-speed-up-your-queries-with-indexes-3c83
- https://dev.to/helenanders26/sql-series-all-about-sql-joins-15ol
- https://dev.to/helenanders26/sql-301-why-you-need-sql-window-functions-part-1-6e1
- https://dev.to/helenanders26/sql-301-why-you-need-sql-window-functions-part-2-2nmj


## NPM corruption
1. delete node_modules
2. delete package-lock.json ???
3. npm cache clean --force
