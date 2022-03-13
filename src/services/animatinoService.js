import _store from '../js/store';

const animation_key = 'animation_type'

export default {
    get() {
        // load saved favs list from store
        return _store.get(animation_key)
            // .catch((error) => {
            //     throw new Error(error);
            // });
    },
    set(favoritesList){
        _store.set(animation_key, favoritesList);
    }
};