<template>
  <a-layout>
    <bwc-loading-overlay v-if="loading"></bwc-loading-overlay>
    <a-back-top />
    <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible :collapsed-width="0">
      <div class="sider-logo" />
      <a-menu class="sider-menu" theme="dark" mode="inline" v-model:selectedKeys="selectedKeys">
        <template v-for="route in mappedRoutes">
          <a-sub-menu v-if="route.submenu" :key="route.submenu" :title="toPascalCase(route.submenu)">
            <a-menu-item v-for="menu in subMenus[route.submenu]" :key="`sm-${menu.path}`" @click="$router.push(menu)"
              >{{ menu.name }}</a-menu-item
            >
          </a-sub-menu>
          <a-menu-item v-else :key="`m-${route.path}`" @click="$router.push(route)">{{ route.name }}</a-menu-item>
        </template>
        <a-menu-item data-cy="logout" key="logout" @click="logout">Logout</a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0">
        <menu-unfold-outlined v-if="collapsed" class="trigger" @click="() => (collapsed = !collapsed)" />
        <menu-fold-outlined v-else class="trigger" @click="() => (collapsed = !collapsed)" />
        <span>Sample App</span>
      </a-layout-header>
      <a-layout-content
        :style="{ overflowY: 'auto', margin: '8px 8px', padding: '8px', background: '#fff', height: 'calc(100vh - 96px)' }"
      >
        <a-breadcrumb style="margin: 8px 0">
          <a-breadcrumb-item>Home</a-breadcrumb-item>
          <a-breadcrumb-item>Dashboard</a-breadcrumb-item>
        </a-breadcrumb>
        <router-view :key="$route.fullPath"></router-view>
      </a-layout-content>
      <a-layout-footer hidden style="text-align: center">Ant Design ©2023</a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script setup>
import idleTimer from '@common/web/idle';
// :key="$route.fullPath" // this is causing problems
import { computed, onBeforeUnmount, onMounted, onUnmounted, reactive, ref } from 'vue';
import { onLogin, onLogout } from '../setups/events.js';
import { SECURE_ROUTES } from '../setups/routes.js';
import { useMainStore } from '../store.js';

const store = useMainStore();
// const loading = store.loading
const mappedRoutes = reactive([]);
const subMenus = reactive({});
const loading = computed(() => store.loading);
const selectedKeys = ref(['1']);
const collapsed = ref(false);

const toPascalCase = str => {
  str = str.replace(/-\w/g, x => ` ${x[1].toUpperCase()}`);
  return str[0].toUpperCase() + str.substring(1, str.length);
};

onMounted(async () => {
  console.log('SECURE mounted!');
  idleTimer.timeouts.push({ time: 300, fn: () => alert('Idle Timeout Test'), stop: true });
  idleTimer.start();

  SECURE_ROUTES.filter(route => route.meta.layout === 'layout-secure').forEach(route => {
    if (!route.hidden) {
      const pathLen = route.path.split('/').length;
      if (pathLen === 2 || pathLen === 3) {
        const submenu = pathLen === 3 ? route.path.split('/', 2)[1] : '';
        // console.log('submenu', route, '-', submenu, '-', pathLen)
        if (submenu) {
          if (!subMenus[submenu]) {
            // first time
            subMenus[submenu] = [];
            mappedRoutes.push({ ...route, submenu: submenu });
          }
          subMenus[submenu].push({ ...route }); // add item
        } else {
          mappedRoutes.push({ ...route, submenu: '' }); // add item
        }
      }
    }
  });
  onLogin?.();
});
onUnmounted(() => {
  console.log('SECURE unmounted');
});
onBeforeUnmount(() => {
  // close WS
  idleTimer.stop();
  onLogout?.();
});

const logout = async () => {
  console.time('time-logout');
  store.loading = true;
  await store.doLogin(null);
  store.loading = false;
  console.timeEnd('time-logout');
};
</script>

<style>
@import 'Secure.css';
</style>
