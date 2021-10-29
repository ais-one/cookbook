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


### To install each workspace

```bash
npm install --workspace=@es-labs 
npm install --workspace=js-node
npm install --workspace=js-web
```

### To install a project in workspace

```bash
npm install --workspace=js-node/expressjs
```

