'use strict';
const https = require('https');
const axios = require('axios');

const api = axios.create({
   httpsAgent: new https.Agent({ rejectUnauthorized: false }),
});
   
exports.handler = async function (event, context, callback) {
   console.log("whole event: %s", event);
    
   // Parse the json
   const eventObj = JSON.parse(event.toString());
   const triggerName = eventObj['triggerName'];
   const triggerTime = eventObj['triggerTime'];
   const payload = eventObj['payload'];
   console.log("triggerName/time/payload: ", triggerName, triggerTime, payload);

   // check services
   let result = ''
   result += 'INFURA - ETC-BASED '
   try {
      await api.get('https://mainnet.infura.io/v3')
      result += `ERR - 200\n`
   } catch (e) {
      result += (e.response.status == 404) ? `OK\n` : `ERR ${e.toString()}\n`
   }
   result += 'BSC '
   try {
      const rv = await api.get('https://data-seed-prebsc-1-s1.binance.org:8545')
      result += (rv.status == 200) ? `OK\n` : `ERR ${rv.status.toString()}\n`
   } catch (e) {
      console.log(e.toString())
      result += `ERR 1\n`
   }

   const { BOTID, BOTKEY } = process.env
   bot5728250590
   AAErydAuif5RU8q5RzopQYZ9xeGzCT32e_k

   let msg = encodeURI(`${triggerTime}\n${result}`)
   await axios.get(`https://api.telegram.org/${BOTID}:${BOTKEY}/sendMessage?chat_id=-1001380887961&text=` + msg);

   callback(null, "Timer Payload:" + payload);
};