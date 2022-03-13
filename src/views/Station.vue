<template>
    <div class="stationView">
        <main class="player-content flex-row">
            <section class="flex-1" :key="stationId" v-if="visible">
                <div class="flex-autorow flex-top flex-stretch player-channel">
                    <!-- station details -->
                    <div class="flex-item flex-1">
                        <!-- station -->
                        <div class="push-bottom" v-if="station">
                            <div class="fx fx-slide-left fx-delay-2">
<!--                                <img class="img-round fx fx-drop-in fx-delay-1"
                                     v-if ="station"
                                     :src=" station.image "
                                     :alt="station.name "
                                     @error="station.image='/img/icon.png'"
                                     width="80"
                                     height="80"/>-->
                                <div class="flex-row flex-middle flex-space ">
                                    <h4 class="pad-left text-clip">{{ station.name | toText }}</h4>
                                    <favBtn class="pad-right" :id="station.id" style="font-size: x-large"></favBtn>
                                </div>
<!--                             <div class="text-nowrap">
                                  <p class="text-clip text-uppercase" style="width: 200px">a {{ station.description  | toText }} &nbsp;</p>
                                </div>-->
                            </div>
                        </div>

                        <div class="card push-bottom fx fx-slide-up fx-delay-3" v-if="config.showPlaylist" >
                            <div class="text-secondary" v-if="currentsong">
                                <span class="text-faded">Playlist:</span> {{
                                track.playlist
                                  }}.
                            </div>


                        </div>

                        <div class="card push-bottom flex-item flex-top flex-stretch fx fx-slide-up fx-delay-4 flex-1">

                            <div class="track-artwork"><img class="fx fx-fade-in"
                                                      :src="currentsong.art"
                                                      :alt="currentsong.title"
                                                      id="coverArt" /></div>
                            <div class="pad-bottom current-song">
                                <h3 class="text-secondary">{{ currentsong.title }}</h3>
                                <h5 class="text-bright text-faded">{{ currentsong.artist }}</h5>
                            </div>

                        </div>
                      <div class="next-song" v-if="hasNextSong">
                        <div class="card fx flex-row flex-middle flex-space fx-slide-left fx-delay-2">

                          <div class="pad-right"> {{$t('nextTrack')}} :
                            <span class="text-secondary">{{ nextSong.title   }}</span><br>
                            <span class="text-bright">   {{ nextSong.artist   }}</span>

                          </div>
                          <div class="pad-left"><img width="70" height="70"
                                                     :alt="nextSong.title"
                                                     :src="nextSong.art"/></div>
                        </div>
                      </div>
                        <!-- buttons -->
                        <div class="push-bottom text-nowrap" v-if="config.socialBtn">
                            <a class="cta-btn text-nowrap fx fx-slide-up fx-delay-5" title="Channel page">
                                    <span class="fx fx-notx fx-ibk fx-drop-in" ><i
                                            class="fa fa-comments"></i></span>
                            </a> &nbsp;
                            <a v-if="station" class="cta-btn text-nowrap fx fx-slide-up fx-delay-6" :href="station.twitter"
                               title="Twitter page" rel="noreferrer" target="_blank">
                                <i class="fab fa-twitter"></i>
                            </a> &nbsp;
                        </div>

                    </div>

                    <!-- songs list -->
                    <div class="flex-item flex-1">
                        <div class="push-bottom">
                            <h4 class="text-nowrap fx fx-slide-left fx-delay-1">{{$t('recent_tracks')}}</h4>
                        </div>
                        <div class="card push-bottom" v-if="!hasSongs">
                            There are no songs loaded yet for this station.
                        </div>
                        <ul class="player-tracklist push-bottom" v-if="hasSongs">

                            <li v-for="( s, i ) of songs" :key="s.played_at"
                                class="card fx flex-row flex-top flex-stretch"
                                :class="'fx-slide-left fx-delay-' + ( i + 2 )">
                                <div><img width="70" height="70"
                                          :alt="s.song.title"
                                          :src="s.song.art"/></div>
                                <div class="pad-left">
                                    <div><span
                                            class="text-secondary">{{ s.song.title   }}</span>
                                    </div>
                                    <div><span class="text-bright">{{ s.song.artist   }}</span>
                                    </div>
                                </div>
                            </li>

                        </ul>
                    </div>

                </div>
            </section>
        </main>
        <!-- player footer with controls -->
        <footer-player :loading="loading" :playing="playing" :canPlay="canPlay" v-on:togglePlay="togglePlay"> </footer-player>


    </div>
</template>

<script>

    import config from 'config';

    import _audio from '../js/audio';
    import favBtn from "@/views/components/favBtn";

    import footerPlayer from '@/views/components/footerPlayer'
    import { mapGetters, mapState  } from 'vuex';

    export default {
        name: 'station',
        components: {
            favBtn,
            footerPlayer
        },
        data: () => {
            return {
                config:config,
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

                //this.stationId = to.params.id;
            },


            // update player volume

        },

        // computed methods
        computed: {
            ...mapState('nowplaying',{
                stationId : state => state.stationId,
                //songs : 'songs',
                track : 'currentSong',
                currentsong : state => state.currentSong.song,
                nextSong : state => state.nextSong,
                station : state => state.currentStation,
                songs : state => state.songs,
                //channels : state => state.stations, //errors

            }),
            // check if there are tracks loaded
            ...mapGetters('nowplaying',['hasSongs','getIDfromShortcode']),

            // check if audio can be played
            canPlay() {
                return (this.stationId && !this.loading) ? true : false;
            },
            hasNextSong(){
              if(this.nextSong != null) return true;
              return false;
            },
            // check if a channel is selected
            hasChannel() {
                return this.stationId ? true : false;
            },
            // check for errors that would affect playback
            hasError() {
                if (this.errors.channels && !this.channels.length) return true;
                if (this.errors.stream) return true;
                return false;
            },
        },

        // custom methods
        methods: {

            // run maintenance tasks on a timer
            setupMaintenance() {
                let remainingtime =  Math.floor(this.track.remaining ) || 30;
                console.log("remainingtime:",remainingtime);
                console.log("setupMaintenance : for ",this.stationId);
                this.itv = setInterval(this.updateChannelData, remainingtime * 1000);
            },
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
            },

            // reset selected channel
            resetPlayer() {
                this.visible=false
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
                    this.setError('stream', `The selected stream (${this.station.title}) could not load, or has stopped loading due to a network problem.`);
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
              console.log("%c updateMediaSession",'color: green',  this.currentsong)
                if ('mediaSession' in navigator && !!this.currentsong ) {
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
                //if (this.playing || !channel ) return;
                this.loading = true;
                this.clearErrors();
                console.log(!!this.station)

                //if(!!this.station)
                _audio.playSource(this.station.listen_url);
                _audio.setVolume(this.volume);
            },
            // select a channel to play
            updateChannelData(){
                console.log("updateChannelData")

                 this.$store.dispatch('nowplaying/fetchNowplaying',this.stationId).then(()=>{
                     console.log("updateChannelData  then fetchNowplaying")
                     if (this.itv) clearInterval(this.itv);
                     this.setupMaintenance();
                 });
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
        beforeCreate(){
            console.log("beforeCreate Station.vue");
        },
        // on app Created
        created() {
            console.log("created Station.vue");
            let stationId = this.$route.params.id;
            console.log("stationId",stationId);
            //get station id from shortcode
            let short_code = this.$route.params.shortcode
            if( short_code.length === 0 ) this.$router.push({name : "home"})
            if(isNaN(stationId))  stationId = this.getIDfromShortcode(short_code);
            if( isNaN(stationId)  ) this.$router.push({name : "home"})
            // Update state with current station id
            this.$store.dispatch('nowplaying/StationId',stationId);

        },
        mounted() {
            console.log("mounted Station.vue");
            this.setupAudio();
            this.selectChannel();

        },
        beforeRouteUpdate(to, from, next) {

            console.log("beforeRouteUpdate : ",to.params.id);
            this.$store.dispatch('nowplaying/resetSongs')
            this.$store.dispatch('nowplaying/StationId',to.params.id)

            this.closeAudio();
            this.resetPlayer();
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
