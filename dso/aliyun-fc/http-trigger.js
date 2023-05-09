'use strict';

// more information about nodejs mysql: https://github.com/mysqljs/mysql
const mysql = require('mysql2');
let connection;
let isOk = false;

// please implement the initializer function as below：
module.exports.initialize = (context, callback) => {
  console.log('initializing');
  try {
    connection = mysql.createConnection(
      {
        host: process.env.MYSQL_ENDPOINT,
        user: process.env.MYSQL_USER,
        database: process.env.MYSQL_DBNAME,
        password: process.env.MYSQL_PASSWORD
      }
    );  
    isOk = true;
    callback(null, 'success');
  } catch (e) {
    callback(e)
  }
  // callback(null, '');
};

const CORS_ORIGINS_LIST = 'https://your.frontend.com'

module.exports.handler = async function (req, res, context) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', CORS_ORIGINS_LIST);
  // res.setHeader('Access-Control-Allow-Origin', 'http://www.fc.com')
  if (req.method === 'OPTIONS') {
    // Send response to OPTIONS requests
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Max-Age', '3600');
    res.setStatusCode(204);
    return res.send('');
  }

  // const id = 'a';
  // const hash = 'b';
  const { id, hash } = req.queries;
  const sql = `SELECT * FROM proof WHERE account_id='${id}' AND leaf_hash='${hash}' LIMIT 1`;
  let result = {}
  try {
    const rv = await connection.promise().query(sql);
    result = {
      data: rv[0][0]
    }
  } catch (e) {
    result = {
      error: e.toString()
    }
  }

  res.setHeader('content-type', 'application/json');
  res.setStatusCode(result.data ? 200 : 500);
  res.send(Buffer.from(JSON.stringify(result)));
};


exports.pre_stop = (context, callback) => {
  console.log('pre_stop start');
  connection.end();
  console.log('pre_stop end');
  callback(null, '');
}