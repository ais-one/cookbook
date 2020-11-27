const { HAZELCAST } = global.CONFIG
const { Client, Config, Predicates } = require('hazelcast-client')

let hazelcast = {
  client: null
}

exports.open = () => {
  if (!hazelcast.client) {
    // Customize the client configuration
    const clientConfig = new Config.ClientConfig()
    if (HAZELCAST.type === 'cloud') {
      clientConfig.networkConfig.cloudConfig.enabled = true
      clientConfig.networkConfig.cloudConfig.discoveryToken = HAZELCAST.discoveryToken // 'Hv1bIZiMPTbCLxYteVavbDQS2crOu9fFoOuJIfwL4XigmTftt2 '
      clientConfig.networkConfig.redoOperation = true
      clientConfig.networkConfig.connectionAttemptLimit = 10
      clientConfig.groupConfig.name = HAZELCAST.name // 'datasense-dev2a'
      clientConfig.groupConfig.password = HAZELCAST.password // '7bfcad7e2f654189a9b2b8f81c03b762'
      clientConfig.properties['hazelcast.client.cloud.url'] = 'https://coordinator.hazelcast.cloud'
      clientConfig.properties['hazelcast.client.statistics.enabled'] = true
      clientConfig.properties['hazelcast.client.statistics.period.seconds'] = 1
    } else {
      clientConfig.groupConfig.name = HAZELCAST.name // 'dev';
      clientConfig.networkConfig.addresses.push(HAZELCAST.url); // 'hazelcast-svc.datasense-dev1.svc.cluster.local:5701'
    }
    Client.newHazelcastClient(clientConfig).then(client => {
      hazelcast.client = client
      console.log('hazelcast.client connected', hazelcast.client.instanceName)
    })
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

