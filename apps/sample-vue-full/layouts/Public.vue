<template>
  <div>
    <bwc-loading-overlay v-if="loading"></bwc-loading-overlay>
    <router-view :key="$route.fullPath"></router-view>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue';
import { useMainStore } from '../store';

const store = useMainStore();
onMounted(() => console.log('PUBLIC mounted!'));
onUnmounted(() => console.log('PUBLIC unmounted'));
const loading = computed(() => store.loading);
</script>
