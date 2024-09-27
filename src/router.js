import { createMemoryHistory, createRouter } from 'vue-router';
import LoginView from './components/body/views/LoginView.vue';
import AppBody from './components/body/AppBody.vue';

const routes = [
  {
    path: '/',
    component: AppBody,
    name: 'home'
  },
  { 
    path: '/login',
    component: LoginView,
    name: 'login'
  },
];

const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

export default router;
