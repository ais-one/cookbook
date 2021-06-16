/*
 * @license
 * Copyright 2019 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License
 */
export const _fetch = async (path, payload = '') => {
  const headers = {
    'X-Requested-With': 'XMLHttpRequest',
  }
  if (payload && !(payload instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
    payload = JSON.stringify(payload)
  }
  const res = await fetch(path, {
    method: 'POST',
    credentials: 'same-origin',
    headers: headers,
    body: payload,
  })
  if (res.status === 200) {
    // Server authentication succeeded
    return res.json()
  } else {
    // Server authentication failed
    const result = await res.json()
    throw result.error
  }
}

export const registerCredential = async () => {
  const opts = {
    attestation: 'none',
    authenticatorSelection: {
      authenticatorAttachment: 'platform',
      userVerification: 'required',
      requireResidentKey: false
    }
  }
  const options = await _fetch('/webauthn/registerRequest', opts)

  options.user.id = base64url.decode(options.user.id)
  options.challenge = base64url.decode(options.challenge)

  if (options.excludeCredentials) {
    for (let cred of options.excludeCredentials) {
      cred.id = base64url.decode(cred.id)
    }
  }

  const cred = await navigator.credentials.create({ publicKey: options, })

  const credential = {}
  credential.id = cred.id
  credential.rawId = base64url.encode(cred.rawId)
  credential.type = cred.type

  if (cred.response) {
    const clientDataJSON = base64url.encode(cred.response.clientDataJSON)
    const attestationObject = base64url.encode(cred.response.attestationObject)
    credential.response = {
      clientDataJSON, attestationObject,
    }
  }

  localStorage.setItem(`credId`, credential.id)
  // localStorage.setItem(`userName`, options.user.name)
  return await _fetch('/webauthn/registerResponse', credential)
}

export const authenticate = async () => {
  const opts = {}

  let url = '/webauthn/signinRequest'
  const credId = localStorage.getItem(`credId`)
  if (credId) {
    url += `?credId=${encodeURIComponent(credId)}`
  }

  const options = await _fetch(url, opts)

  if (options.allowCredentials.length === 0) {
    console.info('No registered credentials found.')
    return Promise.resolve(null)
  }

  options.challenge = base64url.decode(options.challenge);

  for (let cred of options.allowCredentials) {
    cred.id = base64url.decode(cred.id);
  }
  const cred = await navigator.credentials.get({ publicKey: options, })

  const credential = {}
  credential.id = cred.id
  credential.type = cred.type
  credential.rawId = base64url.encode(cred.rawId)

  if (cred.response) {
    const clientDataJSON = base64url.encode(cred.response.clientDataJSON)
    const authenticatorData = base64url.encode(cred.response.authenticatorData)
    const signature = base64url.encode(cred.response.signature)
    const userHandle = base64url.encode(cred.response.userHandle)
    credential.response = {
      clientDataJSON, authenticatorData, signature, userHandle,
    }
  }

  return await _fetch(`/webauthn/signinResponse`, credential)
}

export const unregisterCredential = async (credId) => {
  localStorage.removeItem('credId')
  // localStorage.removeItem('userName')
  return _fetch(`/webauthn/removeKey?credId=${encodeURIComponent(credId)}`)
}
