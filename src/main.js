import Vue from 'vue'

import App from './App.vue'
import router from './router'
import store from './store';

import * as  VueHammer  from 'vue2-hammer'
import './registerServiceWorker'
console.clear();
Vue.use(VueHammer,{name: 'v-hammer'});

Vue.config.productionTip = false;


new Vue({
  router,
  render: h => h(App),
  store,
  mounted() {

  }
}).$mount('#app')
