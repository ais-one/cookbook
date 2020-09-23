const session = require('express-session')
const MongoStore = require('connect-mongo')(session)

const redis = require('redis')
const RedisStore = require('connect-redis')(session)
const redisClient = redis.createClient()

module.exports = function (app) {
  app.use(session({
    store: new MongoStore({
      // clientPromise: clientInstancePromise,
      // client: clientInstance,
      dbName: 'test-app',
      ttl: 14 * 24 * 60 * 60, // = 14 days. Default
      url: 'mongodb://user12345:foobar@localhost/test-app?authSource=admins&w=1',
      autoRemove: 'native', // Default
      // autoRemove: 'interval', // older mongo version or do not want to use ttl index
      // autoRemoveInterval: 10, // In minutes. Default
      // autoRemove: 'disabled', // production
      mongoOptions: advancedOptions, // See below for details
      touchAfter: 24 * 3600, // time period in seconds
      secret: 'squirrel'
    }),
    secret: 'foo'
  }))

  app.use(
    session({
      store: new RedisStore({
        client: redisClient,
        prefix: 'sess:',
        ttl: 86400, // seconds
        disableTouch: false // Disables re-saving and resetting the TTL when using touch
        // serializer:
        // scanCount:
      }),
      secret: 'keyboard cat',
      resave: false,
    })
  )
}

 
/*
How to log Redis errors?
client.on('error', console.error)
How do I handle lost connections to Redis?
By default, the redis client will auto-reconnect on lost connections. But requests may come in during that time. In Express, one way you can handle this scenario is including a "session check":

app.use(session(... setup session here ...))
app.use(function(req, res, next) {
  if (!req.session) {
    return next(new Error('oh no')) // handle error
  }
  next() // otherwise continue
})
*/