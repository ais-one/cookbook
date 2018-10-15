const express = require('express')
const baseRoutes = express.Router()
const multer = require('multer')

const {authUser} = require('../helpers')

const keyv = require('../middleware/keyv')
// const {get} = require('../middleware/wss')
// const WebSocket = require('ws')

const UPLOAD_PATH = 'uploads';
const upload = multer({ dest: `${UPLOAD_PATH}/` }); // multer configuration

baseRoutes
  .get('/logout', authUser, async (req,res) => {
    const incomingToken = req.headers.authorization.split(' ')[1]
    await keyv.delete(incomingToken)
    // clear the token
    res.status(200).json({ message: 'Logged Out' })
  })
  .post('/upload', upload.single('avatar'), async (req,res) => {
    console.log(req.file)
    res.status(200).json({ message: 'Uploaded' })
  })
  .post('/uploads', upload.array('photos', 3), function (req, res, next) {
    console.log(req.files)
    res.status(200).json({ message: 'Uploaded' })
    // req.files is array of `photos` files
    // req.body will contain the text fields, if there were any
  })
module.exports = baseRoutes
