# Keycloak docker-compose
## Reference

https://github.com/keycloak/keycloak-containers/tree/master/docker-compose-examples

## Login

http://127.0.0.1:8081/auth/

select administration console

admin / Pa55w0rd (same as in docker compose file)

## Quick Setup

Add new realm with import using the file  [realm-export.json](realm-export.json)

This will setup
- a user
- a SAML2 client
- an OIDC client

## Optional Manual SAML2 Setup

1. create realm called test

2. create client... 
 - test-saml-client
 - saml
 - http://127.0.0.1:3000/api/saml/callback

3. create user
 - set username: (test-user)
 - set password: (password)

4. add 2 test roles (IN test-saml-client)
 - test-client-role-1
 - test-client-role-2

5. go back to user
 - go to Role Mappings Tag
 - select Client Roles test-saml-client
 - add the above 2 roles

6. Mappers
 - client -> test-saml-client -> Mappers
   - Add Builtin
     - role list
 - client -> test-saml-client -> Mappers -> role list
   - Single Role Attribute -> ON

7. Set up express SAML_OPTIONS with the following
- callbackUrl: 'http://127.0.0.1:3000/api/saml/callback',
- issuer: 'test-saml-client',
- entryPoint: 'http://127.0.0.1:8081/auth/realms/test/protocol/saml',
- cert: 'MIIClzCCAX8CBgF6A0sAhDANBgkqhkiG9w0BAQsFADAPMQ0wCwYDVQQDDAR0ZXN0MB4XDTIxMDYxMzAyNTMwNFoXDTMxMDYxMzAyNTQ0NFowDzENMAsGA1UEAwwEdGVzdDCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAK97NlCcNOhtH0a0wz5boYKb7TaxogxnlyysOWUre1uI8SC6EBV3G5DHMdg4aWXwuXwy61+JJu70xNzJj155MJ+atGS7eLrxxGl0DNoLu/LU7Vhht+j09MZt5J60DnS76H3pkvzAtRfd1P/d5JEFzWYkI4drBJccYX/nrrx2KZBkXOjwjVcEhsyK5ykA0LX+M+yFDy2w8qEWhxHuSL6enzw8IZ7qdtsF8SHqw7cdCgCJU6+0dxaRAAqmzMkO7BDEkwCJl0M8VaOPGo/SnZIAMYHLIUg1x0h/ecST4NPdqAwgDGtWAcD+Gp7Lr7xfBbKKqnLfg2PJdjs7Z0+NFOeVTvcCAwEAATANBgkqhkiG9w0BAQsFAAOCAQEAeJ2r2yoaQAo6v8MC6iAobOeJoBoezQg/OSQqeA9lygMWmGHpDIjSV7m3PCXwf5H9/NpHgBLt8y5PcjEs99uPfPeUBV/qitTFMuznMyr35e60iaHSdhZVjyCmrKgnIuGa07lng2wFabtpijqzbQJ99kYsWxbBDgbdVnt3jxohG1KKaXkGMyy7suwPgwrbwXfDrpyyj33NT/Dk/2W4Fjrjg8rIkuQypwB0SQLG1cZL9Z2AgW39JeVnP/sOH1gNpCCQwbpgE9hEed80jsYWlvucnFm2aHBtGV+/7/7N3qRRpIvzrNVJoznqDDWU41RxS0NphAwX2ZqprWvN+SCEEhPGGQ==',

## Optional Manual OIDC Setup

https://github.com/hkiang01/fastapi-keycloak-oidc-auth


Create oidc client called test-oidc-client on keycloak

Root URL: http://127.0.0.1:3000/api/oidc
Valid Redirect URIS: http://127.0.0.1:3000/api/oidc/auth
Admin URL: http://127.0.0.1:3000/api/oidc/login
Web Origins: http://127.0.0.1:3000/api/oidc/login


https://www.keycloak.org/docs/latest/server_admin/#_client-credentials


NOTES:
- if need client secret
- if need client id & client auth in header Basic Auth

## Kubernetes

FYI Only

https://hkiang01.github.io/kubernetes/keycloak/


## To Document Better

http://127.0.0.1:8081/auth/realms/test/.well-known/openid-configuration

http://127.0.0.1:8081/auth/realms/test/protocol/openid-connect/certs
```json
{
  "keys": [
    {
      "kid": "2361pQ090dZx8ICP9jf-_qqhORqTgnKjpd2UBxtselg",
      "kty": "RSA",
      "alg": "RS256",
      "use": "sig",
      "n": "r3s2UJw06G0fRrTDPluhgpvtNrGiDGeXLKw5ZSt7W4jxILoQFXcbkMcx2DhpZfC5fDLrX4km7vTE3MmPXnkwn5q0ZLt4uvHEaXQM2gu78tTtWGG36PT0xm3knrQOdLvofemS_MC1F93U_93kkQXNZiQjh2sElxxhf-euvHYpkGRc6PCNVwSGzIrnKQDQtf4z7IUPLbDyoRaHEe5Ivp6fPDwhnup22wXxIerDtx0KAIlTr7R3FpEACqbMyQ7sEMSTAImXQzxVo48aj9KdkgAxgcshSDXHSH95xJPg092oDCAMa1YBwP4ansuvvF8Fsoqqct-DY8l2OztnT40U55VO9w",
      "e": "AQAB",
      "x5c": [
        "MIIClzCCAX8CBgF6A0sAhDANBgkqhkiG9w0BAQsFADAPMQ0wCwYDVQQDDAR0ZXN0MB4XDTIxMDYxMzAyNTMwNFoXDTMxMDYxMzAyNTQ0NFowDzENMAsGA1UEAwwEdGVzdDCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAK97NlCcNOhtH0a0wz5boYKb7TaxogxnlyysOWUre1uI8SC6EBV3G5DHMdg4aWXwuXwy61+JJu70xNzJj155MJ+atGS7eLrxxGl0DNoLu/LU7Vhht+j09MZt5J60DnS76H3pkvzAtRfd1P/d5JEFzWYkI4drBJccYX/nrrx2KZBkXOjwjVcEhsyK5ykA0LX+M+yFDy2w8qEWhxHuSL6enzw8IZ7qdtsF8SHqw7cdCgCJU6+0dxaRAAqmzMkO7BDEkwCJl0M8VaOPGo/SnZIAMYHLIUg1x0h/ecST4NPdqAwgDGtWAcD+Gp7Lr7xfBbKKqnLfg2PJdjs7Z0+NFOeVTvcCAwEAATANBgkqhkiG9w0BAQsFAAOCAQEAeJ2r2yoaQAo6v8MC6iAobOeJoBoezQg/OSQqeA9lygMWmGHpDIjSV7m3PCXwf5H9/NpHgBLt8y5PcjEs99uPfPeUBV/qitTFMuznMyr35e60iaHSdhZVjyCmrKgnIuGa07lng2wFabtpijqzbQJ99kYsWxbBDgbdVnt3jxohG1KKaXkGMyy7suwPgwrbwXfDrpyyj33NT/Dk/2W4Fjrjg8rIkuQypwB0SQLG1cZL9Z2AgW39JeVnP/sOH1gNpCCQwbpgE9hEed80jsYWlvucnFm2aHBtGV+/7/7N3qRRpIvzrNVJoznqDDWU41RxS0NphAwX2ZqprWvN+SCEEhPGGQ=="
      ],
      "x5t": "C6P268EAdKTj5Y31QitIL99b5dE",
      "x5t#S256": "GGTNWT9haxfSjsFFI5AQLuDHXUyEM2hxOrcBHOSdYkQ"
    }
  ]
}
```

## Verify with jwt.io

### Token

eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIyMzYxcFEwOTBkWng4SUNQOWpmLV9xcWhPUnFUZ25LanBkMlVCeHRzZWxnIn0.eyJleHAiOjE2MjQ0MzAyMjIsImlhdCI6MTYyNDQyOTkyMiwiYXV0aF90aW1lIjoxNjI0NDI5OTIyLCJqdGkiOiIxYjViYmE5YS0zMjhkLTQ0NTQtYWEwZS1iZjZmZmQwNzVhMjkiLCJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwODEvYXV0aC9yZWFsbXMvdGVzdCIsImF1ZCI6WyJ0ZXN0LWNsaWVudCIsImFjY291bnQiXSwic3ViIjoiYWE3NDQ3ZjAtMzlmMS00NmRlLWEzZGUtNTg0ZDVhZTg4MDI2IiwidHlwIjoiQmVhcmVyIiwiYXpwIjoidGVzdC1vaWRjLWNsaWVudC1mYXZ2Iiwic2Vzc2lvbl9zdGF0ZSI6IjdlMjQxNzdjLTk4ZmItNDYyMC05ZjRlLWRlMjdhNjA0NmM5OSIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiaHR0cDovLzEyNy4wLjAuMTozMDAwL2FwaS9vaWRjL2xvZ2luIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJkZWZhdWx0LXJvbGVzLXRlc3QiLCJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsidGVzdC1vaWRjLWNsaWVudC1mYXZ2Ijp7InJvbGVzIjpbInRlc3Qtb2lkYy1jbGllbnQtZmF2di1yb2xlLTIiLCJ0ZXN0LW9pZGMtY2xpZW50LWZhdnYtcm9sZS0xIl19LCJ0ZXN0LWNsaWVudCI6eyJyb2xlcyI6WyJ0ZXN0LWNsaWVudC1yb2xlLTIiLCJ0ZXN0LWNsaWVudC1yb2xlLTEiXX0sImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoiZW1haWwgcHJvZmlsZSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwicHJlZmVycmVkX3VzZXJuYW1lIjoidGVzdC11c2VyIn0.LmVlz5Rf8_auVGtpZVbpNCbWBMu7NNu9jXmMFaiL_vELG0BXgeM3_P0vGYlT8xv6am3WFHV8O467hlMAE6ILnMvia1kT5YgtAk-MmqipcfnsfuesRpoL7unZspk4rSONZmAeoYAszqMcuPFCKRfG5fUAHsxUVH5erHV1HLSJpQF3oNsSg97cGrZL4xaxBccirigpF8-1Gn0B_DRhToT2bMnNhlLGBxcZEdr_nkFI-wjGpiDxG1zPZkFdFctu3u8h6kwtXfr2XiB2uctb4AIxXu9F4F0lkMsZsR52jBOTDTqht_dKhLcRXcwvNsYL6n8WMNCpeFOLfDI4qO1Aytz2nw

### Public Key

-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAr3s2UJw06G0fRrTDPluh
gpvtNrGiDGeXLKw5ZSt7W4jxILoQFXcbkMcx2DhpZfC5fDLrX4km7vTE3MmPXnkw
n5q0ZLt4uvHEaXQM2gu78tTtWGG36PT0xm3knrQOdLvofemS/MC1F93U/93kkQXN
ZiQjh2sElxxhf+euvHYpkGRc6PCNVwSGzIrnKQDQtf4z7IUPLbDyoRaHEe5Ivp6f
PDwhnup22wXxIerDtx0KAIlTr7R3FpEACqbMyQ7sEMSTAImXQzxVo48aj9KdkgAx
gcshSDXHSH95xJPg092oDCAMa1YBwP4ansuvvF8Fsoqqct+DY8l2OztnT40U55VO
9wIDAQAB
-----END PUBLIC KEY-----

### Private Key

r3s2UJw06G0fRrTDPluhgpvtNrGiDGeXLKw5ZSt7W4jxILoQFXcbkMcx2DhpZfC5fDLrX4km7vTE3MmPXnkwn5q0ZLt4uvHEaXQM2gu78tTtWGG36PT0xm3knrQOdLvofemS_MC1F93U_93kkQXNZiQjh2sElxxhf-euvHYpkGRc6PCNVwSGzIrnKQDQtf4z7IUPLbDyoRaHEe5Ivp6fPDwhnup22wXxIerDtx0KAIlTr7R3FpEACqbMyQ7sEMSTAImXQzxVo48aj9KdkgAxgcshSDXHSH95xJPg092oDCAMa1YBwP4ansuvvF8Fsoqqct-DY8l2OztnT40U55VO9w



https://developer.okta.com/docs/guides/refresh-tokens/refresh-token-rotation/
https://datatracker.ietf.org/doc/html/rfc6749
https://openid.net/specs/openid-connect-core-1_0.html#TokenRequest


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
