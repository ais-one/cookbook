# Cloud

Supported Cloud Platforms
- Aliyun
- AWS

Try to use terraform (TODO refer to DSO project)

## Install CLI

- Aliyun
  - tbd
- AWS
  - AWS-cli
- Others
  - kubectl (for kubernetes)
  - openshift
  - etc.

## IAM and Role Policy and Service Keys

Associate appropriate policy and/or role to IAM user. WIP

## Minimal Permissions And Components Used

- Object Storage
  - Storage Admin
  - Storage Object Admin
- Cloud Run
  - Service Account User
  - Cloud Run Admin
- Cloud Function
- ECI instance (aliyun)
- Container Registy
- Load Balancer
- Resource Group
- VPC + VSwitch, Elastic IP, Security Group
- Logger

## Hosting Static Website on Aliyun OSS

TBD

## Deploy And Run API on Aliyun Function Compute

TBD

**Notes:**

How to check if app is updated
- Need to check if service deployed properly
- Clean up
  - service revisions
  - container images


## Cloudflare

1. Use Full SSL

https://serverfault.com/questions/995010/putting-google-cloud-platform-cloud-run-behind-cloud-flare

2. Set SSL Edge Certificate Flag (Not Really Needed)

https://cloud.google.com/run/docs/mapping-custom-domains#dns_update

3. Firewall -> Tools -> Rate Limiting

Set filter for login API

https://community.cloudflare.com/t/same-type-of-harmful-requests-slow-the-server/188520/4

# Firebase Getting Started

Go to https://firebase.google.com/

Click on get started and register. **Important** Add you credit details and enable billing

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
<script src="https://www.gstatic.com/firebasejs/10.0.0/firebase.js"></script>
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

## Messaging

Use Firebase Messaging for Push Notifications
