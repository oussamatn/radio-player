<template>
  <div class="flex-item flex-1">
    <!-- station -->
    <div v-if="station" class="push-bottom">
      <div class="fx fx-slide-left fx-delay-2">
        <!--                                <img class="img-round fx fx-drop-in fx-delay-1"
                                             v-if ="station"
                                             :src=" station.image "
                                             :alt="station.name "
                                             @error="station.image='/img/icon.png'"
                                             width="80"
                                             height="80"/>-->
        <div class="flex-row flex-middle flex-space ">
          <h4 class="pad-left text-clip">{{ station.name.toUpperCase() | toText }}</h4>
          <favBtn :id="station.id" class="pad-right" style="font-size: x-large"></favBtn>
        </div>
        <!--                             <div class="text-nowrap">
                                          <p class="text-clip text-uppercase" style="width: 200px">a {{ station.description  | toText }} &nbsp;</p>
                                        </div>-->
      </div>
    </div>


    <div v-if="config.showPlaylist" class="card push-bottom fx fx-slide-up fx-delay-3">
      <div v-if="currentsong" class="text-secondary">
        <span class="text-faded">Playlist:</span> {{ track.playlist }}
      </div>
    </div>

    <div class="push-bottom ">
      <div class="card flex-item flex-top flex-stretch fx fx-slide-up fx-delay-4 flex-1">

        <div class="track-artwork"><img id="coverArt"
                                        :alt="currentsong.title"
                                        :src="currentsong.art"
                                        class="fx fx-fade-in"/></div>
        <div class="pad-bottom current-song">
          <h3 class="text-secondary">{{ currentsong.title }}</h3>
          <h5 class="text-bright text-faded">{{ currentsong.artist }}</h5>
        </div>

      </div>
      <div v-if="hasNextSong" class="next-song">
        <div class="card fx flex-row flex-middle flex-space fx-slide-left fx-delay-2">

          <div class="pad-right"> {{ $t('nextTrack') }} :
            <span class="text-secondary">{{ nextSong.title }}</span><br>
            <span class="text-bright">   {{ nextSong.artist }}</span>

          </div>
          <div class="pad-left"><img :alt="nextSong.title" :src="nextSong.art"
                                     height="70"
                                     width="70"/></div>
        </div>
      </div>
    </div>
    <!-- buttons -->
    <div v-if="config.socialBtn" class="push-bottom text-nowrap">
      <a class="cta-btn text-nowrap fx fx-slide-up fx-delay-5" title="Channel page">
                                    <span class="fx fx-notx fx-ibk fx-drop-in"><i
                                        class="fa fa-comments"></i></span>
      </a> &nbsp;
      <a v-if="currentsong" :href="twitterShare" class="cta-btn text-nowrap fx fx-slide-up fx-delay-6"
         rel="noreferrer" target="_blank" title="Share on twitter">
        <i class="fab fa-twitter"></i>
      </a> &nbsp;
    </div>

  </div>
</template>

<script>
import {mapState} from 'vuex';
import favBtn from "@/views/components/favBtn";


export default {
  name: "mainSong",
  components: {
    favBtn
  },

  computed: {
    ...mapState('nowplaying', {
      track: 'currentSong',
      currentsong: state => state.currentSong.song,
      nextSong: state => state.nextSong,
      station: state => state.currentStation,
      songs: state => state.songs,
      //channels : state => state.stations, //errors

    }),
    config(){
      return this.$store.getters["playerConfig/getConfig"];
    },
    hasNextSong() {
      if (this.nextSong != null) return true;
      return false;
    },
    twitterShare(){
      return "https://twitter.com/share?text=" + this.$t('tw_listening_to') + this.currentsong.text + this.$t('live_on') + this.station.name + "&url=" + window.location.href ; // + "&hashtags=hashtag1,hashtag2,hashtag3"
    }
  }
}
</script>

<style scoped>

</style>