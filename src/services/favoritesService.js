import _store from '../js/store';
const favKey = "favorites_data"

export default {
    get() {
        // load saved favs list from store
        return _store.get(favKey)
           // .catch((error) => {
           //      throw new Error(error);
           //  });
    },
    set(favoritesList){
        _store.set(favKey, favoritesList);
    }
};