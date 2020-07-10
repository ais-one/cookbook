# Getting Started

Go to https://firebase.google.com/

Click on get started and register.

**Important** Add you credit details and enable billing


## Create User

1. Goto firebase Authentication

2. Enable Email/Password Sign-in Method

3. Create a user in Firebase Auth with Email/Password login

https://firebase.google.com/docs/auth/web/password-auth


## Firebase Web Client Credentials (subject to change)

Get your firebase web-client credentials from Project -> Settings -> General

Your app, select icon for web application

Client credentials should like like something below:

```
<script src="https://www.gstatic.com/firebasejs/4.13.0/firebase.js"></script>
<script>
  // Initialize Firebase
  var config = {
    apiKey: "...",
    authDomain: "...",
    databaseURL: "...",
    projectId: "...",
    storageBucket: "...",
    messagingSenderId: "..."
  };
  firebase.initializeApp(config);
</script>
```

## Firebase Backend Credentials (subject to change)

Get your firebase backend credentials from Project -> Settings -> Service Accounts


## Firestore

https://firebase.google.com/docs/firestore


## Hosting To Firebase

https://firebase.google.com/docs/hosting/quickstart

0. Setup Google Cloud Storage

Set the correct permissions for the bucket to allow users to view and upload

1. Install Firebase

```
npm install -g firebase-tools (first time)
firebase login (first time)
cd to project folder
firebase init (first time)
add files
```

2. Build the production version first

```
npm run build
# optional: build for production and view the bundle analyzer report
# npm run build --report
```

3. Deploy to Firebase

```
firebase deploy --only hosting
firebase logout
```

# Cloud Storage

## Storage Rules (To Review)

```js
rules_version = "2"
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read;
      allow write: if request.auth != null;
    }
  }
}
```

<!-- https://firebase.google.com/docs/hosting/quickstart
npm install -g firebase-tools -->

## Storage

### Upload & Download Files

1. If public read access enable permissions

2. Upload use signed URL

3. Private download/read access use signed URL
