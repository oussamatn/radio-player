import Vue from 'vue'

import App from './App.vue'
import router from './router'
import store from './store';

import './registerServiceWorker'


Vue.config.productionTip = false;
new Vue({
    router,
    render: h => h(App),
    store,
    mounted() {

    }
}).$mount('#app')
// fetch( "./assets/config.json")
//     .then((response) => response.json())
//     .then((config) => {
//
//         new Vue({
//             router,
//             render: h => h(App),
//             store,
//             mounted() {
//
//             }
//         }).$mount('#app')
//     })

