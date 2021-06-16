# Keycloak docker-compose
## Reference

https://github.com/keycloak/keycloak-containers/tree/master/docker-compose-examples

## Login

http://127.0.0.1:8081/auth/

select administration console

admin / Pa55w0rd (same as in docker compose file)

## SAML 2 setup

1. create realm called test
2. create client... 
 - test-client
 - saml
 - http://127.0.0.1:3000/api/saml/login/callback
3. create user
 - test-user
 - set the password

4. add 2 test roles (IN test-client)
 - test-client-role-1
 - test-client-role-2

5. go back to user
 - go to Role Mappings Tag
 - select Client Roles test-client
 - add the above 2 roles

6. Mappers
 - client -> test-client -> Mappers
   - Add Builtin
     - role list
 - client -> test-client -> Mappers -> role list
   - Single Role Attribute -> ON

7. Set up express SAML_OPTIONS with the following
- callbackUrl: 'http://127.0.0.1:3000/api/saml/login/callback',
- issuer: 'test-client',
- entryPoint: 'http://127.0.0.1:8081/auth/realms/test/protocol/saml',
- cert: 'MIIClzCCAX8CBgF6A0sAhDANBgkqhkiG9w0BAQsFADAPMQ0wCwYDVQQDDAR0ZXN0MB4XDTIxMDYxMzAyNTMwNFoXDTMxMDYxMzAyNTQ0NFowDzENMAsGA1UEAwwEdGVzdDCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAK97NlCcNOhtH0a0wz5boYKb7TaxogxnlyysOWUre1uI8SC6EBV3G5DHMdg4aWXwuXwy61+JJu70xNzJj155MJ+atGS7eLrxxGl0DNoLu/LU7Vhht+j09MZt5J60DnS76H3pkvzAtRfd1P/d5JEFzWYkI4drBJccYX/nrrx2KZBkXOjwjVcEhsyK5ykA0LX+M+yFDy2w8qEWhxHuSL6enzw8IZ7qdtsF8SHqw7cdCgCJU6+0dxaRAAqmzMkO7BDEkwCJl0M8VaOPGo/SnZIAMYHLIUg1x0h/ecST4NPdqAwgDGtWAcD+Gp7Lr7xfBbKKqnLfg2PJdjs7Z0+NFOeVTvcCAwEAATANBgkqhkiG9w0BAQsFAAOCAQEAeJ2r2yoaQAo6v8MC6iAobOeJoBoezQg/OSQqeA9lygMWmGHpDIjSV7m3PCXwf5H9/NpHgBLt8y5PcjEs99uPfPeUBV/qitTFMuznMyr35e60iaHSdhZVjyCmrKgnIuGa07lng2wFabtpijqzbQJ99kYsWxbBDgbdVnt3jxohG1KKaXkGMyy7suwPgwrbwXfDrpyyj33NT/Dk/2W4Fjrjg8rIkuQypwB0SQLG1cZL9Z2AgW39JeVnP/sOH1gNpCCQwbpgE9hEed80jsYWlvucnFm2aHBtGV+/7/7N3qRRpIvzrNVJoznqDDWU41RxS0NphAwX2ZqprWvN+SCEEhPGGQ==',

