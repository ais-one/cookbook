npm version patch

[package.json](https://docs.npmjs.com/cli/v7/configuring-npm/package-json)

```json
{
  "files": ["build/**/*"]
}
```

---

## npm workspaces

### References:

- https://github.com/ruanmartinelli/npm-workspaces-demo
- https://hyperfoo.io/posts/npm-7-workspaces-1

1. package name is important (note scoped packages)
2. not peer dependency issues in NPM 8
3. may need to add scope
4. npm i --workspace=<a-workspace>

npm prejects with no dependencies, for testing

- vtextpad
- complex.js
- fraction.js
- zero-fill
- padder
- smiley

### Installation

```bash
# To install each workspace
npm install --workspace=js-node
npm install --workspace=js-web

# To install a project in workspace
npm install --workspace=js-node/expressjs

# To install all workspaces
npm i --workspaces
```

## Installing & Updating Dependencies

Install dependencies for all workspaces!

Note

- when doing npm i, it will always install latest version matching your package
- sometimes you need to **rebuild**, delete all node_modules folders and the package-lock.json file in the root

```bash
# https://github.com/npm/cli/issues/708
# https://github.com/npm/cli/issues/2032
npm i # use this
# npm i --legacy-peer-deps # use this if there is peer dependencies issues, but not recommended
```

Update dependencies for all workspaces!

```bash
npm outdated # use this to check for outdated dependencies
npm update --save
npm ls <?package> # use npm ls to check on actual versions installed
```

## Single workspace command

```bash
# install specific dependencies
npm i lorem-ipsum --workspace=@<namespace>/[package]

# install all dependencies
npm i --workspace=js-node/expressjs

# Update a package with major version change eg 2.2.8 to 3.1.1
npm i ant-design-vue@latest --workspace=js-node/expressjs
```

---

## NPM Token

Create token

- for automation fine grain and limit its access
