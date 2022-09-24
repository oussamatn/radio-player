<template>
  <footer class="player-footer flex-row flex-middle flex-space">
  <!-- player controls -->
  <section class="player-controls flex-row flex-middle push-right"
           :class="{ 'disabled': !canPlay }">
    <button class="common-btn" @click="togglePlay()" aria-label="play">
      <i v-if="loading" class="fas fa-circle-notch fx fx-spin-right" key="wait"></i>
      <i v-else-if="playing" class="fa fa-stop fx fx-drop-in" key="stop"></i>
      <i v-else class="fa fa-play fx fx-drop-in" key="play"></i>
    </button>
    <div class="form-slider push-left">
      <i class="fa fa-volume-down" @click="volumeDown()"></i>
      <input aria-label="volume" class="common-slider" type="range" min="0.0" max="1.0" step="0.1" value="0.5"
             v-model="volume"/>
      <i class="fa fa-volume-up" @click="volumeUp()"></i>
    </div>
    <div class="text-clip push-left">
      <span>{{ timeDisplay }}</span>
<!--      <span class="text-faded" v-if="hasChannel">&nbsp;|&nbsp;</span>-->
<!--      <span class="fx fx-fade-in fx-delay-1" v-if="station"-->
<!--            :key="stationId">{{ station.title }}</span>-->
    </div>
  </section>

  <!-- player links -->
  <section class="player-links text-nowrap">
    <animation-selection></animation-selection>
    <a v-if=config.twitter.username class="common-btn text-faded" rel="noreferrer" :href="'https://twitter.com/'+config.twitter.username" title="Twitter"
       target="_blank">
      <i class="fab fa-twitter"></i>
    </a> &nbsp;
    <a v-if=config.facebook.page_id class="common-btn text-faded" rel="noreferrer" :href="'https://fb.me/'+config.facebook.page_id"
       title="Facebook"
       target="_blank">
      <i class="fab fa-facebook"></i>
    </a>
  </section>
  </footer>
</template>

<script>
import animationSelection from '@/views/components/animationSelection'
import _audio from '../../../js/audio';
export default {
  name: "footerPlayer",
  components: {
    animationSelection
  },
  props: {
    canPlay: Boolean,
    playing: Boolean,
    loading: Boolean,
    config : Object,
  },
  data: () => {
    return {
      volume: 0.5,
      errors: {},
      timeStart: 0,
      timeDisplay: '00:00:00',
      timeItv: null,

    }
  },
  watch : {
    volume() {
      _audio.setVolume(this.volume);
    },
    // watch playing status
    playing() {
      if (this.playing) {
        this.startClock();
      } else {
        this.stopClock();
      }
    },
  },
  methods : {
    togglePlay() {
      this.$emit('togglePlay')
    },
    volumeUp(){
      if (this.volume + 0.1 > 1) return;
      this.volume += 0.1
    },
    volumeDown(){
      if (this.volume - 0.1 < 0) return;
      this.volume -= 0.1
    },
    // start tracking playback time
    startClock() {
      this.stopClock();
      this.timeStart = Date.now();
      this.timeItv = setInterval(this.updateClock, 1000);
      this.updateClock();
    },

    // update tracking playback time
    updateClock() {
      let p = n => (n < 10) ? '0' + n : '' + n;
      let elapsed = (Date.now() - this.timeStart) / 1000;
      let seconds = Math.floor(elapsed % 60);
      let minutes = Math.floor(elapsed / 60 % 60);
      let hours = Math.floor(elapsed / 3600);
      this.timeDisplay = p(hours) + ':' + p(minutes) + ':' + p(seconds);
    },

    // stop tracking playback time
    stopClock() {
      if (this.timeItv) clearInterval(this.timeItv);
      this.timeItv = null;
    },

    // clear timer refs
    clearTimers() {
      if (this.sto) clearTimeout(this.sto);
      if (this.itv) clearInterval(this.itv);
      //if (this.anf) cancelAnimationFrame(this.anf);
    },


  },
  destroyed() {
    this.clearTimers();

  }
}
</script>

<style scoped>

</style>