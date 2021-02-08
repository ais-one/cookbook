<template>
  <a-layout>
    <a-back-top />
    <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible>
      <div class="logo" />
      <a-menu theme="dark" mode="inline" v-model:selectedKeys="selectedKeys">
        <a-menu-item key="1" @click="$router.push('/dashboard')">
          <user-outlined />
          <span>Dashboard</span>
        </a-menu-item>
        <a-sub-menu key="sub1">
          <template #title>
            <span>
              <user-outlined />
              <span>Visuals</span>
            </span>
          </template>
          <a-menu-item key="21" @click="$router.push('/demo-chart1')">Chart 1</a-menu-item>
          <a-menu-item key="22" @click="$router.push('/demo-chart2')">Chart 2</a-menu-item>
          <a-menu-item key="23" @click="$router.push('/demo-map')">Map</a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="sub2">
          <template #title>
            <span>
              <user-outlined />
              <span>Data Entry</span>
            </span>
          </template>
          <a-menu-item key="31" @click="$router.push('/demo-form')">Forms</a-menu-item>
          <a-menu-item key="32" @click="$router.push('/demo-card')">Cards</a-menu-item>
        </a-sub-menu>
        <a-menu-item key="4" @click="$router.push('/demo-table')">
          <video-camera-outlined />
          <span>Tables</span>
        </a-menu-item>
        <a-menu-item key="5">
          <upload-outlined />
          <span>Filters</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0">
        <menu-unfold-outlined
          v-if="collapsed"
          class="trigger"
          @click="() => (collapsed = !collapsed)"
        />
        <menu-fold-outlined v-else class="trigger" @click="() => (collapsed = !collapsed)" />
        <span>Data Science Dashboard</span>
      </a-layout-header>
      <a-layout-content :style="{ margin: '16px 12px', padding: '16px', background: '#fff', minHeight: 'calc(100vh - 96px)' }">
        <a-breadcrumb style="margin: 8px 0">
          <a-breadcrumb-item>Home</a-breadcrumb-item>
          <a-breadcrumb-item>Dashboard</a-breadcrumb-item>
        </a-breadcrumb>
        <router-view :key="$route.fullPath"></router-view>
      </a-layout-content>
      <!-- <a-layout-footer style="text-align: center">Ant Design ©2018 Created by Ant UED</a-layout-footer> -->
    </a-layout>
  </a-layout>
</template>
<script>

// :key="$route.fullPath" // this is causing problems
import { onMounted, onUnmounted, ref } from 'vue'
import { useStore } from 'vuex'

import {
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons-vue'

export default {
  components: {
    UserOutlined,
    VideoCameraOutlined,
    UploadOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
  },
  setup(props, context) {
    const store = useStore()

    const theDrawer = ref(null)

    onMounted(async () => {
      console.log('SECURE mounted!')
    })
    onUnmounted(() => console.log('SECURE unmounted'))
    const logout = async () => await store.dispatch('doLogin', null)

    return {
      logout,
      selectedKeys: ref(['1']),
      collapsed: ref(false),
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