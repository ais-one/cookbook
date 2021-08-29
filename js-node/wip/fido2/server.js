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

// init project
const express = require('express')
const session = require('express-session')
const webauthn = require('./webauthn')
const app = express()
const port = 3000

app.use(express.json())
app.use('/', express.static('public'))

app.use(session({
  secret: 'secret', // You should specify a real secret here
  resave: true,
  saveUninitialized: false,
  // proxy: true,
  cookie:{
    httpOnly: true,
    // secure: false, // if https
    // sameSite: 'none'
    path: '/'
  }
}))

process.env.ORIGIN = 'http://localhost:3000'

const indexPage = require('./views/index')
const homePage = require('./views/home')
const reauthPage = require('./views/reauth')

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', (req, res) => {
  // Check session
  if (req.session.username) {
    // If user is signed in, redirect to `/reauth`.
    res.redirect(307, '/reauth')
    return
  }
  res.type('text/html')
  res.status(200).send( indexPage() )
})

app.get('/home', (req, res) => {
  if (!req.session.username || req.session['signed-in'] != 'yes') {
    // If user is not signed in, redirect to `/`.
    res.redirect(307, '/')
    return
  }
  // `home.html` shows sign-out link
  res.type('text/html')
  res.status(200).send( homePage({ username: req.session.username }) )
})

app.get('/reauth', (req, res) => {
  console.log(req.session)
  const username = req.session.username;
  if (!username) {
    res.redirect(302, '/')
    return
  }
  // Show `reauth.html`.
  // User is supposed to enter a password (which will be ignored)
  // Make XHR POST to `/signin`
    res.type('text/html')
  res.status(200).send( reauthPage({ username: username }) )
});

app.get('/.well-known/assetlinks.json', (req, res) => {
  const assetlinks = [];
  const relation = [
    'delegate_permission/common.handle_all_urls',
    'delegate_permission/common.get_login_creds',
  ];
  assetlinks.push({
    relation: relation,
    target: {
      namespace: 'web',
      site: process.env.ORIGIN,
    },
  })
  if (process.env.ANDROID_PACKAGENAME && process.env.ANDROID_SHA256HASH) {
    assetlinks.push({
      relation: relation,
      target: {
        namespace: 'android_app',
        package_name: process.env.ANDROID_PACKAGENAME,
        sha256_cert_fingerprints: [process.env.ANDROID_SHA256HASH],
      },
    })
  }
  res.json(assetlinks);
})

app.use('/webauthn', webauthn)

// listen for req :)
const listener = app.listen(port || process.env.PORT, () => console.log('Your app is listening on port ' + listener.address().port));
