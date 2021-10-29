# NodeJS Notes

- https://github.com/goldbergyoni/nodebestpractices
- https://github.com/thedaviddias/Front-End-Checklist
- https://frontendchecklist.io/

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

### OAuth2/OAuth Setups
- http://thecodebarbarian.com/github-oauth-login-with-node-js.html
- https://dev.to/aidanlovelace/how-to-setup-google-oauth2-login-with-express-2d30
- https://www.sohamkamani.com/blog/javascript/2018-06-24-oauth-with-node-js
- https://www.loginradius.com/blog/async/oAuth-implemenation-using-node

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


## SSE

- https://www.digitalocean.com/community/tutorials/nodejs-server-sent-events-build-realtime-app

## NPM corruption
1. delete node_modules
2. delete package-lock.json ???
3. npm cache clean --force

## NPM wierdness

1. pre and post on package.json scipts

package.json
{
  "scripts": {
    "abc:xyz": "echo 1",
    "preabc:xyz": "echo 2",
    "postabc:xyz": "echo 3",
    "qweabc:xyz": "echo 4"
  }
}

What is the output for

npm run abc:xyz

2. editing on library file on vs-code

  "dependencies": {
    "@es-labs/esm": "file:../@es-labs/esm",
    "@es-labs/node": "file:../@es-labs/node",

If you edit the file in ../@eslabs/..., it will also be changed the installed node_modules

## Shutdown

- NodeJS app & express
  - https://shapeshed.com/uncaught-exceptions-in-node/
  - https://www.joyent.com/node-js/production/design/errors
  - https://blog.heroku.com/best-practices-nodejs-errors
  - https://expressjs.com/en/advanced/healthcheck-graceful-shutdown.html
- signals: http://man7.org/linux/man-pages/man7/signal.7.html
- node signal events: https://nodejs.org/dist/latest-v11.x/docs/api/processhtml#process_signal_events
- kubernetes shutdown: https://cloud.google.com/blog/products/gcp/kubernetes-best-practices-terminating-with-grace


## performance

- https://blog.logrocket.com/optimize-node-js-performance-with-clustering/
- https://blog.logrocket.com/customizing-node-js-env-files/
- [../../js-node/workerthreads]

