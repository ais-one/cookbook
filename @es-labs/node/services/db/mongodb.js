'use strict'
const { MongoClient, ObjectID } = require('mongodb')

module.exports = class StoreMongo {
	constructor(options = JSON.parse(process.env.MONGO_OPTIONS || null) || {}) {
    this.DEFAULT_TRANSACTION_OPTIONS = {
      readConcern: { level: 'local' },
      writeConcern: { w: 'majority' },
      readPreference: 'primary'
    }
    this.MONGO_URL = options.url
    this.MONGO_OPTIONS = options.opts
    this.mongo = {
      client: null,
      db: null,
      session: null,
      stream: null,
      defaultTransactionOptions: this.DEFAULT_TRANSACTION_OPTIONS,
      ObjectID: null
    }
  }

  async open() {
    this.mongo.ObjectID = ObjectID
    try {
      const client = new MongoClient(this.MONGO_URL, this.MONGO_OPTIONS)
      // {
      //   useUnifiedTopology: true,
      //   useNewUrlParser: true,
      //   auth: { user: 'test', password: 'test123' },
      //   authMechanism: authMechanism,
      //   uri_decode_auth: true
      //   reconnectTries: 1000, // How To Set Infinity?
      //   poolSize: 10,
      //   reconnectInterval: 1000, // ms
      //   autoReconnect: true
      // }
      this.mongo.client = client
      // mongo.client.startSession({ defaultTransactionOptions })
      await client.connect()
      this.mongo.db = client.db()
      // NOSONAR
      // mongo.stream = db.db('mm').collection('exchangeUsers').watch() //  for streaming data
      // mongo.stream.on('change', (change) => {
      //   console.log(change); // You could parse out the needed info and send only that data.
      //   // use websocket to listen to changes
      // })
      console.log('mongodb CONNECTED', this.MONGO_URL)
    } catch (e) { console.log('mongodb CONNECT ERROR', this.MONGO_URL, e.toString()) }
  }
  async close() {
    if (this.mongo.client) await this.mongo.client.close()
    console.log('mongodb closed')
  }
  get() { return this.mongo }
  setId(id) { return new ObjectID(id) }
}
