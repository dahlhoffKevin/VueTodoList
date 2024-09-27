import { createApp } from 'vue';
import App from './App.vue';
import 'bootstrap/dist/css/bootstrap.css';
import authStore from './authStore.js';
import router from './router.js';

const app = createApp(App);
app.use(authStore);
app.use(router);
app.mount('#app');

import 'bootstrap/dist/js/bootstrap.bundle.js';