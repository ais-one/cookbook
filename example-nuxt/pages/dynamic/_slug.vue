<template>
  <div>
    <h1>DYN1 {{ $route.params.slug }}</h1>
    <nuxt-link to="/">Home</nuxt-link>
    <nuxt-link to="/dynamic/a">DYN1 -> a</nuxt-link>
    <nuxt-link to="/dynamic/b">DYN1 -> b</nuxt-link>
    <nuxt-link to="/dynamic/c">DYN1 -> c</nuxt-link>
    <p>To test dynamic routes with Nuxt Generate</p>
  </div>
</template>
