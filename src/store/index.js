import Vue from 'vue';
import Vuex from 'vuex';

import favorites from './Favorites';
import nowplaying from "./nowplaying";
import playerConfig from "./playerConfig";

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        favorites:favorites,
        nowplaying:nowplaying,
        playerConfig:playerConfig

    },
});