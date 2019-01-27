'use strict'
const Model = require('../services/database')

// export default 
class Book extends Model {
  // Table name is the only required property.

  // static tableName = 'books'
  static get tableName() { return 'books' }

  // Optional JSON schema. This is not the database schema! Nothing is generated
  // based on this. This is only used for validation. Whenever a model instance
  // is created it is checked against this schema. http://json-schema.org/.
  // static jsonSchema = {
  //   type: 'object',
  //   required: ['firstName', 'lastName'],

  //   properties: {
  //     id: { type: 'integer' },
  //     parentId: { type: ['integer', 'null'] },
  //     firstName: { type: 'string', minLength: 1, maxLength: 255 },
  //     lastName: { type: 'string', minLength: 1, maxLength: 255 },
  //     age: { type: 'number' },
  //     address: {
  //       type: 'object',
  //       properties: {
  //         street: { type: 'string' },
  //         city: { type: 'string' },
  //         zipCode: { type: 'string' }
  //       }
  //     }
  //   }
  // }

  // static jsonSchema = {
  //   type: 'object',
  //   required: ['name'],
  //   properties: {
  //     id: { type: 'integer' },
  //     name: { type: 'string', minLength: 1, maxLength: 255 },
  //     category: { type: 'string', maxLength: 255 }
  //   }
  // }

  // This object defines the relations to other models.
  // static relationMappings = {
  static get relationMappings() { 
    const Author = require('./Author')
    const Page = require('./Page')
    const Category = require('./Category')
    return {
      // pets: {
      //   relation: Model.HasManyRelation,
      //   // The related model. This can be either a Model subclass constructor or an
      //   // absolute file path to a module that exports one. We use the file path version
      //   // here to prevent require loops.
      //   modelClass: Animal,
      //   join: {
      //     from: 'persons.id',
      //     to: 'animals.ownerId'
      //   }
      // },

      category: { // category, categoryId
        relation: Model.HasOneRelation,
        // relation: Model.BelongsToOneRelation,
        // The related model. This can be either a Model subclass constructor or an
        // absolute file path to a module that exports one. We use the file path version
        // here to prevent require loops.
        modelClass: Category,
        join: {
          from: 'books.categoryId',
          to: 'categories.id'
          // to: 'books.categoryId',
          // from: 'categories.id'
        }
      },
  
      pages: {
        relation: Model.HasManyRelation,
        // The related model. This can be either a Model subclass constructor or an
        // absolute file path to a module that exports one. We use the file path version
        // here to prevent require loops.
        modelClass: Page,
        join: {
          from: 'books.id',
          to: 'pages.bookId'
        }
      },

      authors: {
        relation: Model.ManyToManyRelation,
        modelClass: Author,
        join: {
          from: 'books.id',
          // ManyToMany relation needs the `through` object to describe the join table.
          through: {
            from: 'books_authors.bookId',
            to: 'books_authors.authorId'
          },
          to: 'authors.id'
        }
      }

      // children: {
      //   relation: Model.HasManyRelation,
      //   modelClass: Person,
      //   join: {
      //     from: 'persons.id',
      //     to: 'persons.parentId'
      //   }
      // },

      // parent: {
      //   relation: Model.BelongsToOneRelation,
      //   modelClass: Person,
      //   join: {
      //     from: 'persons.parentId',
      //     to: 'persons.id'
      //   }
      // }
    } 
  }
}

module.exports = Book