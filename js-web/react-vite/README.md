References

- https://blog.logrocket.com/complete-guide-authentication-with-react-router-v6/
- https://github.com/pmndrs/zustand
- https://blog.openreplay.com/zustand-simple-modern-state-management-for-react

- https://github.com/pmndrs/zustand/discussions/1274
- https://blog.devgenius.io/how-to-use-zustand-which-is-react-state-management-library-648f55a0455f
- https://github.com/pmndrs/zustand/blob/main/docs/guides/updating-state.md#deeply-nested-object

- https://www.grepper.com/answers/464077/zustand+stores+manage+loading+state

# Input

- https://stackoverflow.com/questions/55757761/handle-an-input-with-react-hooks

```js
function useInput({ type /*...*/ }) {
  const [value, setValue] = useState("");
  const input = <input value={value} onChange={e => setValue(e.target.value)} type={type} />;
  return [value, input];
}

const [username, userInput] = useInput({ type: "text" });
const [password, passwordInput] = useInput({ type: "text" });

return <>
  {userInput} -> {username} <br />
  {passwordInput} -> {password}
</>;
```

### Abort Fetch

- https://javascript.info/fetch-abort

### React Concepts

- https://reactjs.org/docs/code-splitting.html#reactlazy

- interceptors and react-query
  - https://srini-dev.hashnode.dev/authentication-refresh-token-flow-with-nextjs-typescript-react-query-and-axios-interceptors



### React Query

https://srini-dev.hashnode.dev/authentication-refresh-token-flow-with-nextjs-typescript-react-query-and-axios-interceptors


---


## Description

- material-ui & icons
- roboro font [https://www.npmjs.com/package/@fontsource/rubik]
- hashrouter & basename setting
- multiple environment builds
- eslint & prettier setup

## Installation

```bash

# react-swc, react-ts, react-swc-ts
npm create vite@latest react-vite -- --template react
npm i react-router-dom zustand @tanstack/react-query

# material ui & font
npm i @mui/material @emotion/react @emotion/styled
npm i @mui/icons-material
npm i @fontsource/rubik
```

## eslint & prettier Setup

```bash
npm init @eslint/config
# check syntax and find problems
# react, TS, browser, npm
npm install --D --save-exact prettier
npm install -D eslint-config-prettier eslint-plugin-prettier
```



```js
// .eslintrc.js
module.exports = {
  // Add "prettier" string value to `plugins: []` and `extends: []` array
  // Add "prettier/prettier": 2 in `rules: {}` property
  // ...
  plugins: [..., 'prettier'],
  extends: [..., 'prettier'],
  rules: {
    // ...
    "prettier/prettier": 2, // or 'error'
    // ...
  }
  // ...
}
```

```js
// .prettierrc.js
module.exports = {
  // configure as per your own project policy
  printWidth: 180,
  tabWidth: 2,
  semi: false,
  singleQuote: true,
  trailingComma: 'none',
  arrowParens: 'always', // avoid
  bracketSpacing: true,
  endOfLine: 'auto'
}
```

### Set Up Font

- https://github.com/KyleAMathews/typefaces
- https://blog.logrocket.com/3-ways-to-add-custom-fonts-to-your-material-ui-project/
- https://thewebdev.info/2021/12/18/how-to-change-the-font-family-of-all-react-material-ui-components/

```css
{
  font-family: "Rubik";
}
```

### Set .env file

```bash
# DOMAIN=www.example.com
# REACT_APP_FOO=$DOMAIN/foo
# REACT_APP_BAR=$DOMAIN/bar

PORT=8000
```


## Setup to use absolute path from src

https://javascript.plainenglish.io/why-and-how-to-use-absolute-imports-in-react-d5b52f24d53c


## Base URL and Hash Routing

Add following property to `package.json`

```json
  "homepage": "/www",
```

Add `basename` property to the router

```js
    <HashRouter basename='www'>
```

Assuming port is 8000

http://localhost:8000/#/www



## Testing

jest-environment-jsdom

"coverage": "jest --coverage"
"test": "jest --env=jsdom"

npm test -- u



## picocss

https://github.com/picocss/pico


