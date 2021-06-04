const express = require('express')
const { authUser } = require('../middlewares/auth')
const { storageUpload } = require('@es-labs/node/express/upload')
const { UPLOAD_STATIC } = global.CONFIG

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
  .patch('/:id', authUser, storageUpload(UPLOAD_STATIC.folder, '', UPLOAD_STATIC.options).single('filex'), authorController.update)
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
