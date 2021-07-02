'use strict'

// for the resolvers
const Category = require('../models/Category')

// const { gql } = require('apollo-server-express')
// graphql Schema
const fs = require('fs')
const typeDefs = fs.readFileSync('./graphql/schema.gql', 'utf8').toString() // relative to package.json directory where script is executed

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: (parent, args, context, info) => {
      return args.message ? 'Hello ' + args.message : 'Hello world!'
    },

    getCategory: async (parent, args, context, info) => {
      try {
        const category = await Category.query().findById(args.id)
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
        // console.log('categories', page, limit, categories)
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
    setHello: async (parent, args, context, info) => {
      try {
        // do your DB stuff here...
        context.pubsub.publish('HELLO_UPDATED', { helloUpdated: args.body.message }) // subscription
        return args.body.message // string
      } catch (e) {
        console.log('mutation error', e)
        return 'No Message'
      }
    },

    patchCategory: async (parent, args, { pubsub }, info) => {
      try {
        const category = await Category.query().patchAndFetchById(args.id, args.body)
        return category
      } catch (e) {
        return {}
      }
    },
    postCategory: async (parent, args, { pubsub }, info) => {
      try {
        const category = await Category.query().insert(args.body)
        return category
      } catch (e) {
        return {}
      }
    }
    // async singleUpload(parent, { file }) {
    //   const { stream, filename, mimetype, encoding } = await file;
    //   1. Validate file metadata.
    //   2. Stream file contents into cloud storage:
    //   https://nodejs.org/api/stream.html
    //   3. Record the file upload in your DB.
    //   const id = await recordFile( … )
    //   return { filename, mimetype, encoding };
    // }
  },
  Subscription: {
    helloUpdated: {
      // Additional event labels can be passed to asyncIterator creation
      subscribe: (parent, args, { pubsub }, info) => {
        return pubsub.asyncIterator('HELLO_UPDATED')
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
