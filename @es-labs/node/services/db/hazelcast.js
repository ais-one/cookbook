'use strict'
const { Client, Predicates } = require('hazelcast-client')

module.exports = class StoreHazelcast {
	constructor(options = process.env.HAZELCAST) {
    this.HAZELCAST = JSON.parse(options || null)
    this.hazelcast = {
      client: null
    }
  }
  async open() {
    if (this.HAZELCAST) {
      hazelcast.client = await Client.newHazelcastClient(
        {
          clusterName: this.HAZELCAST.name,
          network: {
            clusterMembers: [ this.HAZELCAST.url ]
          },
          lifecycleListeners: [ (state) => console.log('Lifecycle Event >>> ' + state) ]
        }
      )
    }
  }
  close () {
    if (this.hazelcast.client) {
      this.hazelcast.client.shutdown()
      console.log('hazelcast closed')
    }
  }
  get () { return this.hazelcast }
}
