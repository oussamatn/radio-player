import Vue from 'vue'

import App from './App.vue'
import router from './router'
import store from './store';
import i18n from './i18n/i18n'


import './registerServiceWorker'


Vue.config.productionTip = !(process.env.NODE_ENV === 'production');
new Vue({
    router,
    i18n,
    render: h => h(App),
    store,
    mounted() {

    }
}).$mount('#app')
