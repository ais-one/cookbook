module.exports = ({ username }) => /*html*/`<!DOCTYPE html>
<html lang="en">
  <head>
    <title>WebAuthn Codelab</title>
    <meta name="description" content="WebAuthn Codelab">
    <link id="favicon" rel="icon" href="https://glitch.com/edit/favicon-app.ico" type="image/x-icon">
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="/style.css">
    <script src="https://cdn.jsdelivr.net/gh/herrjemand/Base64URL-ArrayBuffer@latest/lib/base64url-arraybuffer.js"></script>
  </head>
  <body>
    <h1>WebAuthn codelab</h1>
    <main class="content">
      <h2>Welcome ${username}</h2>
      <p id="uvpa_unavailable" class="hidden">This device does not support User Verifying Platform Authenticator. You can't register a credential.</p>
      <h3>Your registered credentials:</h3>
      <section>
        <div id="list"></div>
      </section>
      <button id="register" class="hidden" >Add a credential</button>
      <a href="/reauth">Try reauth</a>
      <a href="/webauthn/signout">Sign out</a>
    </main>
    <script type="module">
      import { _fetch, registerCredential, unregisterCredential } from '/client.js'

      const register = document.querySelector('#register')

      if (window.PublicKeyCredential) {
        PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
        .then(uvpaa => {
          if (uvpaa) {
            register.classList.remove('hidden')
          } else {
            document.querySelector('#uvpa_unavailable').classList.remove('hidden')
          }
        })
      } else {
        document.querySelector('#uvpa_unavailable').classList.remove('hidden')
      }

      const getCredentials = async () => {
        const res = await _fetch('/webauthn/getKeys');
        const list = document.querySelector('#list');
        list.innerHTML = ''
        for (const cred of res.credentials) {
          const div = document.createElement('div')

          const p = document.createElement('p')
          p.innerHTML = 'Id:  ' + cred.credId + '<br/>' + 'Key: ' + cred.publicKey + '<hr/>'
          const btn = document.createElement('button')
          btn.id = cred.credId
          btn.onclick = removeCredential
          btn.innerHTML = 'Remove'

          div.append(btn)
          div.append(p)

          list.append(div)
        }
      }

      getCredentials()

      const removeCredential = async e => {
        try {
          await unregisterCredential(e.target.id)
          getCredentials()
        } catch (e) {
          alert(e)
        }
      }

      register.addEventListener('click', e => {
        registerCredential(
          // {
          //   attestation: 'none',
          //   authenticatorSelection: { authenticatorAttachment: 'platform', userVerification: 'required', requireResidentKey: false }
          // }
        ).then(user => {
          console.log('xxxxxxxxxxxxxxxxxxxx', user)
          getCredentials()
        }).catch(e => alert(e))
      })
    </script>
  </body>
</html>`
