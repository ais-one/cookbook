<template>
  <div>
    <h1>Dynamic's Parent</h1>
    <nuxt-child :key="$route.params.slug" />
  </div>
</template>
