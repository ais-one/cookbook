# @es-labs Reusable Components

Consists of two npm installable packages with reusable codes in JS Browser and NodeJS applications

- **@es-labs/esm**: ES modules for use in both JS Browser and NodeJS
- **@es-labs/node**: commonJS codes for use in NodeJS
  - dependent on **@es-labs/node/config.js**
  - default settings for configs are found in **@es-labs/node/config.default.js**

## Installation

1. from locally
npm install <path-to-this-foder-from-where-you-want-to-install-this>

e.g.

```
cd my-project
npm install ../@es-labs/node
```

2. from npm

npm i @es-labs/node
npm i @es-labs/esm


## Publishing packages to npm

```bash
# need to use --access public as it is scoped package on free plan
cd @es-labs/esm
npm publish --access public
cd ../../@es-labs/node
npm publish --access public
```
