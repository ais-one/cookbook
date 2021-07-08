/* eslint-disable */
// TCP server
const net = require('net')
const port = 4000
const host = '0.0.0.0'


let sockets = []
let dbReady = false

const knex = require('knex')({
  client: 'mysql',
  connection: {
    host : 'ls-8d106a4d1735c947d98ee24733aefbdb793b65f7.cplamvbmuewb.ap-southeast-1.rds.amazonaws.com',
    user : 'dbmasteruser',
    password : '[|a=D5a2SX8k%di+0Y9X~8=u3UpeP)uT',
    database : 'dbmaster'
  }
})
knex.raw('select 1+1 as result').then(() => {
  dbReady = true
  console.log('db connected')
  // processData('test')
}).catch(err => { console.log('DB error: ' + err.toString()) })


const server = net.createServer()
server.listen(port, host, () => {
  console.log('TCP Server is running on port ' + port + '.')
})

const utcOffsetHours = (new Date().getTimezoneOffset()) / 60

const processData = (data) => {
  data = '162,727.75,11243960,6,1.3523782,103.7447128,0.00,0.00,0.00,0.00,0.00,0.00,0.00,,0,1,1,1,0,18.90,18.90,4964' // testing
  const data_a = data.split(',')
  if (data_a.length === 22) {
    let [serial, Time, GPS_Time, Sat, Latitude, Longitude, Speed, Roll, Pitch, Z_Rate, Accx, Accy, RPM, Gear_Ratio, Calc_gear, Clutch, Front_Brake, Rear_Brake, Engine_Brake, Foot_Right, Foot_Left, checksum] = data_a
    const hh = parseInt(GPS_Time.substring(0, 2))
    const mm = parseInt(GPS_Time.substring(2, 4))
    const ss = parseInt(GPS_Time.substring(4, 6))
    const dss = parseInt(GPS_Time.substring(6, 8))

    // transform and insert
    const Timestamp = new Date()
    Timestamp.setUTCHours(hh)
    Timestamp.setUTCMinutes(mm)
    Timestamp.setUTCSeconds(ss)
    Timestamp.setUTCMilliseconds(dss * 10)
    if (hh >= (24 + utcOffsetHours)) Timestamp.setDate(Timestamp.getDate() -1)
    console.log(Timestamp.toLocaleString())

    const transform = { serial, Timestamp, Time, GPS_Time, Sat, Latitude, Longitude, Speed, Roll, Pitch, Z_Rate, Accx, Accy, RPM, Gear_Ratio, Calc_gear, Clutch, Front_Brake, Rear_Brake, Engine_Brake, Foot_Right, Foot_Left, checksum }

    // Returns [1] in "mysql", "sqlite", "oracle"; [] in "postgresql" unless the 'returning' parameter is set.
    knex('sensordata').insert(transform).then((rv) => console.log(rv)).catch(e => console.error(e.toString()))
    // try {
    // } catch (e) {
    //   console.log(e.toString())
    // }
  }
}

server.on('connection', (sock) => {
  console.log('CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort)

  sockets.push(sock)

  // sock.setEncoding('utf8')
  sock.on('data', (data) => {
    console.log('DATA ' + sock.remoteAddress + ': ' + data)
    if (dbReady) {
      processData(data)
    }
    // Write the data back to all the connected, the client will receive it as data from the server
  })

  // Add a 'close' event handler to this instance of socket
  sock.on('close', (data) => {
    let index = sockets.findIndex((o) => {
      return o.remoteAddress === sock.remoteAddress && o.remotePort === sock.remotePort
    })
    if (index !== -1) sockets.splice(index, 1)
    console.log('CLOSED: ' + sock.remoteAddress + ' ' + sock.remotePort)
  })

  sock.on('error', () => console.log('Socket error'))
})

server.on('close',function(){
  console.log('Server closed 2')
})

const errorTypes = ['unhandledRejection', 'uncaughtException']
const signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2']

errorTypes.forEach(type => {
  process.on(type, async e => {
    try {
      console.log(`process.on ${type}`)
      console.error(e)
      return process.exit(0)
    } catch (_) {
      return process.exit(1)
    }
  })
})

signalTraps.forEach(type => {
  process.once(type, async () => {
    try {
      console.log('Signal Trap', type)
      for (let socket of sockets) socket.destroy()
      // server.close()
      server.close(function () {
        console.log('server closed')
        server.unref()
      })
      // await consumer.disconnect()
      console.log('end')
    } finally {
      // Do not call this as need time to close the server...
      // process.kill(process.pid, type)
    }
    return
  })
})




// https://gist.github.com/sid24rane/2b10b8f4b2f814bd0851d861d3515a10