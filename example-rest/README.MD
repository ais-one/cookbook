# README

https://scotch.io/tutorials/vue-authentication-and-route-handling-using-vue-router
https://scotch.io/tutorials/managing-user-permissions-in-vue-using-casl
https://medium.com/@jqualls/firebase-firestore-unique-constraints-d0673b7a4952

TBD:
1. use imports/exports
https://timonweb.com/posts/how-to-enable-es6-imports-in-nodejs/
https://medium.com/@pariola/using-es6-in-cloud-functions-387af36bcee3
https://codeburst.io/es6-in-cloud-functions-for-firebase-959b35e31cb0
https://github.com/jthegedus/firebase-gcp-examples/tree/master/firebase-functions-es6-babel
2. try out GraphQL
3. JSON or CSV exports https://itnext.io/csv-or-json-export-with-firebase-functions-fa4a4b1416aa

Please go to SETUP.MD for getting the project up and running

The README here discusses more on design


# Design & Implementation Exercise

## Requirements

Design and implement a simple PaaS service with the following
 * user management
 * resource management
 * quota management

## Basic Specs

 * admin can create, list, delete users and their resources, set quota 
 * authenticate using email and password
 * create, list & delete own resources
 * cannot create more resources than allowed quota

## Backend Design

Considerations
 * scalability
 * ease of implementation, maintenence, etc.
 * future use-case expansion
 * documentation & cloud platform cost (e.g. Firestore has costs for reading per record)

### Initial (RDBMS)

Start off with RDBMS where you can use tables and relations

#### Schema

Company
- id, name, createdDate, deletedDate

User
- id, companyId, email, MD5/SHA256, role (admin/user), quota, createdDate, deletedDate

Resource
- id, resourceUuid, resourceType, userId, createdDate, deletedDate

deletedDate is used for indicating Soft Delete records / documents

#### Relations

Company-User (1:N)
- 1 company can have many users
- 1 user belongs to 1 company only

User-Resource (1:N)
- 1 user can have many resources
- 1 resource belongs to 1 user only

### 2nd Try (Firestore NoSQL)

See if a NoSQL solution using Firestore can be achieved, consider how paging, relations, indexes, etc. will be handled

- Company is not needed, the person who signs up on the platform is the admin, admin then adds and remove users
- Authentication can use Firebase Auth

#### Schema

User
- uid (Key), adminUid, email, SHA256, quotaAllocated, quotaUsed, createdDate, deletedDate
- uid === adminUid means admin user

Resource
- uuid (Key), resourceUuid, resourceType, uid, adminUid, createdDate, deletedDate

#### Relations
User-Resource (1:N)
- 1 user can have many resources
- 1 resource belongs to 1 user only

### Proposed Design & Implementation

* Use Firebase Firestore as backend data
* Use Firebase Functions with express & OpenAPI to implement API Server
* Use Vue as frontend (connect using web API instead of REST), hosted on Firebase Storage

#### API
 * /signup
 * /login
 * /users
   * create, find, findOne (not used by UI), update, delete
 * /resources
   * create, find, findOne (not used by UI), delete


## Links
- https://medium.com/@paul.allies/stateless-auth-with-express-passport-jwt-7a55ffae0a5c
- https://medium.com/front-end-hacking/learn-using-jwt-with-passport-authentication-9761539c4314
- https://bigcodenerd.org/enforce-cloud-firestore-unique-field-values/
- https://medium.com/@jqualls/firebase-firestore-unique-constraints-d0673b7a4952


