## Description

Store JS files used by both frontend and backend

- Use ESM to avoid using webpack for compilation on frontend
- For backend refer to NodeJS document on how to use ESM in NodeJS

- Refer to [recipe-node-express](../../recipe-node-express) folder for usage
- Refer to [recipe-vue-nobundler](../../recipe-vue-nobundler) folder for usage
- Refer to [recipe-vue-vite](../../recipe-vue-vite) folder for usage

## Installation

1. from locally
npm install <path-to-this-foder-from-where-you-want-to-install-this>

e.g.

```
cd recipe-node-express
npm install ../@es-labs/esm
```

2. from npm

```
cd recipe-node-express
npm i @es-labs/esm
```

## Publishing packages to npm

```bash
# need to use --access public as it is scoped package on free plan
cd @es-labs/esm
npm publish --access public
```
