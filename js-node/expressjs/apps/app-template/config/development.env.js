const selfsigned = require('selfsigned')
const samlPems = selfsigned.generate(null, { days: 30, algorithm: 'sha256' })

module.exports = {
  SAML_DECRYPTION_CERT: samlPems.cert, // { private, cert }
  SAML_OPTIONS: {
    // NOTE: need to setup keycloak for SAML see readme in docker-devenv folder
    issuer: 'test-saml-client',
    callbackUrl: 'http://127.0.0.1:3000/api/saml/callback',
    entryPoint: 'http://127.0.0.1:8081/auth/realms/test/protocol/saml',
    // PEM in single string, this property is to ensure Response not from spoofed IDP
    // cert: fs.readFileSync('/path/to/adfs.acme_tools.com.crt', 'utf-8'),
    cert: 'MIIClzCCAX8CBgF6A0sAhDANBgkqhkiG9w0BAQsFADAPMQ0wCwYDVQQDDAR0ZXN0MB4XDTIxMDYxMzAyNTMwNFoXDTMxMDYxMzAyNTQ0NFowDzENMAsGA1UEAwwEdGVzdDCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAK97NlCcNOhtH0a0wz5boYKb7TaxogxnlyysOWUre1uI8SC6EBV3G5DHMdg4aWXwuXwy61+JJu70xNzJj155MJ+atGS7eLrxxGl0DNoLu/LU7Vhht+j09MZt5J60DnS76H3pkvzAtRfd1P/d5JEFzWYkI4drBJccYX/nrrx2KZBkXOjwjVcEhsyK5ykA0LX+M+yFDy2w8qEWhxHuSL6enzw8IZ7qdtsF8SHqw7cdCgCJU6+0dxaRAAqmzMkO7BDEkwCJl0M8VaOPGo/SnZIAMYHLIUg1x0h/ecST4NPdqAwgDGtWAcD+Gp7Lr7xfBbKKqnLfg2PJdjs7Z0+NFOeVTvcCAwEAATANBgkqhkiG9w0BAQsFAAOCAQEAeJ2r2yoaQAo6v8MC6iAobOeJoBoezQg/OSQqeA9lygMWmGHpDIjSV7m3PCXwf5H9/NpHgBLt8y5PcjEs99uPfPeUBV/qitTFMuznMyr35e60iaHSdhZVjyCmrKgnIuGa07lng2wFabtpijqzbQJ99kYsWxbBDgbdVnt3jxohG1KKaXkGMyy7suwPgwrbwXfDrpyyj33NT/Dk/2W4Fjrjg8rIkuQypwB0SQLG1cZL9Z2AgW39JeVnP/sOH1gNpCCQwbpgE9hEed80jsYWlvucnFm2aHBtGV+/7/7N3qRRpIvzrNVJoznqDDWU41RxS0NphAwX2ZqprWvN+SCEEhPGGQ==',

    privateKey: samlPems.private, // for signature
    privateCert: samlPems.cert,
    decryptionPvk: samlPems.private, // optional private key that will be used to attempt to decrypt any encrypted assertions that are received
    signatureAlgorithm: 'sha256',

    // authnContext: 'http://schemas.microsoft.com/ws/2008/06/identity/authenticationmethod/password',
    // authnContext: 'http://schemas.microsoft.com/ws/2008/06/identity/authenticationmethod/windows', //  use AD
    acceptedClockSkewMs: -1, // DGAF on time diff between IDP and SP
    identifierFormat: null,
    // this is configured under the Advanced tab in AD FS relying party
    // RACComparison: 'minimum', // default to exact RequestedAuthnContext Comparison Type: minimum, exact (sometimes cause problems)
    disableRequestedAuthnContext: true,
    validateInResponseTo: false,

    // wantAssertionsSigned: true,
  }
}
