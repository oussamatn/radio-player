<template>
  <div class="stationView">
    <main class="player-content flex-row">
      <section v-if="visible" :key="stationId" class="flex-1">
        <div class="flex-autorow flex-top flex-stretch player-channel">
          <!-- station details -->

          <MainSong></MainSong>
          <!-- songs list -->
          <SongsHistory></SongsHistory>

        </div>


<!--        <syncLyrics></syncLyrics>-->

      </section>
    </main>
    <!-- player footer with controls -->
    <footerPlayer :streamUrl="station.listen_url" :config="config"></footerPlayer>


  </div>
</template>

<script>

import {mapGetters, mapState} from 'vuex';
import { useRoute } from "vue-router";
import favBtn from "@/views/components/favBtn.vue";
import syncLyrics from  '@/views/station/components/syncLyrics.vue'
import footerPlayer from  '@/views/station/components/footerPlayer.vue'

import SongsHistory from "@/views/station/components/songsHistory.vue";
import MainSong from "@/views/station/components/mainSong.vue";
import router from "@/router.js";


export default {
  name: 'station',
  components: {
    MainSong,
    SongsHistory,
    favBtn,
    syncLyrics,
    footerPlayer,
  },
  data: () => {
    return {
      // toggles
      visible: false,
      volume: 0.5,
      // errors stuff
      errors: {},
      // timer stuff
      timeStart: 0,
      timeDisplay: '00:00:00',
      timeItv: null,

    }
  },

  // watch methods
  watch: {
    currentsong() {
      this.updateMediaSession();
    },
    //route change
    $route(to, from) {
    },
    // update player volume

  },

  // computed methods
  computed: {
    ...mapState('nowplaying', {
      stationId: state => state.stationId,
      //songs : 'songs',
      track: 'currentSong',
      currentsong: state => state.currentSong.song,
      nextSong: state => state.nextSong,
      station: state => state.currentStation,
      songs: state => state.songs,
    }),
    // check if there are tracks loaded
    ...mapGetters('nowplaying', ['hasSongs', 'getIDfromShortcode']),
    //...mapGetters('playerConfig',['getConfig']),
    config() {
      return this.$store.getters["playerConfig/getConfig"];
    },
    // check if audio can be played

    // // check if a channel is selected
    // hasChannel() {
    //     return this.stationId ? true : false;
    // },
    // // check for errors that would affect playback
    // hasError() {
    //     if (this.errors.channels && !this.channels.length) return true;
    //     if (this.errors.stream) return true;
    //     return false;
    // },
  },

  // custom methods
  methods: {

    // set an error message
    setError(key, err) {
      let errors = Object.assign({}, this.errors);
      errors[key] = String(err || '').trim();
      if (err) console.warn('ERROR(' + key + '):', err);
      this.errors = errors;
    },

    // check if an error has been set for a key
    checkError(key) {
      return (key && this.errors.hasOwnProperty(key) && this.errors[key]);
    },

    // clear all error messages
    clearErrors() {
      Object.keys(this.errors).forEach(key => {
        this.errors[key] = '';
      });
    },

    //Update navigator media session data
    updateMediaSession() {
      console.log("%c updateMediaSession", 'color: green', this.currentsong)
      if ('mediaSession' in navigator && !!this.currentsong) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: this.currentsong.title,
          artist: this.currentsong.artist,
          artwork: [
            {src: this.currentsong.art}
          ]
        });
      }
    },

    updateCurrentChannel() {
      const route = useRoute();
      let stationId = route.params.id;
      console.log("stationId", stationId);
      let short_code = route.params.shortcode
      if (short_code.length === 0) router.push({name: "home"})
      if (isNaN(stationId)) stationId = this.getIDfromShortcode(short_code);
      if (isNaN(stationId)) router.push({name: "home"})
      this.$store.dispatch('nowplaying/StationId', stationId);
    },
    // select a channel to play
    updateChannelData() {
      console.log("updateChannelData")
      this.$store.dispatch('nowplaying/fetchNowplaying', this.stationId).then(() => {
        console.log("updateChannelData  then fetchNowplaying")
        if (this.itv) clearInterval(this.itv);
        this.setupMaintenance();
      });
    },
    // run maintenance tasks on a timer
    setupMaintenance() {
      let remainingtime = Math.floor(this.track.remaining) || 30;
      this.itv = setInterval(this.updateChannelData, remainingtime * 1000);
    },
    selectChannel() {

      //this.closeAudio(); //TODO
      this.initPlayer();
      //this.playChannel();
      this.setupMaintenance();

    },

    initPlayer() {
      window.addEventListener('keydown', this.onKeyboard);
      this.visible = true;
      document.title = this.station.name +" - "+ this.config.title
    },

  },
  beforeCreate() {
    console.log("beforeCreate Station.vue");
  },
  // on app Created
  created() {
    console.log("created Station.vue");
    //get station id from shortcode
    // Update state with current station id
    this.updateCurrentChannel()

  },
  mounted() {

    this.selectChannel();

  },
  beforeUpdate() {
    this.updateCurrentChannel()

  },
  beforeRouteUpdate(to, from, next) {


    //Preload
    this.resetPlayer();
    if (to.params.id) {
      this.$store.dispatch('nowplaying/resetSongs')
      this.$store.dispatch('nowplaying/StationId', to.params.id)

    }
    console.log("beforeRouteUpdate : ", to.params.id);
    this.selectChannel();
    next();
  },


  destroyed() {
    this.$store.dispatch('nowplaying/resetSongs')
  }

}
</script>
