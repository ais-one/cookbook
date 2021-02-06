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

const { UPLOAD_STATIC } = global.CONFIG
// console.log('UPLOAD_FOLDER', UPLOAD_STATIC)

const multer = require('multer')

const memoryUpload = multer({ 
  limits: {
    files : 1,
    fileSize: 5000 // size in bytes
  },
  // fileFilter,
  storage: multer.memoryStorage()
})

const storageUpload = multer({
  // limits: {
  //   files : 1,
  //   fileSize: 1000000 // size in bytes
  // },
  // fileFilter: (req, file, cb) => {
  //   if (
  //     !file.mimetype.includes("jpeg") && !file.mimetype.includes("jpg") && !file.mimetype.includes("png")
  //   ) {
  //     return cb(null, false, new Error("Only jpeg, png or pdf are allowed"));
  //   }
  //   cb(null, true);
  // },
  storage: multer.diskStorage({
    destination: function (req, file, cb) { cb(null, UPLOAD_STATIC[0].folder) },
    filename: function (req, file, cb) { cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname) }
  })
})

module.exports = {
  memoryUpload,
  storageUpload,
}