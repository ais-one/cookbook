
const { buildSchema } = require('graphql')

const { PubSub } = require('graphql-subscriptions')

const pubsub = new PubSub()

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  })
}

const schema = buildSchema(`
# comment here
input MessageInput {
  content: String
  # aaaaa
}
 
type Message {
  id: ID!
  content: String
}

type Query {
  hello: String
}

type Subscription {
    countDown: Int
    helloQueried : String
}
`)

/*
type Query {
  hello: String
  getMessage(id: ID!): String
}

type Subscription {
    countDown: Int
    notifyAddMessage(id: ID!): Message
    notifySetMessage(id: ID!): Message
    helloQueried : String
}

type Mutation {
  addMessage(input: MessageInput): Message
  setMessage(id: ID!, input: MessageInput): Message
}
*/

// subscriptionServer.close()

class Message {
  constructor(id, {content, author}) {
    this.id = id;
    this.content = content;
  }
}
 
// Maps username to content
let fakeDatabase = {}
let msgId = 1

const roots = {
  // Mutation: {
  //   addMessage: ({input}) => {
  //     // Create a random id for our "database".
  //     const id = msgId
  //     msgId++
  //     fakeDatabase[id] = input;
  //     return new Message(id, input);
  //   },
  //   setMessage: ({id, input}) => {
  //     if (!fakeDatabase[id]) {
  //       throw new Error('no message exists with id ' + id);
  //     }
  //     // This replaces all old data, but some apps might want partial update.
  //     fakeDatabase[id] = input;
  //     return new Message(id, input);
  //   },
  // },
  Query: {
    hello: () => {
      const msg = `Hello Timestamp: ${Date.now()}`
      pubsub.publish('HELLO_QUERIED', { helloQueried: msg })
      return msg
    },
    // getMessage: ({id}) => {
    //   if (!fakeDatabase[id]) {
    //     throw new Error('no message exists with id ' + id);
    //   }
    //   return new Message(id, fakeDatabase[id]);
    // }
  },
  subscription: {
    /* eslint no-await-in-loop: "off" */
    countDown: async function* fiveToOne() {
      for (const number of [5, 4, 3, 2, 1]) {
        await sleep(1000); // slow down a bit so user can see the count down on GraphiQL
        yield { countDown: number };
      }
    },
    helloQueried: () => {
      return pubsub.asyncIterator('HELLO_QUERIED')
    }
  },
}

const rootValue = {
  hello: roots.Query.hello,
  countDown: roots.subscription.countDown,
  helloQueried: roots.subscription.helloQueried,
}

module.exports = {
  rootValue,
  roots,
  schema
}
