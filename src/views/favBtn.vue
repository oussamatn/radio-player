<template>
    <button :active="true" class="favBtn" @click.stop="toggleFavorite" @change="toggleFavorite" aria-label="Favorite">
        <i v-if="active" class="fa fa-heart text-primary fx fx-drop-in" key="on"></i>
        <i v-else class="fa fa-heart-o fx fx-drop-in" key="off"></i>
    </button>
</template>

<script>
    import _store from '../js/store';

    export default {
        name: 'favBtn',
        props: {
            id: { type: Number, default: '', required: true },
        },
        data: () => {
            return {
                active:false,
                favorites: [],
            }
        },
        created(){
            this.loadFavorites();
        },
        watch: {
            favorites(){
              this.active = (this.favorites.indexOf(this.id) >= 0);
            },
        },
        methods: {
            // load saved favs list from store
            loadFavorites() {
                let favs = _store.get('favorites_data');
                if (!Array.isArray(favs)) return;
                this.favorites = favs;
            },
            // toggle favorite channel by id
            toggleFavorite() {
                this.loadFavorites();
                console.log("Favbtn : toggleFavorite");
                let favs = this.favorites.slice()
                                         .filter(fid => (fid === this.id));
                if (!favs.length) this.favorites.push(this.id);
                else this.favorites = this.favorites.filter(fid => (fid !== this.id));

                _store.set('favorites_data', this.favorites);
            },
        },
    }
</script>