import { createApp } from 'vue';
import App from './App.vue';
import 'bootstrap/dist/css/bootstrap.css';
import authStore from './authStore.js';

const app = createApp(App);
app.use(authStore);
app.mount('#app');

import 'bootstrap/dist/js/bootstrap.bundle.js';