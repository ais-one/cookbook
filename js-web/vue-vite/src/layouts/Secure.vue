<template>
  <a-layout>
    <bwc-loading-overlay v-if="loading"></bwc-loading-overlay>
    <a-back-top />
    <a-layout-sider :style="{ overflowY: 'auto', height: '100vh' }" v-model:collapsed="collapsed" :trigger="null" collapsible :collapsed-width="0">
      <div class="logo" :style="`background-image: url('https://via.placeholder.com/168x32.png?text=A+Logo');`" />
      <a-menu theme="dark" mode="inline" v-model:selectedKeys="selectedKeys">
        <template v-for="route in mappedRoutes">
          <a-sub-menu v-if="route.submenu" :key="route.submenu" :title="toPascalCase(route.submenu)">
            <a-menu-item v-for="menu in subMenus[route.submenu]" :key="menu.path" @click="$router.push(menu.path)">{{ menu.name }}</a-menu-item>
          </a-sub-menu>
          <a-menu-item v-else :key="route.path" @click="$router.push(route.path)">{{ route.name }}</a-menu-item>
        </template>
        <a-menu-item data-cy="logout" key="logout" @click="logout">Logout</a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0">
        <menu-unfold-outlined v-if="collapsed" class="trigger" @click="() => (collapsed = !collapsed)" />
        <menu-fold-outlined v-else class="trigger" @click="() => (collapsed = !collapsed)" />
        <span>Dashboard App</span>
      </a-layout-header>
      <a-layout-content :style="{ overflowY: 'auto', margin: '16px 12px', padding: '16px', background: '#fff', height: 'calc(100vh - 96px)' }">
        <a-breadcrumb style="margin: 8px 0">
          <a-breadcrumb-item>Home</a-breadcrumb-item>
          <a-breadcrumb-item>Dashboard</a-breadcrumb-item>
        </a-breadcrumb>
        <router-view :key="$route.fullPath"></router-view>
      </a-layout-content>
      <a-layout-footer hidden style="text-align: center">Ant Design ©2021</a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script>
// :key="$route.fullPath" // this is causing problems
import { onMounted, onUnmounted, onBeforeUnmount, ref, reactive } from 'vue'
import { useStore } from 'vuex'
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons-vue'
import { SECURE_ROUTES, ON_LOGIN, ON_LOGOUT } from '/config.js'

import idleTimer from '/@es-labs/esm/idle.js'

const { VITE_WS_URL } = import.meta.env

export default {
  components: {
    MenuUnfoldOutlined,
    MenuFoldOutlined
  },
  setup(props, context) {
    const store = useStore()
    const mappedRoutes = reactive([])
    const subMenus = reactive({})
    const loading = ref(false)

    const toPascalCase = (str) => {
      str = str.replace(/-\w/g, (x) => ` ${x[1].toUpperCase()}`)
      return str[0].toUpperCase() + str.substring(1, str.length)
    }

    onMounted(async () => {
      console.log('SECURE mounted!')
      idleTimer.timeouts.push({
        time: 300, // timme in seconds and ascending value
        fn: () => alert('Idle Timeout Test'),
        stop: true
      })
      idleTimer.start()

      SECURE_ROUTES.filter((route) => route.meta.layout === 'layout-secure').forEach((route) => {
        const submenu = route.path.split('/').length === 3 ? route.path.split('/', 2)[1] : '' // 2 or 3 only
        if (submenu) {
          if (!subMenus[submenu]) {
            // first time
            subMenus[submenu] = []
            mappedRoutes.push({ name: route.name, path: route.path, submenu: submenu })
          }
          subMenus[submenu].push({ name: route.name, path: route.path }) // add
        } else {
          mappedRoutes.push({ name: route.name, path: route.path, submenu: '' })
        }
      })
      ON_LOGIN && ON_LOGIN()
    })
    onUnmounted(() => {
      console.log('SECURE unmounted')
    })
    onBeforeUnmount(() => {
      // close WS
      idleTimer.stop()
      ON_LOGOUT && ON_LOGOUT()
    })

    const logout = async () => {
      console.time('time-logout')
      loading.value = true
      await store.dispatch('doLogin', null)
      loading.value = false
      console.timeEnd('time-logout')
    }
    return {
      loading,
      logout,
      selectedKeys: ref(['1']),
      collapsed: ref(false),
      mappedRoutes,
      subMenus,
      toPascalCase
    }
  }
}
</script>

<style>
.trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

.trigger:hover {
  color: #1890ff;
}

.logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.3);
  margin: 16px;
}

.site-layout .site-layout-background {
  background: #fff;
}
</style>
