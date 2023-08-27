# Keycloak docker-compose
## References

- https://openidconnect.net/
- https://github.com/keycloak/keycloak-containers/tree/master/docker-compose-examples
- https://www.redpill-linpro.com/techblog/2022/10/20/into_to_oidc_with_keycloak_and_vertx.html

## Notees

Current Keycloak Version: 22.0.1

## Login

- http://127.0.0.1:8081
- select administration console
- admin / admin

## Quick Setup

Add new realm with import using the file  [realm-export.json](realm-export.json)... Might Not Work...


## Setting Up SSO (Working Example)

### Realm

- Create `dev` realm
- Set Require SSL to `None`

### Realm User

- Create User named: test
- Add password credentials named: test

### Realm Client - OIDC

Select client in the left menu and click Create client.
  - Client type: OpenID Connect.
  - Client ID: dev-client-oidc.
  (Next page - capability config)
  - Client authentication to on.
  (Next page - login settings)
  - Root URL: http://127.0.0.1:3000
  - Home URL: http://127.0.0.1:3000/sso.html
  - Valid Redirect URLS: http://127.0.0.1:3000/api/oidc/auth
  (Save)

Explore Keycloak OpenID Connect discovery endpoint on 127.0.0.1:8081/realms/dev/.well-known/openid-configuration

Setup the app env variables

```
OIDC_OPTIONS='{
  "URL": "http://127.0.0.1:8081/realms/dev/protocol/openid-connect",
  "CLIENT_ID": "dev-client-oidc",
  "CLIENT_SECRET": "<Get this value from oidc client, Credentials Tab",
  "CALLBACK": "http://127.0.0.1:3000/sso.html"
}'
```

NOTE ONLY: https://www.keycloak.org/docs/latest/server_admin/#_client-credentials

### Realm Client - SAML

Select client in the left menu and click Create client.
  - Client type: SAML.
  - Client ID: dev-client-saml.
  (Next page - login settings)
  - Root URL: http://127.0.0.1:3000
  - Home URL: http://127.0.0.1:3000/sso.html
  - Valid Redirect URLS: http://127.0.0.1:3000/api/saml/callback
  (Save)
  - Settings -> Signature and Encryption -> sign documents = On
    - sha256, none, exclusive
  - Settings -> Signature and Encryption -> sign assertions = Off
  - Keys -> Signing keys config = Off
  - Keys -> Encryption keys config = Off
  - Settings -> SAML capabilities -> Name ID format = username
  - Settings -> SAML capabilities -> Force POST binding = On
  - Settings -> SAML capabilities -> Include AuthnStatement = On
  - NOTE: there is no client secret created

Setup the app env variables

```
SAML_OPTIONS='{
  "cert": "<Get Certificate from Keys Tab>",
  "callbackUrl": "http://127.0.0.1:3000/api/saml/callback",  
  "entryPoint": "http://127.0.0.1:8081/realms/dev/protocol/saml",
  "issuer": "dev-client-saml"
}'

```


## Kubernetes - FYI Only

https://hkiang01.github.io/kubernetes/keycloak/

---

## To Document Better

- http://127.0.0.1:8081/realms/test/.well-known/openid-configuration
- http://127.0.0.1:8081/realms/test/protocol/openid-connect/certs
- https://developer.okta.com/docs/guides/refresh-tokens/refresh-token-rotation/
- https://datatracker.ietf.org/doc/html/rfc6749
- https://openid.net/specs/openid-connect-core-1_0.html#TokenRequest


### OIDC HTTP Commands

```
POST /token HTTP/1.1
Host: server.example.com
Authorization: Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW
Content-Type: application/x-www-form-urlencoded

grant_type=refresh_token&refresh_token=tGzv3JOkF0XG5Qx2TlKWIA

http --form POST https://${yourOktaDomain}/oauth2/default/v1/token \
  accept:application/json \
  authorization:'Basic MG9hYmg3M...' \
  cache-control:no-cache \
  content-type:application/x-www-form-urlencoded \
  grant_type=refresh_token \
  redirect_uri=http://localhost:8080 \
  scope=offline_access%20openid \
  refresh_token=MIOf-U1zQbyfa3MUfJHhvnUqIut9ClH0xjlDXGJAyqo

{
    "access_token": "eyJhbGciOiJ[...]K1Sun9bA",
    "token_type": "Bearer",
    "expires_in": 3600,
    "scope": "offline_access%20openid",
    "refresh_token": "MIOf-U1zQbyfa3MUfJHhvnUqIut9ClH0xjlDXGJAyqo",
    "id_token": "eyJraWQiO[...]hMEJQX6WRQ"
}
```
