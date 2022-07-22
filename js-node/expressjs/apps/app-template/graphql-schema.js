
const { buildSchema } = require('graphql')

const { PubSub } = require('graphql-subscriptions')

const pubsub = new PubSub()

const schema = buildSchema(`
# comment here
type Message {
  id: ID!
  content: String
}

input MessageInput {
  content: String
}
 
type Query {
  hello: String
  getMessage(id: ID!): Message
  getMessages: [Message]
}

type Subscription {
  helloQueried : String
}

type Mutation {
  addMessage(input: MessageInput): Message
  setMessage(id: ID!, input: MessageInput): Message
}
`)

// Maps username to content
let fakeDb = []
let msgId = 1

const roots = {
  Mutation: {
    addMessage: ({ input }) => {
      const msg = { id: msgId, content: input.content }
      fakeDb.push(msg)
      msgId++
      return msg
    },
    setMessage: ({id, input}) => {
      const msg = fakeDb.find(item => item.id.toString() === id.toString())
      if (!msg) {
        throw new Error('no message exists with id ' + id);
      }
      msg.content = input.content
      return msg
    },
  },
  Query: {
    hello: () => {
      const msg = `Hello Timestamp: ${Date.now()}`
      pubsub.publish('HELLO_QUERIED', { helloQueried: msg })
      return msg
    },
    getMessages: () => fakeDb,
    getMessage: ({id}) => {
      const msg = fakeDb.find(item => item.id.toString() === id.toString())
      if (!msg) {
        throw new Error('no message exists with id ' + id);
      }
      return msg
    }
  },
  subscription: {
    helloQueried: () => {
      return pubsub.asyncIterator('HELLO_QUERIED')
    }
  },
}

const rootValue = {
  hello: roots.Query.hello,
  helloQueried: roots.subscription.helloQueried,

  addMessage: roots.Mutation.addMessage,
  setMessage: roots.Mutation.setMessage,
  getMessages: roots.Query.getMessages,
  getMessage: roots.Query.getMessage,
}

module.exports = {
  rootValue,
  roots,
  schema
}
