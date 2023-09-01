'use strict'

let knex = null
let dbReady = false

module.exports = {
  open: async () => {
    if (!knex) {
      knex = require('knex')({
        client: 'mysql',
        connection: {
          host : process.env.DB_HOST,
          user : process.env.DB_USER,
          password : process.env.DB_PASS,
          database : process.env.DB_NAME
        }
      })
      //NOSONAR try {
      //   knex.raw('select 1+1 as result')
      //   dbReady = true
      // } catch (e) {
      //   console.log('DB error: ' + err.toString())
      // }
      knex.raw('select 1+1 as result').then(() => {
        dbReady = true
        console.log('db connected')
      }).catch(err => { console.log('DB error: ' + err.toString()) })      
    }
  },

  onData: (data, client, server) => {
    if (!dbReady) return
    //NOSONAR console.log('processData', data, typeof data)
    // data = '162,727.75,11243960,6,1.3523782,103.7447128,0.00,0.00,0.00,0.00,0.00,0.00,0.00,,0,1,1,1,0,18.90,18.90,4964' // testing
    const data_a = data.toString('utf8').split(',')
    if (data_a.length === 22) {
      let [serial, Time, GPS_Time, Sat, Latitude, Longitude, Speed, Roll, Pitch, Z_Rate, Accx, Accy, RPM, Gear_Ratio, Calc_gear, Clutch, Front_Brake, Rear_Brake, Engine_Brake, Foot_Right, Foot_Left, checksum] = data_a
      //NOSONAR const hh = parseInt(GPS_Time.substring(0, 2))
      // const mm = parseInt(GPS_Time.substring(2, 4))
      // const ss = parseInt(GPS_Time.substring(4, 6))
      // const dss = parseInt(GPS_Time.substring(6, 8))

      // transform and insert
      const ts = parseInt(Date.now() / 100) * 100
      const Timestamp = new Date(ts)
      //NOSONAR Timestamp.setUTCHours(hh)
      // Timestamp.setUTCMinutes(mm)
      // Timestamp.setUTCSeconds(ss)
      // Timestamp.setUTCMilliseconds(dss * 10)
      // if (hh >= (24 + utcOffsetHours)) Timestamp.setDate(Timestamp.getDate() - 1)
      // console.log(Timestamp.toLocaleString())
      const transform = { serial, Timestamp, Time, GPS_Time, Sat, Latitude, Longitude, Speed, Roll, Pitch, Z_Rate, Accx, Accy, RPM, Gear_Ratio, Calc_gear, Clutch, Front_Brake, Rear_Brake, Engine_Brake, Foot_Right, Foot_Left, checksum }

      // Returns [1] in "mysql", "sqlite", "oracle"; [] in "postgresql" unless the 'returning' parameter is set.
      knex('sensordata').insert(transform).then((rv) => console.log(rv)).catch(e => console.error(e.toString()))
    }
  },

  close: async () => {
    if (knex) {
      dbReady = false
      await knex.destroy()
      knex = null
    }
  }
}