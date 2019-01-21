const express = require('express')
const baseRoutes = express.Router()
const multer = require('multer')

const { authUser } = require('../middleware/auth')

const keyv = require('../helpers/keyv')
const mongo = require('../helpers/mongo')

const UPLOAD_PATH = 'uploads/';
const upload = multer({ dest: `${UPLOAD_PATH}` }); // multer configuration

baseRoutes
  .get('/test', async (req,res) => {
    try {
      results = await mongo.db().collection('users').find({}).toArray()
      console.log(results)
    } catch (e) {
      console.log(e)
    }
    // console.log('mongo connected:', !!mongo)
    res.status(200).json({ message: 'Test' })
  })
  .post('/signup', async (req,res) => {
    // const {email, password} = req.body
    // password = bcrypt.hashSync(password, SALT_ROUNDS)
    // const rv = await createUser(email, password)
    res.status(201).end()
  })
  .get('/logout', authUser, async (req,res) => {
    try {
      const incomingToken = req.headers.authorization.split(' ')[1]
      await keyv.delete(incomingToken)
      // clear the token
      return res.status(200).json({ message: 'Logged Out' })  
    } catch (e) { }
    return res.status(500).json()  
  })
  // test uploads
  .post('/upload', upload.single('avatar'), async (req,res) => { // avatar is form input name
    console.log(req.file, req.body)
    res.status(200).json({ message: 'Uploaded' })
  })
  .post('/uploads', upload.array('photos', 3), function (req, res, next) {
    console.log(req.files)
    res.status(200).json({ message: 'Uploaded' })
    // req.files is array of `photos` files
    // req.body will contain the text fields, if there were any
  })

module.exports = baseRoutes
