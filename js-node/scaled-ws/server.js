const WebSocket = require('ws')
const WEB_SOCKET_PORT = process.argv[2] || 3000

const Redis = require("ioredis");
const redisSub = new Redis()

const redisPub = redisSub.duplicate() // new Redis()

// Connect to Redis and subscribe to "app:notifications" channel
// const redisClient = redis.createClient(REDIS_SERVER)
// const subClient = redisClient.duplicate()
// subClient.subscribe('app:notifications')
redisSub.subscribe('app:notifications', (err, count) => {
  if (err) {
    // Just like other commands, subscribe() can fail for some reasons,
    // ex network issues.
    console.error("Failed to subscribe: %s", err.message)
  } else {
    // `count` represents the number of channels this client are currently subscribed to.
    console.log(`Subscribed successfully! This client is currently subscribed to ${count} channels.`)
  }
})

const server = new WebSocket.Server({ port : WEB_SOCKET_PORT })

// Register event for client connection
server.on('connection', function connection(ws) {

  // broadcast on web socket when receving a Redis PUB/SUB Event
  // subClient.on('message', function(channel, message){
  //   console.log(message);
  //   ws.send(message);
  // })

  ws.on('message', (message) => {
    console.log(`${WEB_SOCKET_PORT} incoming message: `, message.toString('utf-8'))
    redisPub.publish('app:notifications', message.toString('utf-8'))
  })

  redisSub.on('message', (channel, message) => {
    // TBD
    // - sent to all other sockets on this server... except message originator client (for chat apps)
    // - sent to all other sockets on this server... including message originator client (if response is an update)
    ws.send(message)
    console.log(`Received ${message} from ${channel}`);
  })
})

console.log(process.argv )
console.log("WebSocket server started at ws://locahost:" + WEB_SOCKET_PORT)
