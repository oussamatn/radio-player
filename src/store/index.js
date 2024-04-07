import { createStore } from 'vuex';
import favorites from './Favorites';
import nowplaying from './nowplaying';
import playerConfig from './playerConfig';

const store = createStore({
    modules: {
        favorites,
        nowplaying,
        playerConfig
    }
});

export default store;
