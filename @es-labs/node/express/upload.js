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

const memoryUpload = (options) => multer( Object.assign({ storage: multer.memoryStorage() }, options) )

const storageUpload = (folder, savedFilename, options) => {
  return multer(Object.assign({
    storage: multer.diskStorage({
      destination: function (req, file, cb) { cb(null, folder) },
      filename: (req, file, cb) => cb(null, savedFilename ? savedFilename(file) : Date.now() + '-' + file.originalname) // file.fieldname
    })
  }, options))
}

module.exports = {
  memoryUpload,
  storageUpload,
}