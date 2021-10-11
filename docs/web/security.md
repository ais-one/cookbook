## Support

The following are supported
- access_token and refresh_token handling by self-made auth server
  - password login + OTP
  - SAML2
  - OAuth2
- access_token and refresh_token handling by certified auth servers (using keycloak in our case)
  - OpenID Connect (OIDC)
    - grant types are
      - authorization_code
      - refresh_token

- https://auth0.com/docs/flows/call-your-api-using-the-authorization-code-flow
- https://stackoverflow.com/questions/11068892/oauth-2-0-authorization-header
- https://datatracker.ietf.org/doc/html/rfc6750#section-2.1


## SRI & Cross Origin
- https://github.com/bigskysoftware/htmx/issues/261#issuecomment-753850081
- https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity
- https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin
- crossorigin="anonymous" will not send credentials

To find SRI for unpkg, `https://unpkg.com/htmx.org@1.0.2`, use `https://unpkg.com/htmx.org@1.0.2?meta`

```html
<script src="https://unpkg.com/htmx.org@1.0.2" integrity="sha384-uG2fggOnt72f9yU5g6r04wPKVnlrpuTRachw1fB6euaHlWgObEcF9zSrDBuBMZ9H" crossorigin="anonymous"></script>
```