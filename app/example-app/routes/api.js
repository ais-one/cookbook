const fs = require('fs')
const express = require('express')
const apiRoutes = express.Router()

const logger = require('../../services/logger')

// var path = require('path')
// path.extname('index.html')
// returns '.html'

const { UPLOAD_PATH } = require('../config')
const { authUser } = require('../middlewares/auth')
const multer = require('multer')
const upload = multer({ dest: `${UPLOAD_PATH}` }) // multer configuration
    // console.log(req.file)
    // {
    //   fieldname: 'kycfile',
    //   originalname: 'tbd.txt',
    //   encoding: '7bit',
    //   mimetype: 'text/plain',
    //   destination: 'uploads/',
    //   filename: 'kycfile-1582238409067',
    //   path: 'uploads\\kycfile-1582238409067',
    //   size: 110
    // }

apiRoutes
  .get('/error', async (req,res) => { // for an error - test logging of errors
    try {
      req.something.missing = 10
      res.status(200).json({ message: 'OK' })
    } catch (e) {
      console.log(e.stack)
      const { message, stack } = e
      res.status(500).json({ message, stack })
    }
  })
  /**
   * @swagger
   * /api/authors:
   *    post:
   *      tags:
   *        - "Base"
   *      description: Health check
   */
  .get('/health', async (req,res) => { // health check
    res.status(200).json({ message: 'OK' })
  })
  /**
   * @swagger
   * /api/authors:
   *    post:
   *      tags:
   *        - "Base"
   *      security:
   *        - Bearer: []
   *      description: Health check with authorization
   */
  .get('/health-auth', authUser, async (req,res) => { // health check auth
    res.status(200).json({ message: 'OK' })
  })
  // test uploads
  .post('/upload', upload.single('avatar'), async (req,res) => { // avatar is form input name
    console.log(req.file, req.body)
    res.status(200).json({ message: 'Uploaded' })
  })
  .post('/uploads', upload.array('photos', 3), (req, res, next) => {
    console.log(req.files)
    res.status(200).json({ message: 'Uploaded' })
    // req.files is array of `photos` files
    // req.body will contain the text fields, if there were any
  })

module.exports = apiRoutes
