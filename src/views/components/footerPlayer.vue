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
      <i class="fa fa-volume-down"></i>
      <input aria-label="volume" class="common-slider" type="range" min="0.0" max="1.0" step="0.1" value="0.5"
             v-model="volume"/>
      <i class="fa fa-volume-up"></i>
    </div>
    <div class="text-clip push-left">
      <span>{{ timeDisplay }}</span>
      <span class="text-faded" v-if="hasChannel">&nbsp;|&nbsp;</span>
      <span class="fx fx-fade-in fx-delay-1" v-if="station"
            :key="stationId">{{ station.title }}</span>
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
import config from 'config';
export default {
  name: "footerPlayer",
  data: () => {
    return {
      config:config,
      // toggles
      visible: false,
      playing: false,
      loading: true,
      volume: 0.8,
      // errors stuff
      errors: {},
      // timer stuff
      timeStart: 0,
      timeDisplay: '00:00:00',
      timeItv: null,

    }
  },
}
</script>

<style scoped>

</style>