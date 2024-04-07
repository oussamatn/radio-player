import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/Home.vue';
import Station from './views/station/Station.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/station/:shortcode',
    name: 'station',
    component: Station
  }
];

const router = createRouter({
  history: createWebHistory(),
  linkActiveClass: 'active',
  routes
});

export default router;
