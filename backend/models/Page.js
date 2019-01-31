'use strict'
const Model = require('../services/database')

class Page extends Model {
  // Table name is the only required property.
  // static tableName = 'pages'
  static get tableName() { return 'pages' }

  // static jsonSchema = {
  //   type: 'object',
  //   required: ['content', 'bookId'],
  //   properties: {
  //     id: { type: 'integer' },
  //     content: { type: 'string', minLength: 1, maxLength: 255 },
  //     bookId: { type: 'integer' }
  //   }
  // }

  // This object defines the relations to other models.
  // static relationMappings = {
  static get relationMappings() {
    const Book = require('./Book')
    return {
      book: { // book, bookId
        relation: Model.BelongsToOneRelation,
        // The related model. This can be either a Model subclass constructor or an
        // absolute file path to a module that exports one. We use the file path version
        // here to prevent require loops.
        modelClass: Book,
        join: {
          from: 'pages.bookId',
          to: 'books.id'
        }
      }
    }
  }
}

module.exports = Page