<template>
    <button class="favBtn" @click.stop="$emit( 'change', id, !active )" @change="toggleFavorite" aria-label="Favorite">
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
            active: { type: Boolean, default: false },
        },
        data: () => {
            return {

                channels: [],
                channel: {},
                favorites: [],

            }
        },
        methods: {
            // load saved favs list from store
            loadFavorites() {
                const favs = _store.get('favorites_data');
                if (!Array.isArray(favs)) return;
                this.favorites = favs;
            },

            // save favs to a .m3u file
            saveFavorites() {
                let data = '#EXTM3U';
                for (let id of this.favorites) {
                    const channel = this.channels.filter(c => (c.id === id)).shift();
                    if (!channel) continue;
                    data += '\n\n';
                    data += `#EXTINF:0,${channel.title} [JoujmaFM]\n`;
                    data += `${channel.mp3file}`;
                }
                const elm = document.createElement('a');
                elm.setAttribute('href', 'data:audio/mpegurl;charset=utf-8,' + encodeURIComponent(data));
                elm.setAttribute('download', 'Joujma_favorites.m3u');
                elm.setAttribute('target', '_blank');
                document.body.appendChild(elm);
                setTimeout(() => elm.click(), 100);
                setTimeout(() => elm.remove(), 1000);
            },

            // toggle favorite channel by id
            toggleFavorite(id, toggle) {
                console.log("Favbtn : toggleFavorite");
                let favs = this.favorites.slice();
                favs = favs.filter(fid => (fid !== id));
                if (toggle) favs.push(id);
                this.favorites = favs;
                this.updateCurrentChannel();
                _store.set('favorites_data', favs);
            },
        },
    }
</script>