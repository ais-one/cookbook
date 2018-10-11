// use knexfile
// var mysql = require('mysql')
// var settings = require('./settings.json')
// var db

// function connectDatabase() {
//     if (!db) {
//         db = mysql.createConnection(settings)

//         db.connect(function(err){
//             if(!err) {
//                 console.log('Database is connected!')
//             } else {
//                 console.log('Error connecting database!')
//             }
//         })
//     }
//     return db
// }

// module.exports = connectDatabase()

/*
const mysql = require('mysql')
const util = require('util')

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'matt',
    password: 'password',
    database: 'my_database',
    timezone: 'Z',
    charset: 'utf8mb4'
})

pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection was closed.')
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections.')
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused.')
        }
    }
    if (connection) connection.release()
    return
})

pool.query = util.promisify(pool.query)
module.exports = pool
*/