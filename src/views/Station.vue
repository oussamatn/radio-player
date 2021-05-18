<template>
    <div class="stationView">
        <main class="player-content flex-row">
            <section class="player-channel flex-1" :key="stationId" v-if="visible">
                <div class="flex-autorow flex-top flex-stretch">
                    <!-- station details -->
                    <div class="flex-item flex-1">
                        <!-- station -->
                        <div class="push-bottom" v-if="station">
                            <div class="flex-row flex-middle">
                                <img class="img-round fx fx-drop-in fx-delay-1"
                                     v-if ="station"
                                     :src=" station.image "
                                     :alt="station.name "
                                     width="80"
                                     height="80"/>
                                <div class="pad-left fx fx-slide-left fx-delay-2">
                                    <h3 class="text-clip">{{ station.name | toText }}</h3>
                                    <div class="text-nowrap">
                                        <span class="text-clip text-uppercase">a {{ station.description  | toText }} &nbsp;</span>
                                        <favBtn :id="station.id" ></favBtn>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- description -->
                        <div class="card push-bottom fx fx-slide-up fx-delay-3" >
                            <div class="text-secondary" v-if="currentsong">
                                <span class="text-faded">Playlist:</span> {{
                                track.playlist
                                | toText( 'N/A' ) }}.
                            </div>
                            <!--TODO Add next song -->
                            <!--<div v-if="station">Next : {{ playing_next.song.title }}</div>-->
                        </div>
          <!--TODO: Insert background blur filter within a new wrapper -->

                        <div class="card push-bottom flex-item flex-top flex-stretch fx fx-slide-up fx-delay-4 flex-1"
                             >

                            <div class="pad-top"><img class="fx fx-fade-in"
                                                      :src="currentsong.art"
                                                      :alt="currentsong.title"
                                                      id="coverArt" /></div>
                            <div class="pad-bottom">
                                <div><span
                                        class="text-secondary">{{ currentsong.title | toText( 'N/A' ) }}</span>
                                </div>

                                <div><span class="text-faded">By:</span> <span class="text-bright">{{ currentsong.artist | toText( 'N/A' ) }}</span>
                                </div>
                            </div>

                        </div>

                        <!-- buttons -->
                        <div class="push-bottom text-nowrap">
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
                            <h4 class="text-nowrap fx fx-slide-left fx-delay-1">Recent Tracks</h4>
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
                                            class="text-secondary">{{ s.song.title | toText( 'N/A' ) }}</span>
                                    </div>
                                    <div><span class="text-faded">By:</span> <span class="text-bright">{{ s.song.artist | toText( 'N/A' ) }}</span>
                                    </div>
                                </div>
                            </li>

                        </ul>
                    </div>

                </div>
            </section>
        </main>
        <!-- player footer with controls -->
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
                <a class="common-btn text-faded" rel="noreferrer" href="https://twitter.com" title="Twitter"
                   target="_blank">
                    <i class="fab fa-twitter"></i>
                </a> &nbsp;
                <a class="common-btn text-faded" rel="noreferrer" href="https://facebook.com"
                   title="Facebook"
                   target="_blank">
                    <i class="fab fa-facebook"></i>
                </a>
            </section>

        </footer>
    </div>
</template>

<script>


    import _joujma from '../js/api';
    import _scene from '../js/scene'
    import _audio from '../js/audio';
    import favBtn from "@/views/favBtn";
    import { mapGetters, mapState  } from 'vuex';

    export default {
        name: 'station',
        components: {
            favBtn
        },
        data: () => {
            return {
                // toggles
                visible: false,
                playing: false,
                loading: true,
                volume: 0.4,
                // errors stuff
                errors: {},
                // timer stuff
                timeStart: 0,
                timeDisplay: '00:00:00',
                timeItv: null,
                anf: null,
                sto: null,
                itv: null,
            }
        },

        // watch methods
        watch: {
            songs(songs) {
                console.log("%c watch songs",'color: green', songs)
                this.updateMediaSession();

            },
            //route change
            $route(to, from) {

                //this.stationId = to.params.id;
            },
            // watch playing status
            playing() {
                if (this.playing) {
                    this.startClock();
                } else {
                    this.stopClock();
                }
            },

            // update player volume
            volume() {
                _audio.setVolume(this.volume);
            }
        },

        // computed methods
        computed: {
            ...mapState('nowplaying',{
                stationId : state => state.stationId,
                songs : 'songs',
                track : 'currentSong',
                currentsong : state => state.currentSong.song,
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
                let remainingtime = ( Math.floor(Date.now()/1000) - this.track.played_at ) || 10;
                console.log("remainingtime:",remainingtime);
                console.log("setupMaintenance : for ",this.stationId);
                this.itv = setInterval(this.updateChannelData, remainingtime * 1000);
            },
          // setup animation canvas
          setupCanvas() {
            _scene.setupCanvas();
          },
          // audio visualizer animation loop
          updateCanvas() {
            this.anf = requestAnimationFrame( this.updateCanvas );
            if ( !this.visible ) return;
            const freq = _audio.getFreqData();
            _scene.updateObjects( freq );
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
                if ('mediaSession' in navigator && !!this.song ) {
                    navigator.mediaSession.metadata = new MediaMetadata({
                        title: this.currentsong.song.title,
                        artist: this.currentsong.song.artist,
                        artwork: [
                            {src: this.currentsong.song.art}
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
            // TODO Song play time
            songClock() {
                let p = n => (n < 10) ? '0' + n : '' + n;
                let elapsed = (Date.now() - this.timeStart) / 1000;
                let seconds = Math.floor(elapsed % 60);
                let minutes = Math.floor(elapsed / 60 % 60);
                let hours = Math.floor(elapsed / 3600);
                this.timeDisplay = p(hours) + ':' + p(minutes) + ':' + p(seconds);
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
        beforeCreate(){
            console.log("beforeCreate Station.vue");



        },
        // on app Created
        created() {
            console.log("created Station.vue");
            let stationId = this.$route.params.id;
            console.log("stationId",stationId);
            //get station id from shortcode
            if(isNaN( stationId)) stationId = this.getIDfromShortcode(this.$route.params.shortcode);
            // Update state with current station id
            this.$store.dispatch('nowplaying/StationId',stationId);
            this.setupCanvas();
            this.updateCanvas();


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
        destroyed() {
            this.$store.dispatch('nowplaying/resetSongs')
            this.closeAudio();
            this.clearTimers();
            this.$parent.initView();
        }

    }
</script>
