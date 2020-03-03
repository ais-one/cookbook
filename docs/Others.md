## JWT
- http://self-issued.info/docs/draft-ietf-oauth-v2-bearer.html#ExAccTokResp
- https://stackoverflow.com/questions/42917170/setting-the-httponly-attribute-for-the-nodejs-cookie-header

## Technical Debt
- try to use as little libraries/dependencies as possible
- use native NodeJS or Javascript
  - vee-validate from version 2 to 3 broke many things, might as well stick with HTML5 validation
  - momentjs is too big, date-fns from version 1 to 2 broke things, use native JS Date Object, Intl.DateTimeFormat, etc. instead
  - nuxt-auth could not handle 2FA or refresh token so cannot be used


## Local (without docker)

WSL Ubuntu
- SQLite
- MongoDB
- Redis
- bullmq

## Google Cloud

https://cloud.google.com/appengine/docs/standard/nodejs/quickstart
https://cloud.google.com/memorystore/docs/redis
https://www.mongodb.com/cloud/atlas
https://cloud.google.com/pubsub/docs