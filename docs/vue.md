
**Vue 3 reactivity demo**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Simple @vue/reactivity Counter</title>
</head>
<body>
  <h1></h1>
  <button>+</button>
  <button>-</button>
  <script type="module">
    import { ref, effect, computed } from 'https://cdn.skypack.dev/@vue/reactivity'
    const h1 = document.querySelector('h1')
    const [incBtn, decBtn] = document.querySelectorAll('button')
    const count = ref(0)
    const text = computed(() => `current count: ${count.value}`)
    effect(() => {
      h1.innerHTML = text.value
    })
    incBtn.addEventListener('click', () => count.value++)
    decBtn.addEventListener('click', () => count.value--)
  </script>
</body>
</html>
```