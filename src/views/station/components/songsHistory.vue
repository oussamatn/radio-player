<template>
  <div class="flex-item flex-1">
    <div class="push-bottom">
      <h4 class="text-nowrap fx fx-slide-left fx-delay-1">{{ $t('recent_tracks') }}</h4>
    </div>
    <div v-if="!hasSongs" class="card push-bottom">
      There are no songs loaded yet for this station.
    </div>
    <ul v-if="hasSongs" class="player-tracklist push-bottom">

      <li v-for="( el, i ) of songs" :key="el.played_at"
          :class="'fx-slide-left fx-delay-' + ( i + 2 )"
          class="card fx flex-row flex-top flex-stretch">

        <div><img :alt="el.song.title" :src="el.song.art" height="70" width="70"/></div>
        <div class="pad-left">
          <div> <span class="text-secondary">{{ el.song.title }}</span> </div>
          <div><span class="text-bright">{{ el.song.artist }}</span> </div>
        </div>

      </li>

    </ul>
  </div>
</template>

<script>
import { mapState  } from 'vuex';
export default {
  name: "songsHistory",
  computed: {
    ...mapState('nowplaying',{
      songs : state => state.songs,
    }),
    config(){
      return this.$store.getters["playerConfig/getConfig"];
    },
    hasSongs: (songs) => {
      return (!!Array(songs).length);
    }
  }
}
</script>

<style scoped>

</style>