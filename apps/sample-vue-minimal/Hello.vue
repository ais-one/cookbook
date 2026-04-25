<template>
  <h1>Sample 2</h1>
  <div id="redoc-container"></div>
</template>

<script setup>
// npm install redoc
// npm install null
import * as redoc from 'redoc/bundles/redoc.standalone'; // requires null package
import { onMounted } from 'vue';

onMounted(() => {
  redoc.init(
    'http://petstore.swagger.io/v2/swagger.json',
    { expandResponses: '200,400' },
    document.getElementById('redoc-container'),
  );
});
</script>

<style scoped>
</style>
