<template>
  <div>
    <h1>DYN {{ $route.params.slug }}</h1>
    <ul>
      <li>
        <nuxt-link to="/">Home</nuxt-link>
      </li>
      <li>
        <nuxt-link to="/dynamic">DYN no slug</nuxt-link>
      </li>
      <li>
        <nuxt-link to="/dynamic/1">DYN -> 1</nuxt-link>
      </li>
      <li>
        <nuxt-link to="/dynamic/2">DYN -> 2</nuxt-link>
      </li>
      <li>
        <nuxt-link to="/dynamic/3">DYN -> 3</nuxt-link>
      </li>
      <li>
        <nuxt-link to="/dynamic/a">DYN -> A (Error must be numeric due to validation)</nuxt-link>
      </li>
    </ul>
    <p>To test dynamic routes with Nuxt Generate</p>
  </div>
</template>

<script>
export default {
  validate({ params }) {
    // Must be a number
    return /^\d+$/.test(params.slug)
  }
}
</script>
