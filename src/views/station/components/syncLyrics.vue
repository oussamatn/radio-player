<template>
  <div v-if=" hasLyrics " class="card push-bottom fx fx-slide-up fx-delay-3">

    <p v-if="(activeLyric-2)>0" class="text-bright"> {{ lyrics[activeLyric - 2].content }}</p>
    <p v-if="(activeLyric-1)>0" class="text-bright"> {{ lyrics[activeLyric - 1].content }}</p>
    <p class="text-bright"> > {{ lyrics[activeLyric].content }}</p>
    <p v-if="(activeLyric+1)<lyrics.length" class="text-bright"> {{ lyrics[activeLyric + 1].content }}</p>
    <p v-if="(activeLyric+2)<lyrics.length" class="text-bright"> {{ lyrics[activeLyric + 2].content }}</p>
    <p v-if="(activeLyric+3)<lyrics.length" class="text-bright"> {{ lyrics[activeLyric + 3].content }}</p>

  </div>
</template>

<script>
import {mapState} from 'vuex';
import lyricsService from "@/services/lyricsService";
import kugou from "@/services/lyrics/kugou/kugou";
export default {
  name: "syncLyrics",
  computed: {
    ...mapState('nowplaying', {
      song: state => state.currentSong.song,
      duration: state => state.currentSong.duration,
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
      test:[],
      elapsedtime: 0,
      refreshHandler: null,
    }
  },

  methods: {

    async pullLyrics() {
      this.currentSongId = this.song.id
      this.activeLyric = 0;
      //this.test = await kugou.getLyrics("Ava Max - Salt",180)
      // this.test = await kugou.getLyrics(this.song.text,this.duration)
      this.lyrics = await kugou.getLyrics(this.song.text,this.duration)
      // this.lyrics = await lyricsService.getLyrics(this.song.text)
      clearInterval(this.refreshHandler)
      if (this.hasLyrics) this.setupLyricMaint()

    },
    setupLyricMaint() {
      this.elapsedtime = Math.round(new Date() - this.track.played_at * 1000)
      console.log("elapsedtime=" + this.elapsedtime)
      console.log("played_at=" + this.track.played_at)
      this.searchForFirst();
      this.refreshHandler = setInterval(this.searchForFirst, this.timer * 1000)
    },
    searchForFirst() {
      for (let i = this.activeLyric; i <= this.lyrics.length; i++) {
        let item = this.lyrics[i];
        if (item == null) break;
        if (item.time >= this.elapsedtime) {
          console.log(item.time + " - " + this.elapsedtime + " " + item.content)
          this.activeLyric = i;
          break;
        }
      }
      this.elapsedtime =Math.round(new Date() - this.track.played_at * 1000)
    },
    updateLyrics() {
      if (this.lyrics.length > this.activeLyric + 1 && this.elapsedtime >= this.lyrics[this.activeLyric + 1].time) {
        this.activeLyric += 1;
      }
      this.elapsedtime =Math.round(new Date() - this.track.played_at * 1000)
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
      if (this.song.id !== this.currentSongId) this.pullLyrics()
    }
  }
}
</script>

<style scoped>

</style>