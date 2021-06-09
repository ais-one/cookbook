'use strict'

const express = require('express')

module.exports = express.Router()
  .post('/mo-sms', asyncWrapper(async (req, res) => {
    console.log('body', req.body)
    console.log('query', req.query)
    console.log('params', req.params)
    const { body, query, params} = req
    res.json({
      body, query, params
    })
  }))

/*
  body {
    msisdn: '6588888888',
    to: 'monumber',
    messageId: '170000028F5FBC1B',
    text: 'Hello\nWorld',
    type: 'text',
    keyword: 'HELLO\nWORLD',
    'api-key': '88888888',
    'message-timestamp': '2020-10-28 07:54:38'
  }
*/