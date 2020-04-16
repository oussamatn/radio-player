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
    //this.$store.dispatch('nowplaying/fetchNowplaying')
    //this.$store.dispatch('nowplaying/fetchStations')
    //this.$store.dispatch('nowplaying/fetchSongs',1)
  }
}).$mount('#app')
