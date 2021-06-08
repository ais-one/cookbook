'use strict'

const { HAZELCAST } = global.CONFIG
const { Client, Predicates } = require('hazelcast-client')

let hazelcast = {
  client: null
}

// Hazelcast 4
exports.open = async () => {
  if (!hazelcast.client) {
    if (HAZELCAST.type === 'cloud') {
      // not yet supported
    } else {
      hazelcast.client = await Client.newHazelcastClient(
        {
          clusterName: HAZELCAST.name,
          network: {
            clusterMembers: [ HAZELCAST.url ]
          },
          lifecycleListeners: [ (state) => console.log('Lifecycle Event >>> ' + state) ]
        }
      )    
    }
  }
  return this
}

exports.close = () => {
  console.log('hz close...')
  if (hazelcast.client) {
    hazelcast.client.shutdown()
    console.log('db closed')
  }
}

exports.get = () => {
  // if (!hazelcast.client) {
  //   console.log('hz get....', this)
  // }
  // console.log('hazelcast.client get', hazelcast.client.instanceName)
  return hazelcast
}

