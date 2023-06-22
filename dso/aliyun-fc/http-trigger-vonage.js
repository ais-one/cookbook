'use strict';

// npm i @vonage/server-sdk
const { Vonage } = require('@vonage/server-sdk')
const { Text } = require('@vonage/messages/dist/classes/WhatsApp/Text');

// Handle Whatsapp using cloud functions
let vonage = null;

// please implement the initializer function as below：
module.exports.initialize = (context, callback) => {
  console.log('initializing');
  try {
    callback(null, 'init success');
  } catch (e) {
    console.log('init error', e.toString());
    callback(e)
  }
};

// const CORS_ORIGINS_LIST = 'https://por.bakertillyvision.co'

module.exports.handler = async function (req, res, context) {
  // CORS
  // res.setHeader('Access-Control-Allow-Origin', CORS_ORIGINS_LIST);
  if (req.method === 'OPTIONS') {
    // Send response to OPTIONS requests
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Max-Age', '3600');
    res.setStatusCode(204);
    return res.send('');
  }

  const params = {
    path: req.path,
    queries: req.queries,
    headers: req.headers,
    method : req.method,
    requestURI : req.url,
    clientIP : req.clientIP,
    protocol: req.headers['x-forwarded-proto'],
  }

  const req_body = JSON.parse(req.body.toString() || null);
  console.log(req_body);
  const { from } = req_body;

  if (params.path === '/status') {
    // handle status
  } else if (params.path === '/inbound') {
    // handle inbound
    try {
      vonage = new Vonage({
        apiKey: '',
        apiSecret: '',
        applicationId: '9382d6a3-dd8b-4a48-8c40-b534fd2e842b',
        privateKey: './private.key'
      } // , { apiHost: 'https://api.nexmo.com/' }
      )
  
      const waRes = await vonage.messages.send(
        new Text(
          "This is a WhatsApp Message text message sent using the Messages API",
          from, // TO...
          '6588188288'
        )
      )
      console.log('waRes', waRes);
    } catch(e) {
      console.log('send err', e.toString());
    }
  }
  
  const result = { status: 'ok', params };
  res.setHeader('content-type', 'application/json');
  res.setStatusCode(200);
  // res.send(Buffer.from(JSON.stringify(result)));
  res.send('');
};


exports.pre_stop = (context, callback) => {
  console.log('pre_stop start');
  console.log('pre_stop end');
  callback(null, '');
}

/*
{
   "channel": "whatsapp",
   "message_uuid": "aaaaaaaa-bbbb-cccc-dddd-0123456789ab",
   "to": "447700900000",
   "from": "447700900001",
   "timestamp": "2020-01-01T14:00:00.000Z",
   "profile": { "name": "Jane Smith" },
   "message_type": "text",
   "text": "Nexmo Verification code: 12345.<br />Valid for 10 minutes."
}
*/


/* hooks
c-649273e9-f50c449587bd421aa5202023-06-21 11:52:272023-06-21 11:52:27 1-649273fb-f92a3106038d2281bf9ac072 [verbose] {
  to: '6596935500',
  from: '6588188288',
  channel: 'whatsapp',
  message_uuid: '0a590cf2-1a21-461d-8476-bc14ac1be6b1',
  timestamp: '2023-06-21T03:52:26Z',
  status: 'submitted'
}
c-649273e9-f50c449587bd421aa5202023-06-21 11:52:292023-06-21 11:52:29 1-649273fd-f9cef9ed489332e2f41ba8ee [verbose] {
  to: '6596935500',
  from: '6588188288',
  channel: 'whatsapp',
  message_uuid: '0a590cf2-1a21-461d-8476-bc14ac1be6b1',
  timestamp: '2023-06-21T03:52:28Z',
  usage: { price: '0.04', currency: 'EUR' },
  status: 'delivered',
  whatsapp: {
    conversation: { id: 'b09d7687add69d5705282a7db267bfcf', origin: [Object] }
  }
}
c-649273e9-f50c449587bd421aa5202023-06-21 11:52:292023-06-21 11:52:29 1-649273fd-2373c55733f2ee4d9bbbdc22 [verbose] {
  to: '6596935500',
  from: '6588188288',
  channel: 'whatsapp',
  message_uuid: '0a590cf2-1a21-461d-8476-bc14ac1be6b1',
  timestamp: '2023-06-21T03:52:28Z',
  status: 'read',
  whatsapp: {
    conversation: { id: 'b09d7687add69d5705282a7db267bfcf', origin: [Object] }
  }
}
*/