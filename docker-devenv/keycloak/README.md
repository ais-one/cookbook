# Keycloak docker-compose
## Reference

https://github.com/keycloak/keycloak-containers/tree/master/docker-compose-examples

## Login

http://127.0.0.1:8081/auth/

select administration console

admin / Pa55w0rd (same as in docker compose file)

## SAML2 setup

1. create realm called test

2. create client... 
 - test-client
 - saml
 - http://127.0.0.1:3000/api/saml/login/callback

3. create user
 - set username: (test-user)
 - set password: (password)

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



## OIDC Setup

https://github.com/hkiang01/fastapi-keycloak-oidc-auth


Create oidc client called test-oidc-client-favv on keycloak

Root URL: http://localhost:8000
Valid Redirect URIS: http://localhost:8000/auth
Admin URL: http://localhost:8000/login
Web Origins: http://localhost:8000/login

```py
import json
import logging
from typing import Dict

import jwt
import requests
import uvicorn
from fastapi import FastAPI
from fastapi.security.utils import get_authorization_scheme_param
from starlette.requests import Request
from starlette.responses import RedirectResponse

APP_BASE_URL = "http://localhost:8000/"
KEYCLOAK_BASE_URL = "http://localhost:8081"
CLIENT_ID = "test-oidc-client-favv"

AUTH_URL = (
    f"{KEYCLOAK_BASE_URL}/auth/realms/Clients"
    f"/protocol/openid-connect/auth?client_id={CLIENT_ID}}&response_type=code"
)
TOKEN_URL = (
    f"{KEYCLOAK_BASE_URL}/auth/realms/Clients/protocol/openid-connect/token"
)


logger = logging.getLogger(__name__)
logger.setLevel("DEBUG")

app = FastAPI()


@app.get("/login")
async def login() -> RedirectResponse:
    return RedirectResponse(AUTH_URL)


@app.get("/auth")
async def auth(code: str) -> RedirectResponse:
    payload = (
        f"grant_type=authorization_code&code={code}"
        f"&redirect_uri={APP_BASE_URL}&client_id={CLIENT_ID}}"
    )
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    token_response = requests.request(
        "POST", TOKEN_URL, data=payload, headers=headers
    )

    token_body = json.loads(token_response.content)
    access_token = token_body["access_token"]

    response = RedirectResponse(url="/")
    response.set_cookie("Authorization", value=f"Bearer {access_token}")
    return response


@app.get("/")
async def root(request: Request,) -> Dict:
    authorization: str = request.cookies.get("Authorization")
    scheme, credentials = get_authorization_scheme_param(authorization)

    decoded = jwt.decode(
        credentials, verify=False
    )  # TODO input keycloak public key as key, disable option to verify aud
    logger.debug(decoded)

    return {"message": "You're logged in!"}


if __name__ == "__main__":
    uvicorn.run(app, port=8000, loop="asyncio")
```

## Kubernetes

FYI Only

https://hkiang01.github.io/kubernetes/keycloak/