## Description

Store JS files used by both frontend and backend

- Use ESM to avoid using webpack for compilation on frontend
- For backend refer to NodeJS document on how to use ESM in NodeJS

Refer to [example-app](../../example-app) folder for usage
Refer to [example-vite](../../example-vite) folder for usage
Refer to [example-native](../../example-native) folder for usage

## Installation

1. from locally
npm install <path-to-this-foder-from-where-you-want-to-install-this>

e.g.

```
cd example-app
npm install ../@es-labs/esm
```

2. from npm

```
cd example-app
npm i @es-labs/esm
```


## Publishing packages to npm

```bash
# need to use --access public as it is scoped package on free plan
cd @es-labs/esm
npm publish --access public
```
