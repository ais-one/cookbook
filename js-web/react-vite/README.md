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

### Package Sizes

- https://bundlephobia.com/package/react@18.2.0 - 2.5
- https://bundlephobia.com/package/react-router-dom@6.8.2 - 19.4
- https://bundlephobia.com/package/@tanstack/react-query@4.26.1 - 12
- https://bundlephobia.com/package/zustand@4.3.6 - 1.1
