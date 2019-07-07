const express = require('express')
const apiRoutes = express.Router()

// const { authUser } = require('../middleware/auth')

const multer = require('multer')
const mongo = require('../services/mongo')
const UPLOAD_PATH = 'uploads/'
const upload = multer({ dest: `${UPLOAD_PATH}` }) // multer configuration

apiRoutes
  .get('/rest-test', async (req,res) => {
    res.status(200).json({ message: 'REST Test Ok' })
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
