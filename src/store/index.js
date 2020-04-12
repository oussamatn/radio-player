import Vue from 'vue';
import Vuex from 'vuex';

import favorites from './Favorites';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        favorites:favorites,
    },
});