<template>
  <div class="card push-bottom fx fx-slide-up fx-delay-3" v-if=" hasLyrics ">

    <p class="text-bright" v-if="(activeLyric-1)>0">  {{lyrics[activeLyric-1].lyrics }}</p>
    <p class="text-bright"> >  {{currentLyrics}}</p>
    <p class="text-bright" v-if="(activeLyric+1)<lyrics.length">  {{lyrics[activeLyric+1].lyrics }}</p>

  </div>
</template>

<script>
import { mapState  } from 'vuex';
import lyricsService from "@/services/lyricsService";
export default {
  name: "syncLyrics",
  computed: {
    ...mapState('nowplaying',{
      song : state => state.currentSong.song,
      track : 'currentSong',
    }),
    hasLyrics(){
      if(this.lyrics.length>0) return true;
      return false;
    }
  },
  data : () => {
    return {
      currentLyrics:"",
      currentSong:null,
      lyrics : [],
      activeLyric:0,
      timer:1,
      elapsedtime:0,
      refreshHandler:null,
    }
  },

  methods: {
    startTimer(){
      this.timerID = setInterval(() => { this.incrementTimer(); }, 1000);
      this.timerActive = true;
    },

    stopTimer(){
      clearInterval(this.timerID);
      this.timerActive = false;
    },

    incrementTimer(){
      this.timer += 1;
      if(this.lyrics.length > this.activeLyric+1 && this.timer >= this.lyrics[this.activeLyric+1].seconds){

        this.activeLyric += 1;
      }
    },
    async pullLyrics(){
      this.currentSong = this.song
      this.lyrics = await lyricsService.getLyrics(this.currentSong.text)
      clearInterval(this.refreshHandler)
      if(this.hasLyrics) this.setupLyricMaint()

    },
    setupLyricMaint(){

      this.elapsedtime = Math.round(+new Date()/1000) - this.track.played_at
      console.log("elapsedtime="+this.elapsedtime)
      this.refreshHandler = setInterval(this.updateLyrics,this.timer* 1000)
    },
    updateLyrics() {

      for(let i=this.activeLyric;i<=this.lyrics.length;i++){
          let item  = this.lyrics[i];
          if(item==null) break;
        if(item.seconds >= this.elapsedtime ) {
          console.log(item.seconds+" - "+ this.elapsedtime +" "+item.lyrics)
          this.currentLyrics= item.lyrics
          this.activeLyric = i;
          break;
        }
      }
      this.elapsedtime=Math.round(+new Date()/1000) - this.track.played_at
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
  watch : {
    song(){
      console.log("watch song : pullLyrics()->"+this.song.title)
      if(this.song.id !== this.currentSong.id )
        this.pullLyrics()

    }
  }
}
</script>

<style scoped>

</style>