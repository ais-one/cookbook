# Setup

1. Follow steps in document below to create your own MongoDB Atlas Cluster

https://docs.atlas.mongodb.com/getting-started/

2. Setup Stitch

https://docs.mongodb.com/stitch/procedures/create-stitch-app/

3. Create a User

https://docs.mongodb.com/stitch/authentication/

4. Link to Mongo Atlas Cluster & Define Roles & Permissions

https://docs.mongodb.com/stitch/mongodb/


# Optional

Using Google To Authenticate

1. Setup

https://docs.mongodb.com/stitch/authentication/google/


2. Example

https://docs.mongodb.com/guides/stitch/react_googleauth/

Add the following code in the main.js or callback route created () function

Change React setState to Vuex dispatch

```js
import { Stitch, GoogleRedirectCredential } from "mongodb-stitch-browser-sdk";

async setupStitch() {
  //copy the name of your google-auth enabled stitch application here
  //the name of the app will typically be the stitch application name
  //with a "-"" + random string appended
  const appId = 'authentication_test-htbrq';

  // Get a client for your Stitch app, or instantiate a new one
  const client = Stitch.hasAppClient(appId)
    ? Stitch.getAppClient(appId)
    : Stitch.initializeAppClient(appId);

  //manage user authentication state
  
  // Check if this user has already authenticated and we're here
  // from the redirect. If so, process the redirect to finish login.
  if (client.auth.hasRedirectResult()) {
    await client.auth.handleRedirectResult().catch(console.error);
    console.log("Processed redirect result.")
  }

  if (client.auth.isLoggedIn) {
    // The user is logged in. Add their user object to component state.
    currentUser = client.auth.user;
    this.setState({ currentUser });
  } else {
    // The user has not yet authenticated. Begin the Google login flow.
    const credential = new GoogleRedirectCredential();
    client.auth.loginWithRedirect(credential);
  }
}
```