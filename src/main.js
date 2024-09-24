import { createApp } from 'vue';
import App from './App.vue';
import 'bootstrap/dist/css/bootstrap.css';
import store from './store.js';

const app = createApp(App);
app.use(store);
app.mount('#app');

import 'bootstrap/dist/js/bootstrap.bundle.js';