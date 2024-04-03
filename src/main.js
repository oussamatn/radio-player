// main.js
import { createApp } from 'vue';
import App from '@/App.vue';
import router from './router.js';
import store from './store';
import i18n from './i18n/i18n.js';
import { FiltersPlugin } from './js/FiltersPlugin.js';
import {useI18n} from "vue-i18n";

const app = createApp(App);

// Install plugins (router, store, i18n)
app.use(router);
app.use(store);
app.use(i18n);
app.use(FiltersPlugin);

app.mount('#app');
//const { t } = useI18n();
