'use strict'
// const path = require('path')
// path.extname('index.html')
// returns '.html'
// req.file / req.files[index]
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

const multer = require('multer')

const memoryUpload = (options) => multer( Object.assign({
  storage: multer.memoryStorage(),
  limits: { files: 1, fileSize: 500000 }
}, options) )

const storageUpload = (opts) => {
  return multer(Object.assign({
    storage: multer.diskStorage({
      destination: function (req, file, cb) { cb(null, opts.folder) },
      filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname) // file.fieldname
    }),
    limits: { files: 2, fileSize: 8000000 }
  }, opts.options))
}

module.exports = {
  memoryUpload,
  storageUpload,
}