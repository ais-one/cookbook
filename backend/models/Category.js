'use strict'
const Model = require('../services/database')

// export default
class Category extends Model {
  static get tableName() { return 'categories' }
  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name'],
      properties: {
        id: { type: 'integer' },
        name: { type: 'string', minLength: 1, maxLength: 255 },
      }
    }
  }
  // static get relationMappings() {
  //   const Book = require('./Book')
  //   return {
  //     book: {
  //       relation: Model.HasOneRelation,
  //       modelClass: Book,
  //       join: {
  //         from: 'categories.id',
  //         to: 'books.categoryId'
  //       }
  //     }
  //   } 
  // }
}

module.exports = Category