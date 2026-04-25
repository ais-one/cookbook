// const urlParams = new URLSearchParams(window.location.search)
// const myParam = urlParams.get('myParam')

import '/esm/bwc-autocomplete.js';
import '/esm/bwc-combobox.js';
import '/esm/bwc-fileupload.js';
import '/esm/bwc-table.js';
import '/esm/bwc-t4t-form.js';

// import { sleep }from '/esm/sleep.js'

import App from './app.js';
import router from './router.js';

// set baseurl here - need config
// set cors settings - need config
// set/unset token during login/logout, if token in auth header
const { createApp } = Vue;

const app = createApp(App);
app.config.isCustomElement = tag => tag.startsWith('bwc-');
app.use(router);
app.mount('#app');
