<template>
  <div v-if=" hasLyrics " class="card push-bottom fx fx-slide-up fx-delay-3">

    <p v-if="(activeLyric-1)>0" class="text-bright"> {{ lyrics[activeLyric - 1].lyrics }}</p>
    <p class="text-bright"> > {{ lyrics[activeLyric].lyrics }}</p>
    <p v-if="(activeLyric+1)<lyrics.length" class="text-bright"> {{ lyrics[activeLyric + 1].lyrics }}</p>

  </div>
</template>

<script>
import {mapState} from 'vuex';
import lyricsService from "@/services/lyricsService";

export default {
  name: "syncLyrics",
  computed: {
    ...mapState('nowplaying', {
      song: state => state.currentSong.song,
      track: 'currentSong',
    }),
    hasLyrics() {
      if (this.lyrics.length > 0) return true;
      return false;
    }
  },
  data: () => {
    return {
      currentSongId: 0,
      lyrics: [],
      activeLyric: 0,
      timer: 1,
      elapsedtime: 0,
      refreshHandler: null,
    }
  },

  methods: {

    async pullLyrics() {
      this.currentSongId = this.song.id
      this.activeLyric = 0;
      this.lyrics = await lyricsService.getLyrics(this.song.text)
      clearInterval(this.refreshHandler)
      if (this.hasLyrics) this.setupLyricMaint()

    },
    setupLyricMaint() {
      this.elapsedtime = Math.round(+new Date() / 1000) - this.track.played_at
      console.log("elapsedtime=" + this.elapsedtime)
      this.searchForFirst();
      this.refreshHandler = setInterval(this.updateLyrics, this.timer * 1000)
    },
    searchForFirst() {
      for (let i = this.activeLyric; i <= this.lyrics.length; i++) {
        let item = this.lyrics[i];
        if (item == null) break;
        if (item.seconds >= this.elapsedtime) {
          console.log(item.seconds + " - " + this.elapsedtime + " " + item.lyrics)
          this.activeLyric = i;
          break;
        }
      }
    },
    updateLyrics() {
      if (this.lyrics.length > this.activeLyric + 1 && this.elapsedtime >= this.lyrics[this.activeLyric + 1].seconds) {
        this.activeLyric += 1;
      }
      this.elapsedtime = Math.round(+new Date() / 1000) - this.track.played_at
      //
    },
  },

  mounted() {
    console.log("mounted : syncLyrics")
    this.pullLyrics();

  },
  beforeDestroy() {
    clearInterval(this.refreshHandler)
  },
  watch: {
    song() {
      console.log("watch song : pullLyrics()->" + this.song.title)
      if (this.song.id !== this.currentSongId)
        this.pullLyrics()

    }
  }
}
</script>

<style scoped>

</style>