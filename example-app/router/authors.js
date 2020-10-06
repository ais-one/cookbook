const express = require('express')
const { UPLOAD_FOLDER } = global.CONFIG
const { authUser } = require('../middlewares/auth')

// const Category = require('../models/Category')
// const Author = require('../models/Author')
// const { transaction } = require('objection')
// const knex = Author.knex() // You can access `knex` instance anywhere you want.  One way is to get it through any model.

const multer = require('multer')
const storage = multer.diskStorage({
  destination: function (req, file, cb) { cb(null, UPLOAD_FOLDER) },
  filename: function (req, file, cb) { cb(null, file.fieldname + '-' + Date.now()) }
})
const upload = multer({
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
  storage: storage
})

const authorController = require('../controllers/author') // use controller

module.exports = express.Router()
  /**
   * @swagger
   * definition:
   *    authorObject:
   *      properties:
   *        name:
   *          type: string
   *          description: Author Name
   *        avatar:
   *          type: string
   *          description: URL path to author avatar
   */

  /**
   * @swagger
   * /api/authors:
   *    post:
   *      tags:
   *        - "Base"
   *      security:
   *        - bearerAuth: []
   *      description: add an author
   *      parameters:
   *        - name: author
   *          in: body
   *          required: true
   *          schema:
   *            $ref: '#/definitions/AuthorObject'
   */
  .post('/', authUser, authorController.create)
  /**
   * @swagger
   * /api/authors/{id}:
   *    patch:
   *      tags:
   *        - "Base"
   *      security:
   *        - bearerAuth: []
   *      description: add an author
   *      parameters:
   *        - name: id
   *          in: path
   *        - name: author
   *          in: body
   *          required: true
   *          schema:
   *            $ref: '#/definitions/AuthorObject'

   */
  .patch('/:id', authUser, upload.single('filex'), authorController.update)
  /**
   * @swagger
   * /api/authors/{id}:
   *    get:
   *      tags:
   *        - "Base"
   *      security:
   *        - bearerAuth: []
   *      description: add an author
   *      parameters:
   *        - name: id
   *          in: path
   */
  .get('/:id', authUser, authorController.findOne)
  /**
   * @swagger
   * /api/authors:
   *    get:
   *      tags:
   *        - "Base"
   *      security:
   *        - bearerAuth: []
   *      description: add an author
   *      parameters:
   *        - name: page
   *          in: query
   *        - name: limit
   *          in: query
   *        - name: search
   *          in: query
   *        - name: sort
   *          in: query
   */
  .get('/', authUser, authorController.find)
  /**
   * @swagger
   * /api/authors/{id}:
   *    delete:
   *      tags:
   *        - "Base"
   *      security:
   *        - bearerAuth: []
   *      description: add an author
   *      parameters:
   *        - name: id
   *          in: path
   */
  .delete('/:id', authUser, authorController.remove)
