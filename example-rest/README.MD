# REST Example

> A REST example project using vue-crud-x component


## Quickstart

1. Set Up Environment

Rename .env-sample file to .env.development in this folder
Rename .env-sample file to .env.development in backend folder

2. Install packages

```
npm i
```

3. Build REST Server (in backend folder) & Init DB (dev.dqlite3 in backend folder)

```
npm run build-rest
npm run init-db
```

4. Start The Client & Server

```
npm run start
```

5. View the web application

- Web Application
  - Host 127.0.0.1:8080
  - User: test
  - Password: test

- API Documentation (using OpenAPI)
  - Host 127.0.0.1:8000/api-docs

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

