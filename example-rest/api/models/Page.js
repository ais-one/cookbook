// import { Model } from 'objection'
// import Book from './Book'

const Model = require('objection').Model
const Book = require('./Book')

// export default
class Page extends Model {
  // Table name is the only required property.
  // static tableName = 'pages'
  static get tableName() { return 'pages' }

  // This object defines the relations to other models.
  // static relationMappings = {
  static get relationMappings() { return {
      bookId: {
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
  } }
}

module.exports = Page