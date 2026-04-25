<template>
  <component :is="layouts[$route.meta.layout || (storeUser ? 'layout-secure' : 'layout-public')]"></component>
</template>

<script setup>
import { shallowRef } from 'vue';
import { http } from '../common/plugins/fetch.js';
import { provideI18n } from '../common/plugins/i18n.js';
// :key="$route.fullPath" // this is causing problems
import LayoutPublic from './layouts/Public.vue'; // you can change this to your own layout
import LayoutSecure from './layouts/Secure.vue'; // as above
import { useMainStore } from './store.js';

const layouts = shallowRef({
  'layout-secure': LayoutSecure,
  'layout-public': LayoutPublic,
});
const store = useMainStore();
const storeUser = store.user;
const logout = async () => {
  await store.doLogin({ forced: true });
};
http.setOptions({ forceLogoutFn: logout });

// set i18n
provideI18n({
  locale: 'en',
  messages: {
    en: { sign_in: 'Sign In (en)' },
    id: { sign_in: 'Masuk (id)' },
  },
});
</script>
