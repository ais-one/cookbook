const { SAML } = require('node-saml')

const options = {

}
const saml = new SAML(options)

// await saml.getLogoutResponseUrl({user, samlLogoutRequest}, {additionalParams});
// const {success} = await saml.validateRedirect(query, originalQuery);
// await saml.validatePostResponse(body);
// await saml.validatePostRequest(body);
// await saml.getAuthorizeForm();
// await saml.getAuthorizeUrl(options);
// await saml.getLogoutUrl(user, options);
// saml.generateServiceProviderMetadata(decryptionCert, signingCert);