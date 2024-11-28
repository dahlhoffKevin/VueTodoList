import { createMemoryHistory, createRouter } from 'vue-router';
import LoginView from './components/body/views/LoginView.vue';
import RegisterView from './components/body/views/RegisterView.vue';
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
  {
    path: '/register',
    component: RegisterView,
    name: 'register'
  }
];

const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

export default router;
