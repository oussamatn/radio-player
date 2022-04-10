<template >
    <button :active="isFavorites(this.id)" class="favBtn" @click.stop="toggleFavorite"  aria-label="Favorite">
        <i v-if="isFavorites(this.id)" class="fas fa-heart text-primary fx fx-drop-in" key="on"></i>
        <i v-else class="far fa-heart fx fx-drop-in" key="off"></i>
    </button>
</template>

<script>
    import { mapGetters  } from 'vuex';

    export default {
        name: 'favBtn',
        props: {
            id: { type: Number, default: '', required: true }
        },
        mounted(){
            this.$store.dispatch('favorites/fetchFavorites')
        },
        computed: {
            ...mapGetters('favorites',['isFavorites']),
        },
        methods: {
          // toggle favorite channel by id
          toggleFavorite() {
            this.$store.dispatch('favorites/toggleFavorite', this.id)
          },
        }
    }
</script>