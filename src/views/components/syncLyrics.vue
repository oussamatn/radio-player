<template>
  <div>
    <p class="text-bright" v-if="(activeLyric-1)>0">  {{lyrics[activeLyric-1].lyrics }}</p>
    <p class="text-bright"> >  {{currentLyrics}}</p>
    <p class="text-bright" v-if="(activeLyric+1)<lyrics.length">  {{lyrics[activeLyric+1].lyrics }}</p>
  </div>

</template>

<script>
import { mapGetters, mapState  } from 'vuex';
import lyricsService from "@/services/lyricsService";
export default {
  name: "syncLyrics",
  props: {
    song: { type: Object, default: '', required: true },
    playedAt: { type: Number, default: 0, required: true }
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
      this.setupLyricMaint()

    },
    setupLyricMaint(){
      clearInterval(this.refreshHandler)
      this.elapsedtime = Math.round(+new Date()/1000) - this.playedAt
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
      this.elapsedtime=Math.round(+new Date()/1000) - this.playedAt
      //
    },
  },
  mounted() {
    console.log("mounted : syncLyrics")
    this.pullLyrics();

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