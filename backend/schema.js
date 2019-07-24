// for the resolvers
const Book = require('./models/Book')
const Author = require('./models/Author')
const Page = require('./models/Page')
const Category = require('./models/Category')

const { gql } = require('apollo-server-express')
// graphql Schema

// const xxx = require('./schema.gql')
// console.log(xxx)

const fs = require('fs')
const typeDefs = fs.readFileSync('./schema.gql', 'utf8').toString();

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: (parent, args, context, info) => {
      return args.message ? 'Hello ' + args.message : 'Hello world!'
    },
    getAuthor: async (parent, args, context, info) => {
      try {
        const author = await Author.query().findById(args.id)
        return author
      } catch (e) {
        return {}
      }
    },
    getAuthors: async (parent, args, context, info) => {
      // args.page, args.limit
      try {
        const limit = args.limit ? args.limit : 2
        const page = args.page ? args.page : 0
        const search = args.search ? args.search : ''
        const authors = await Author.query()
          .where('name', 'like', `%${search}%`)
          // .where('bookId', req.params.id)
          // .orderBy
          .page(page, limit)
        return authors
      } catch (e) {
        return {}
      }
    },

    getCategory: async (parent, args, context, info) => {
      try {
        const category = await Category.query().findById(args.id)
        console.log('graphql', category)
        return category
      } catch (e) {
        return {}
      }
    },
    getCategories: async (parent, args, context, info) => {
      try {
        const limit = args.limit ? args.limit : 2
        const page = args.page ? args.page : 0
        const categories = await Category.query().page(page, limit)
        // console.log(categories)
        return categories  
      } catch (e) {
        return {}
      }
    },
    uploads: () => {
      // Return the record of files uploaded from your DB or API or filesystem.
    }
  },
  Mutation: {
    putAuthor: async (parent, args, context, info) => {
      try {
        const author = await Author.query().patchAndFetchById(args.id, args.body)
        return author
      } catch (e) {
        return {}
      }
    },
    postAuthor: async (parent, args, context, info) => {
      try {
        const author = await Author.query().insert(args.body)
        return author
      } catch (e) {
        return {}
      }
    },

    patchCategory: async (parent, args, { pubsub }, info) => {
      try {
        const category = await Category.query().patchAndFetchById(args.id, args.body)
        pubsub.publish('CATEGORY_UPDATED', { categoryUpdated: category }) // subscription
        return category
      } catch (e) {
        return {}
      }
    },
    postCategory: async (parent, args, { pubsub }, info) => {
      try {
        const category = await Category.query().insert(args.body)
        pubsub.publish('CATEGORY_ADDED', { categoryAdded: category }) // subscription
        return category
      } catch (e) {
        return {}
      }
    },
    async singleUpload(parent, { file }) {
      const { stream, filename, mimetype, encoding } = await file;

      // 1. Validate file metadata.

      // 2. Stream file contents into cloud storage:
      // https://nodejs.org/api/stream.html

      // 3. Record the file upload in your DB.
      // const id = await recordFile( … )

      return { filename, mimetype, encoding };
    }
  },
  Subscription: {
    categoryAdded: {
      // Additional event labels can be passed to asyncIterator creation
      subscribe: (parent, args, { pubsub }, info) => {
        return pubsub.asyncIterator('CATEGORY_ADDED')
      }
    },
    categoryUpdated: {
      // Additional event labels can be passed to asyncIterator creation
      subscribe: (parent, args, { pubsub }, info) => {
        return pubsub.asyncIterator('CATEGORY_UPDATED')
      }
    }
  }
}

module.exports = {
  typeDefs,
  resolvers
  // context: {
  //   db,
  //   pubsub
  // }  
}

/*
query {
  # Write your query or mutation here
  getCategories {
    total
    results {
      id
      name
    }
  }
  hello
  getCategory(id: 1) {
    id
    name
  }
}

{
  "data": {
    "getCategories": {
      "total": 2,
      "results": [
        {
          "id": "1",
          "name": "cat1"
        },
        {
          "id": "2",
          "name": "cat2"
        }
      ]
    },
    "hello": "Hello world!",
    "getCategory": {
      "name": "cat1"
    }
  }
}
*/
