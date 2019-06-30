## Hosting To Firebase

https://firebase.google.com/docs/hosting/quickstart

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

## Storage Rules

```
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read;
      allow write: if request.auth != null;
    }
  }
}
```
