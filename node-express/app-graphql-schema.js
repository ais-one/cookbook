const { buildSchema } = require('graphql')

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  })
}

const schema = buildSchema(`
type Query {
    hello: String
}
type Subscription {
    countDown: Int
}
`)

const roots = {
  Query: {
    hello: () => 'Hello World!',
  },
  subscription: {
    /* eslint no-await-in-loop: "off" */
    countDown: async function* fiveToOne() {
      for (const number of [5, 4, 3, 2, 1]) {
        await sleep(1000); // slow down a bit so user can see the count down on GraphiQL
        yield { countDown: number };
      }
    },
  },
}

const rootValue = {
  hello: roots.Query.hello,
  countDown: roots.subscription.countDown,
}

module.exports = {
  rootValue,
  roots,
  schema
}
