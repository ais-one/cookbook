// import { Model } from 'objection'
// import Book from './Book'

const Model = require('objection').Model
const Book = require('./Book')

// export default
class Author extends Model {
  // Table name is the only required property.
  // static tableName = 'authors'
  static get tableName() { return 'authors' }

  // static relationMappings = {
  static get relationMappings() { return {
      books: {
      relation: Model.ManyToManyRelation,
      // The related model. This can be either a Model subclass constructor or an
      // absolute file path to a module that exports one. We use the file path version
      // here to prevent require loops.
      modelClass: Book,
      join: {
        from: 'authors.id',
        // ManyToMany relation needs the `through` object to describe the join table.
        through: {
          from: 'books_authors.authorId',
          to: 'books_authors.bookId'
        },
        to: 'books.id'
      }
    }
  } }
}

module.exports = Author