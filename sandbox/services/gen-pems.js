// This application is to generate self signed certs
const selfsigned = require('selfsigned')
const pems = selfsigned.generate(
  // [
  //   { name: 'commonName', value: '127.0.0.1' },
  //   { name: 'countryName', value: 'SG' },
  //   { name: 'localityName', value: '' },
  //   { name: 'stateOrProvinceName', value: '' },
  //   { name: 'organizationName', value: 'ES-LABS' },
  //   { name: 'organizationalUnitName', value: '' },
  //   { name: 'emailAddress', value: '' }
  // ],
  // [{ name: 'commonName', value: '192.168.18.8' }],
  null, // can use null
  {
    // keySize: 1024, // the size for the private key in bits (default: 1024)
    days: 3600, // how long till expiry of the signed certificate (default: 365)
    algorithm: 'sha256', // sign the certificate with specified algorithm (default: 'sha1')
    // extensions: [{ name: 'basicConstraints', cA: true }], // certificate extensions array
    // pkcs7: false, // include PKCS#7 as part of the output (default: false)
    // clientCertificate: false, // generate client cert signed by the original key (default: false)
    // clientCertificateCN: 'jdoe' // client certificate's common name (default: 'John Doe jdoe123')
  }
)
// {
//   private: '-----BEGIN RSA PRIVATE KEY-----\r\n ... \r\n-----END RSA PRIVATE KEY-----\r\n',
//   public: '-----BEGIN PUBLIC KEY-----\r\n ... \r\n-----END PUBLIC KEY-----\r\n',
//   cert: '-----BEGIN CERTIFICATE-----\r\n ... \r\n-----END CERTIFICATE-----\r\n'
// }
console.log(pems.private)
// console.log(pems.public)
console.log(pems.cert)