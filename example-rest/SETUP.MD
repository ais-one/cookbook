# MANDATORY

## Setup Firebase

If you need something already prepared, please request for Service Account Key from author and you can skip to **Front End and backend Setup & Run** section

Steps
- Please set up firebase account
- Create a project
- and enable billing
- create a serviceAccount.json file
- go to firebase authentication and enable authentication using email & password
- go to firestore, enable and use it, create a collection called resource

### Firestore Schema

All fields are string unless indicated

- user (collection)
  - uid (field)
  - adminUid (field)
  - email (field)
  - hash (field)
  - quotaAllocated (field - number)
  - quotaUsed (field - number)
  - token (field)

- resource (collection)
  - uid (field)
  - adminUid (field)
  - resourceId (field)
  - createdDate (field - timestamp)

### Important Create Index For Firestore (Otherwise Searches will Fail)
- collection: resource
  - fields: adminUid ASC
  - fields: createdDate ASC


## Front End and backend Setup & Run

Clone the repo

    git clone https://github.com/ais-one/udemy.git

### Install & run backend

    cd [path-to]/udemy
    cd vue-firebase/functions
    npm i
    npm i -g nodemon
    # add your firebase serviceAccountKey.json in the functions folder

    # run the server on localhost:3000
    npm run local

    # run tests, please adjust timeout in package.json if necessary
    # set the following flags in test/fullTest.js as necessary
    ## testAdminUser, testAdminOnNormalUser, testNormalUser - test all operations and also generating exceptions
    ## let populateDb -  populate firestore

    npm run test


Accessing API Documentation

    http://127.0.0.1:3000/api-docs

NOTE: setup for local server instead of using Firebase serve (so that I can use nodemon), and I can spin up the server faster


### Install & run frontend

    cd [path-to]/udemy
    cd vue-firebase/hosting
    npm i
    npm i -g @vue/cli
    # run the client on localhost:8080
    npm run serve



### Furthur Improvements Required
- pagination is not implemented at the moment, currently, docoments returned have a limit
  - 50 for users (filter based on email)
  - 50 for resouces (filter based on create date range)
  - however, you can use filters to find things in collections with large number of documents
- use only firetore for user (currently it is firestore+auth)
- firestore rules are not set yet
- do soft delete instead
- add use of environment variables to handle various deployment environments

---

## OPTIONAL - DEPLOYMENT ON SERVERLESS

### Firebase CLI

**Installing**

    npm install -g firebase-tools
    # https://firebase.google.com/docs/functions/get-started

**Keeping the tools updated**

    npm install firebase-functions@latest firebase-admin@latest --save

### Functions

**FYI only, already setup**
    firebase init
    # select Functions
    # select [project id]
    # use Javascript
    # use ESLint
    # install dependencies

    # You need to edit the file .eslintrc.json
    # https://github.com/eslint/eslint/issues/8126
    need to change from
    ecmaVersion: 6
    to
    ecmaVersion: 8

**Deploying**
    cd path-to/udemy/vue-firebase/functions
    npm run deploy


### Firestore Rules & Indexes

Not done at the moment


### Hosting

**FYI only, already setup**
    firebase init
    # select Hosting
    # select [project id]
    # chose the distribution folder

**Deploying**
    cd path-to/udemy/vue-firebase/hosting
    npm run build
    npm run deploy
