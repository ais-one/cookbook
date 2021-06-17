## Description

Node JS only libraries for backend

- auth: authorization
- comms:  for communications
- express: for express JS framework 
  - config.js
  - config.default.js
- services: various services
  - db: databases
  - mq: message queue
  - others gcp, keyv, redis, webpush, websocket

Refer to [example-app](../../example-app) folder for usage

## Installation

1. from locally
npm install <path-to-this-foder-from-where-you-want-to-install-this>

e.g.

```
cd example-app
npm install ../@es-labs/node
```

2. from npm

```
cd example-app
npm i @es-labs/node
```

## Publishing packages to npm

```bash
# need to use --access public as it is scoped package on free plan
cd @es-labs/node
npm publish --access public
```
