bulma
bootstrap
material UI - muicss

DO NOT USE
- material-components-web, semantic ui

input
- text (with regex)
- number
- date
- time
- datetime (local)
- file
- textarea
  - replace <input> with <textarea>

---

Extended input

- autocomplete / select (can use for selects also..., if multiple..., show tags list, delete from tags list?)
  - single
  - multiple
  - allow new (always false if select)
bwc-autocomplete (if multiple, use tags? remove tags when not needed) - tag
bs-autocomplete - badge
mui-autocomplete - chips

---

- link
  - a[href]
  - button


## Input

label: <label> innerText, additional classes
input: <input> attrs: type, pattern, placeholder, additional classes
helper: <p>

```js
// Bulma
const template = {}

template['bulma'] = {
  input: `
    <div class="field">
      <label class="label"></label>
      <div class="control">
      <input class="input" type="text"></div>
      <p class="help is-danger"></p>
    </div>
  `,
  // <textarea class="textarea is-primary" placeholder="Primary textarea"></textarea>
  // ugly multiple
  select: `
    <div class="field">
      <div class="control">
        <label class="label"></label>
        <div class="select">
          <select></select>
        </div>
      </div>
    </div>
  `
}

// Bootstrap
template['bootstrap'] = {
  input: `
    <div">
      <label class="form-label"></label>
      <input class="form-control" type="text">
      <div class="form-text"></div>
    </div>
  `,
  // <textarea class="form-control" rows="3"></textarea>
  // ugly multiple
  select: `
    <div>
      <select class="form-select" aria-label=""></select>
    </div>
  `
}

// Mui CSS
template['muicss'] = {
  input: `
    <div class="mui-textfield">
      <label></label>
      <input type="text">
    </div>
  `,
  // <textarea placeholder="Textarea"></textarea>
  // no multiple
  select: `
    <div class="mui-select">
      <label></label>
      <select></select>
    </div>
  `
}



```


