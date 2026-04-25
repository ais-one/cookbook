## Description

Shared Javascript ES Module library for Javascript applications (node, web, isomorphic, vue, schemas)

- vanilla — runs as-is, no setup, no dependencies
  - web: codes here run only on the frontend web
  - iso: codes here can run on both frontend and backend
- compiled — requires a build step and/or external dependencies
  - node: [BUILD] codes here run only on the backend app (including express)
  - vue: [BUILD] for VueJS applications
- schemas: common schemas

### Shareable packages - TODO

projects which can be uploaded to npm as package here
should avoid using files/folders in common folder
