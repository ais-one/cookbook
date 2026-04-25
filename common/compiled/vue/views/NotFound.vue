<template>
  <a-result status="404" title="404" sub-title="Sorry, the page you visited does not exist.">
    <template #extra> <a-button type="primary" @click="goHome">Back Home</a-button> </template>
  </a-result>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
const goHome = () => router.push(import.meta.env.VITE_INITIAL_SECURE_PATH);
</script>
