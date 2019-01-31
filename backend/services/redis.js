const Redis = require('ioredis')
const redis

if (!redis) {
  redis = new Redis({
    port: 6379,          // Redis port
    host: '127.0.0.1',   // Redis host
    family: 4,           // 4 (IPv4) or 6 (IPv6)
    password: 'auth',
    db: 0,

    // if using sentinels
    // sentinels: [{ host: 'localhost', port: 26379 }, { host: 'localhost', port: 26380 }],
    // name: 'mymaster',

    // This is the default value of `retryStrategy`
    retryStrategy: function (times) {
      var delay = Math.min(times * 50, 2000)
      return delay
    },
    maxRetriesPerRequest: 20,
    autoResubscribe: true, // default
    // autoResendUnfulfilledCommands: true,
    reconnectOnError: function (err) {
      var targetError = 'READONLY'
      if (err.message.slice(0, targetError.length) === targetError) {
        // Only reconnect when the error starts with "READONLY"
        return true // or `return 1`
      }
    }
  })

}
/*
var availableSlaves = [{ ip: '127.0.0.1', port: '31231', flags: 'slave' }]
var preferredSlaves = [ { ip: '127.0.0.1', port: '31231', prio: 1 }, { ip: '127.0.0.1', port: '31232', prio: 2 } ]

// preferredSlaves function format
preferredSlaves = function(availableSlaves) {
  for (var i = 0; i < availableSlaves.length; i++) {
    var slave = availableSlaves[i]
    if (slave.ip === '127.0.0.1' && slave.port === '31234') return slave
  }
  // if no preferred slaves are available a random one is used
  return false
}

var redis = new Redis({
  sentinels: [{ host: '127.0.0.1', port: 26379 }, { host: '127.0.0.1', port: 26380 }],
  name: 'mymaster',
  role: 'slave',
  preferredSlaves: preferredSlaves
})
*/

module.exports = redis