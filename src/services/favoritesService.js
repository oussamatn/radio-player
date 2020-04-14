import _store from '../js/store';

export default {
    get() {
        // load saved favs list from store
        return _store.get('favorites_data')
           /* .catch((error) => {
                throw new Error(error);
            });*/
    },
    set(favoritesList){
        _store.set('favorites_data', favoritesList);
    }
};