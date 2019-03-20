// for the resolvers
const Book = require('./models/Book')
const Author = require('./models/Author')
const Page = require('./models/Page')
const Category = require('./models/Category')

const { gql } = require('apollo-server-express')
// graphql Schema

// const xxx = require('./schema.graphql')
// console.log(xxx)

const fs = require('fs')
const typeDefs = fs.readFileSync('./schema.graphql', 'utf8').toString();

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
        console.log(category)
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
        console.log(categories)
        return categories  
      } catch (e) {
        return {}
      }
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

    putCategory: async (parent, args, context, info) => {
      try {
        const category = await Category.query().patchAndFetchById(args.id, args.body)
        return category
      } catch (e) {
        return {}
      }
    },
    postCategory: async (parent, args, context, info) => {
      try {
        const category = await Category.query().insert(args.body)
        return category
      } catch (e) {
        return {}
      }
    }
  },
  // Subscription: {
  //   comment: {
  //     subscribe(parent, { postId }, {pubsub, db}, info) {
  //       const post = db.posts.find(post => post.id === postId && post.published)
  //       if (!post) throw new Error('Post Not Found')
  //       return pubsub.asyncIterator(`comment:${postId}`)
  //     }
  //   },
  //   post: {
  //     subscribe(parent, args, {pubsub}, info) {
  //       return pubsub.asyncIterator(`post`)
  //     }
  //   }  
  // }
  // Custom
  // User: {
  //   posts (parent, args, {db}, info) {
  //     return db.posts.filter(post => post.author === parent.id) 
  //    },
  //    comments (parent, args, {db}, info) {
  //      return db.comments.filter(comment => comment.author === parent.id) 
  //    } 
  // },
  // Post: {
  //   author (parent, args, {db}, info) {
  //     return db.users.find(user => user.id === parent.author)
  //   },
  //   comments (parent, args, {db}, info) {
  //     return db.comments.filter(comment => comment.post === parent.id)
  //   }  
  // }
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
