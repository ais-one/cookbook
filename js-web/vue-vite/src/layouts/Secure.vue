<template>
  <a-layout>
    <a-back-top />
    <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible>
      <div class="logo" />
      <a-menu theme="dark" mode="inline" v-model:selectedKeys="selectedKeys">
        <a-menu-item key="1" @click="$router.push(VITE_INITAL_SECURE_PATH)">
          <user-outlined />
          <span>Dashboard</span>
        </a-menu-item>
        <a-menu-item key="main" @click="$router.push('/demo-main')">Main</a-menu-item>
        <a-sub-menu key="sub1">
          <template #title>
            <span>
              <user-outlined />
              <span>Visuals</span>
            </span>
          </template>
          <a-menu-item key="21" @click="$router.push('/demo-chart1')">Chart 1</a-menu-item>
          <a-menu-item key="22" @click="$router.push('/demo-chart2')">Chart 2</a-menu-item>
          <a-menu-item key="23" @click="$router.push('/demo-antd-map')">Map</a-menu-item>
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
          <a-menu-item key="33" @click="$router.push('/cascade-ms')">Combobox</a-menu-item>
        </a-sub-menu>
        <a-menu-item key="4" @click="$router.push('/demo-table')">
          <video-camera-outlined />
          <span>Tables</span>
        </a-menu-item>

        <a-sub-menu key="sub5">
          <template #title>
            <span>
              <upload-outlined />
              <span>Demo</span>
            </span>
          </template>
          <a-menu-item key="51" @click="$router.push('/demo-map')">Demo Map</a-menu-item>
          <a-menu-item key="52" @click="$router.push('/demo-chart')">Demo Chart</a-menu-item>
          <a-menu-item key="53" @click="$router.push('/demo-web-cam')">Web Cam</a-menu-item>
          <a-menu-item key="54" @click="$router.push('/demo-sign-pad')">SIgn Pad</a-menu-item>
        </a-sub-menu>
        <a-menu-item key="6" @click="logout">Logout</a-menu-item>
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
        <span>Our Dashboard</span>
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
import { VITE_INITAL_SECURE_PATH } from '/config.js'

import idleTimer from '/@es-labs/esm/idle.js'

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
    onMounted(async () => {
      console.log('SECURE mounted!')
      idleTimer.timeouts.push(
        { // timme in seconds and ascending value
          time: 5,
          fn: () => {
            alert('Idle Timeout Test')
          },
          stop: true
        }
      )
      idleTimer.start()
    })
    onUnmounted(() => {
      console.log('SECURE unmounted')
      idleTimer.stop()
    })
    const logout = async () => await store.dispatch('doLogin', null)
    return {
      logout,
      selectedKeys: ref(['1']),
      collapsed: ref(false),
      VITE_INITAL_SECURE_PATH,
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