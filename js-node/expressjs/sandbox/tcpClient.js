const net = require('net')
const port = 4000
const host = '127.0.0.1'

// creating a custom socket client and connecting it....
const client  = new net.Socket();
client.connect({ host, port })
client.setEncoding('utf8')

client.on('connect', () => {
  console.log('Client: connection established with server')
  // writing data to server
  client.write('hello from client')
})


// client.on('data', (data) => console.log('Data from server:' + data))

client.on('error', (error) => {
  console.log(error.toString())
  client.end()
})

client.on('end', () => console.log('disconnected from server'))

/* NOSONAR
// Import net module.
var net = require('net');

// This function create and return a net.Socket object to represent TCP client.
function getConn(connName){
    var option = {
        host:'localhost',
        port: 9999
    }

    // Create TCP client.
    var client = net.createConnection(option, function () {
        console.log('Connection name : ' + connName);
        console.log('Connection local address : ' + client.localAddress + ":" + client.localPort);
        console.log('Connection remote address : ' + client.remoteAddress + ":" + client.remotePort);
    });

    client.setTimeout(1000);
    client.setEncoding('utf8');

    // When receive server send back data.
    client.on('data', function (data) {
        console.log('Server return data : ' + data);
    });

    // When connection disconnected.
    client.on('end',function () {
        console.log('Client socket disconnect. ');
    });

    client.on('timeout', function () {
        console.log('Client connection timeout. ');
    });

    client.on('error', function (err) {
        console.error(JSON.stringify(err));
    });

    return client;
}

// Create a java client socket.
var javaClient = getConn('Java');

// Create node client socket.
var nodeClient = getConn('Node');

javaClient.write('Java is best programming language. ');
nodeClient.write('Node is more better than java. ');

*/
