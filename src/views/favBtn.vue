<template >
    <button :active="active" class="favBtn" @click.stop="toggleFavorite"  aria-label="Favorite">
        <i v-if="active" class="fa fa-heart text-primary fx fx-drop-in" key="on"></i>
        <i v-else class="fa fa-heart-o fx fx-drop-in" key="off"></i>
    </button>
</template>

<script>
    import { mapGetters, mapState  } from 'vuex';

    export default {
        name: 'favBtn',
        props: {
            id: { type: Number, default: '', required: true }
        },
        data: () => {
            return {
                active:null,
            }
        },
        mounted(){
            this.$store.dispatch('favorites/fetchFavorites')
            this.active = this.isFavorites(this.id);
            this.$store.watch(
                state => state.favorites.favoritesList,
                () => {
                    this.active = this.isFavorites(this.id);
                    console.log("update");
                }
            );
        },
        computed: {
            ...mapGetters('favorites',['isFavorites']),
        },
        methods: {
            // toggle favorite channel by id
            toggleFavorite() {
                this.$store.dispatch('favorites/toggleFavorite',this.id)
            },

        },
    }
</script>