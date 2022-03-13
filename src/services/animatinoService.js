import _store from '../js/store';

const animation_key = 'animation_type'

export default {
    async get() {
        // load saved favs list from store
        return await _store.get(animation_key) || '_DISABLE';
            // .catch((error) => {
            //     throw new Error(error);
            // });
    },
    set(favoritesList){
        _store.set(animation_key, favoritesList);
    }
};