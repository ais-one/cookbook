Reference

https://github.com/keycloak/keycloak-containers/tree/master/docker-compose-examples

SAML 2 setup

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
