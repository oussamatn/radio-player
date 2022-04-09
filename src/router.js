import Vue from 'vue'
import Router from 'vue-router'

const Station = () => import('./views/station/Station')
const Home =  () => import('./views/Home')

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  linkActiveClass: "active",
  routes: [
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
  ]
})
