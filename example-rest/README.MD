# REST Example

> A REST example project using vue-crud-x component

## Quick Start (default configuration used)

1. Install packages

```
npm i
```

2. Build REST Server (in backend folder) & Init DB (dev.dqlite3 in backend folder)

```
npm run build-rest
npm run init-db
```

3. Start The Client & Server

```
npm run start
```

4. View the web application

- Web Application
  - Host 127.0.0.1:8080
  - User: test
  - Password: test

- API Documentation (using OpenAPI)
  - Host 127.0.0.1:8000/api-docs

## Configuration

Refer to .env-sample file for configuration keys to edit

Rename file to .env.development for development

Rename file to .env.production for production


## Creation From Scratch

Use vue-cli 3

vue create [project name]
Manually select features
Babel, Linter, CSS Preporcessors
Stylus
ESLint + Standard config
Lint on save
dedicated config file (for babel, postcss, eslint, etc)
Save this as a preset? N

