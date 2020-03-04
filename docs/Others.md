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