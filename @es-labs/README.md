## Library Notes

Libs are now found within the example projects.

vue (wepback) - example-webpacked/lib/webpacked (to deprecate and remove)

## Projects and Repo

We will find a better way of updating to have correct CI the following folders should have their own repo
- example-app
- example-native
- example-vite
- example-webpack (to remove)


## Usage

npm install <path-to-this-foder-from-where-you-want-to-install-this>

e.g.

```
cd my-project
npm install ../@es-labs/node
```

## Publishing packages to npm

```bash
# for scoped packages e.g. @es-labs/node
npm publish --access public

# for packages e.g. ais-one/vue-crud-x
npm publish
```
