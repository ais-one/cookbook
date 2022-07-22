'use strict'

// {
//   port: 6379,
//   host: '127.0.0.1',
//   family: 4, // 4 (IPv4) or 6 (IPv6)
//   password: 'auth',
//   db: 0,
//   // if using sentinels
//   // sentinels: [{ host: 'localhost', port: 26379 }, { host: 'localhost', port: 26380 }],
//   // name: 'mymaster',
// }
// var availableSlaves = [{ ip: '127.0.0.1', port: '31231', flags: 'slave' }]
// var preferredSlaves = [ { ip: '127.0.0.1', port: '31231', prio: 1 }, { ip: '127.0.0.1', port: '31232', prio: 2 } ]
// // preferredSlaves function format
// preferredSlaves = function(availableSlaves) {
//   for (var i = 0; i < availableSlaves.length; i++) {
//     var slave = availableSlaves[i]
//     if (slave.ip === '127.0.0.1' && slave.port === '31234') return slave
//   }
//   // if no preferred slaves are available a random one is used
//   return false
// }
// var redis = new Redis({
//   sentinels: [{ host: '127.0.0.1', port: 26379 }, { host: '127.0.0.1', port: 26380 }],
//   name: 'mymaster',
//   role: 'slave',
//   preferredSlaves: preferredSlaves
// })

const Redis = require('ioredis')

module.exports = class StoreRedis {
	constructor() {
    this.REDIS_CONFIG = process.env.REDIS_CONFIG
    this.redis = null
  }

  open () {
    const redisOpts = this.REDIS_CONFIG.opts
    if (this.REDIS_CONFIG.retry) redisOpts.retryStrategy = (times) => Math.min(times * this.REDIS_CONFIG.retry.step, this.REDIS_CONFIG.retry.max)
    if (this.REDIS_CONFIG.reconnect) redisOpts.reconnectOnError = (err) => err.message.includes(this.REDIS_CONFIG.reconnect.targetError) ? true : false
    this.redis = new Redis(redisOpts)
  }

  get () { return this.redis }
  close () {
    if (this.redis) {
      this.redis.disconnect()
      this.redis = null  
    }   
  }
}

module.exports = redis
