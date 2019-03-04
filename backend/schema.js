// for the resolvers
const Book = require('./models/Book')
const Author = require('./models/Author')
const Page = require('./models/Page')
const Category = require('./models/Category')

const { gql } = require('apollo-server-express')
// graphql Schema

const typeDefs = gql`
type Query {
  hello: String
  getAuthor(id: Int!): Author
  getAuthors(page: Int, limit: Int, search: String): [Author!]!
  getCategory(id: Int!): Category
  getCategories: Categories
}

type Author {
  id: ID!
  name: String!
}
type Category {
  id: ID!
  name: String!
}
type Categories {
  results: [Category]!
  total: Int!
}
type Book {
  id: ID!
  name: String!
  category: Category!
}
type Page {
  id: ID!
  content: String!
  bookId: Book!
}
`

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: () => 'Hello world!',
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
}

module.exports = {
  typeDefs,
  resolvers
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
