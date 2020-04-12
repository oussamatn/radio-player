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
                favorites: [],
            }
        },
        mounted(){

            if(!this.active) this.$store.dispatch('favorites/fetchFavorites')
        },
        computed: {
            ...mapGetters('favorites',['isFavorites']),
            ...mapState('favorites',['favoritesList']),

        },
        watch: {
            favoritesList(newValue){
                this.active = (newValue.indexOf(this.id) >= 0);
            },
        },
        methods: {
            // toggle favorite channel by id
            toggleFavorite() {

                this.$store.dispatch('favorites/toggleFavorite',this.id)
            },

        },
    }
</script>