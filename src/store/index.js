import Vue from 'vue';
import Vuex from 'vuex';

import favorites from './Favorites';
import nowplaying from "./nowplaying";

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        favorites:favorites,
        nowplaying:nowplaying,
    },
});