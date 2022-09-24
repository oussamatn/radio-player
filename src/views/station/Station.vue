<template>
  <div class="stationView">
    <main class="player-content flex-row">
      <section v-if="visible" :key="stationId" class="flex-1">
        <div class="flex-autorow flex-top flex-stretch player-channel">
          <!-- station details -->

          <main-song></main-song>
          <!-- songs list -->
          <songs-history></songs-history>

        </div>


        <syncLyrics></syncLyrics>

      </section>
    </main>
    <!-- player footer with controls -->
    <footer-player :canPlay="canPlay" :loading="loading" :playing="playing"
                   v-on:togglePlay="togglePlay" :config="config"></footer-player>


  </div>
</template>

<script>


import _audio from '../../js/audio';
import favBtn from "@/views/components/favBtn";
import syncLyrics from '@/views/station/components/syncLyrics'
import footerPlayer from '@/views/station/components/footerPlayer'

import {mapGetters, mapState} from 'vuex';
import SongsHistory from "@/views/station/components/songsHistory";
import MainSong from "@/views/station/components/mainSong";

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
      playing: false,
      loading: true,
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
    canPlay() {
      return !!(this.stationId && !this.loading);
    },
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


    initPlayer() {
      window.addEventListener('keydown', this.onKeyboard);
      this.visible = true;
      document.title = this.station.name +" - "+ this.config.title
    },

    // reset selected channel
    resetPlayer() {
      this.visible = false
      this.closeAudio();
      this.clearErrors();
    },


    // try resuming stream problem if possible
    tryAgain() {
      this.clearErrors();
      this.playChannel();
    },
    // toggle stream playback for current selected channel
    togglePlay() {
      if (this.loading) return;
      if (this.playing) return this.closeAudio();
      return this.playChannel();
    },

    // setup audio routing and stream events
    setupAudio() {

      const a = _audio.setupAudio();

      a.addEventListener('waiting', e => {
        this.playing = false;
        this.loading = true;
      });
      a.addEventListener('playing', e => {
        this.setError('stream', '');
        this.playing = true;
        this.loading = false;
      });
      a.addEventListener('ended', e => {
        this.playing = false;
        this.loading = false;
      });
      a.addEventListener('error', e => {
        this.closeAudio();
        console.log(e);
        this.setError('stream', `The selected stream (${this.station.name}) could not load, or has stopped loading due to a network problem.`);
        this.playing = false;
        this.loading = false;
      });
    },

    // close active audio
    closeAudio() {
      _audio.stopAudio();
      this.playing = false;
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
    // play audio stream for a channel
    playChannel() {
      console.log('playChannel');
      //if (this.playing ) return;
      this.loading = true;
      this.clearErrors();
      console.log(!!this.station)

      //if(!!this.station)
      _audio.playSource(this.station.listen_url);
      _audio.setVolume(this.volume);
    },
    updateCurrentChannel() {
      let stationId = this.$route.params.id;
      console.log("stationId", stationId);
      let short_code = this.$route.params.shortcode
      if (short_code.length === 0) this.$router.push({name: "home"})
      if (isNaN(stationId)) stationId = this.getIDfromShortcode(short_code);
      if (isNaN(stationId)) this.$router.push({name: "home"})
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
      this.closeAudio();
      this.initPlayer();
      this.playChannel();
      this.setupMaintenance();

    },

    // on keyboard events
    onKeyboard(e) {
      const k = e.key || '';
      if (k === ' ' && this.stationId) return this.togglePlay();
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

    this.setupAudio();
    this.selectChannel();

  },
  beforeUpdate() {
    this.updateCurrentChannel()

  },
  beforeRouteUpdate(to, from, next) {

    console.log("beforeRouteUpdate : ", to.params.id);
    //Preload
    this.resetPlayer();
    if (to.params.id) {
      this.$store.dispatch('nowplaying/resetSongs')
      this.$store.dispatch('nowplaying/StationId', to.params.id)

    }
    this.selectChannel();
    next();
  },

  // on app destroyed
  beforeDestroy() {
    this.closeAudio();
  },
  destroyed() {
    this.$store.dispatch('nowplaying/resetSongs')
  }

}
</script>
