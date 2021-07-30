'use strict'
const { Client, Predicates } = require('hazelcast-client')

module.exports = class StoreHazelcast {
	constructor(options = global.CONFIG) {
    const { HAZELCAST } = options || {}
    this.HAZELCAST = HAZELCAST
    this.hazelcast = {
      client: null
    }
  }
  async open() {
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
  close () {
    if (this.hazelcast.client) {
      this.hazelcast.client.shutdown()
      console.log('hazelcast closed')
    }
  }
  get () { return this.hazelcast }
}
