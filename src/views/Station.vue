<template>
    <div class="stationView">
        <main class="player-content flex-row">
            <section class="player-channel flex-1" :key="stationId">
                <div class="flex-autorow flex-top flex-stretch">
                    <!-- station details -->
                    <div class="flex-item flex-1">
                        <!-- station -->
                        <div class="push-bottom">
                            <div class="flex-row flex-middle">
                                <img class="img-round fx fx-drop-in fx-delay-1"
                                     :src="'/img/'+station.shortcode+'.png'"
                                     width="80"
                                     height="80" :alt="station.title" />
                                <div class="pad-left fx fx-slide-left fx-delay-2">
                                    <h3 class="text-clip">{{ station.name }}</h3>
                                    <div class="text-nowrap">
                                        <span class="text-clip text-uppercase">a {{ station.shortcode | toText }} &nbsp;</span>
                                        <!--<favBtn :id="station.id" :active="channel.favorite"
                                                ></favBtn>-->
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- description -->
                        <div class="card push-bottom fx fx-slide-up fx-delay-3">
                            <div class="text-secondary"><span class="text-faded">Playlist:</span> {{
                                track.playlist
                                | toText( 'N/A' ) }}.
                            </div>
                            <div>{{ channel.description }}</div>
                        </div>
                        <div class="card push-bottom flex-item flex-top flex-stretch fx fx-slide-up fx-delay-4 flex-1"
                             :key="track.played_at">

                            <div class="pad-top"><img class="fx fx-fade-in"
                                                      :src="currentsong.art" id="coverArt" crossorigin="anonymous" /></div>
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
                                    <span class="fx fx-notx fx-ibk fx-drop-in" :key="channel.listeners"><i
                                            class="fa fa-comments"></i></span>
                            </a> &nbsp;
                            <a class="cta-btn text-nowrap fx fx-slide-up fx-delay-6" :href="channel.twitter"
                               title="Twitter page" target="_blank">
                                <i class="fa fa-twitter"></i>
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

                            <li v-for="( s, i ) of songsList" :key="s.played_at"
                                class="card fx flex-row flex-top flex-stretch"
                                :class="'fx-slide-left fx-delay-' + ( i + 2 )">
                                <div><img width="70" height="70" :src="s.song.art"/></div>
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
                <button class="common-btn" @click="togglePlay()">
                    <i v-if="loading" class="fa fa-circle-o-notch fx fx-spin-right" key="wait"></i>
                    <i v-else-if="playing" class="fa fa-stop fx fx-drop-in" key="stop"></i>
                    <i v-else class="fa fa-play fx fx-drop-in" key="play"></i>
                </button>
                <div class="form-slider push-left">
                    <i class="fa fa-volume-down"></i>
                    <input class="common-slider" type="range" min="0.0" max="1.0" step="0.1" value="0.5"
                           v-model="volume"/>
                    <i class="fa fa-volume-up"></i>
                </div>
                <!--<div class="text-clip push-left">
                    <span>{{ timeDisplay }}</span>
                    <span class="text-faded" v-if="hasChannel">&nbsp;|&nbsp;</span>
                    <span class="fx fx-fade-in fx-delay-1" v-if="hasChannel"
                          :key="stationId">{{ channel.title }}</span>
                </div>-->
            </section>

            <!-- player links -->
            <section class="player-links text-nowrap">
                <a class="common-btn text-faded" rel="noreferrer" href="https://twitter.com" title="Twitter"
                   target="_blank">
                    <i class="fa fa-twitter"></i>
                </a> &nbsp;
                <a class="common-btn text-faded" rel="noreferrer" href="https://facebook.com"
                   title="Facebook"
                   target="_blank">
                    <i class="fa fa-facebook"></i>
                </a>
            </section>

        </footer>
    </div>
</template>

<script>


    import _joujma from '../js/api';
    import _audio from '../js/audio';
    import ColorThief from 'colorthief';

    import favBtn from "@/views/favBtn";

    export default {
        name: 'station',
        components: {
            favBtn
        },
        data: () => {
            return {
                // toggles
                init: false,
                visible: false,
                playing: false,
                loading: false,
                volume: 0.5,
                // channels stuff
                stationId: '',
                channel: {},
                songs: [],
                track: {},
                currentsong: {},
                station: {},
                favorites: [],
                errors: {},
                //background stuff
                colorThief:null,
                bg: {},
                // timer stuff
                timeStart: 0,
                timeDisplay: '00:00:00',
                timeItv: null,
                // sorting stuff
                searchText: '',
                sortParam: 'listeners',
                sortOrder: 'desc',
                // timer stuff
                anf: null,
                sto: null,
                itv: null,
            }
        },

        // watch methods
        watch: {
            //route change
            $route(to, from) {
                // react to route changes...
                //console.log(from,to);
                this.stationId = to.params.id;
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
            // filter songs list
            songsList() {
                let list = this.songs.slice();
                return list;
            },
            // check if audio can be played
            canPlay() {
                return (this.stationId && !this.loading) ? true : false;
            },

            // check if a channel is selected
            hasChannel() {
                return this.stationId ? true : false;
            },

            // check if there are tracks loaded
            hasSongs() {
                return !!this.songs.length;
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
                //this.track.remaining=30;
                //console.log("remainingtime:",this.track.remaining);
                this.itv = setInterval(() => {
                    //clearInterval(this.itv);
                    console.log("setupMaintenance");
                    this.getSongs(); // update channel tracks
                    this.updateBackground();
                        //console.log("remainingtime:",this.track.remaining);
                }, 30* 1000);
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

            // show player when app is mounted
            initPlayer() {
                console.log("initPlayer");
                document.querySelector('#_spnr').style.display = 'none';
                document.querySelector('#player-wrap').style.opacity = '1';
                document.addEventListener('visibilitychange', e => {
                    this.visible = (document.visibilityState === 'visible')
                });
                // window.addEventListener('hashchange', e => this.applyRoute(window.location.hash));
                window.addEventListener('keydown', this.onKeyboard);
                this.init = true;
            },

            // reset selected channel
            resetPlayer() {
                this.closeAudio();
                this.clearErrors();
                this.channel = {};
                this.songs = [];
            },
            InitColorthief(){
              this.colorThief = new ColorThief();
            },
            updateBackground(){
                if (this.colorThief == null) this.InitColorthief();
                console.log("updateBackground");
                this.$parent.background = this.currentsong.art;
                let img = document.querySelector('#coverArt');
                if (img.complete) {
                    this.bg = this.colorThief.getColor(img);
                } else {
                    img.addEventListener('load', () => {
                        console.log("img>load");
                        console.log(this.colorThief.getColor(img));
                        this.bg = this.colorThief.getColor(img);
                    });
                }
                console.log("background ",this.bg);
                if(this.bg) document.querySelector('#player-wrap').style.backgroundImage = 'linear-gradient(0deg, rgba('+this.bg[0]+','+this.bg[1]+','+this.bg[2]+',1) 0%, #1e1f30 100%)';
            },
            // try resuming stream problem if possible
            tryAgain() {
                this.clearErrors();
                this.playChannel(this.channel);
            },
            // toggle stream playback for current selected channel
            togglePlay() {
                if (this.loading) return;
                if (this.playing) return this.closeAudio();
                return this.playChannel(this.channel);
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
                    this.setError('stream', `The selected stream (${this.channel.title}) could not load, or has stopped loading due to a network problem.`);
                    this.playing = false;
                    this.loading = false;
                });
            },

            // close active audio
            closeAudio() {
                _audio.stopAudio();
                this.playing = false;
            },
            // get songs list for a channel from api
            getSongs(stationId, cb) {
                if (!stationId) stationId=this.stationId;
                _joujma.getSongs(stationId, (err, songs) => {
                    if (err) return this.setError('songs', err);
                    this.track = songs.now_playing;
                    this.currentsong = songs.now_playing.song;
                    this.station = songs.station;
                    this.updateMediaSession();
                    this.songs = songs.song_history.slice(0, 4);
                    this.setError('songs', '');
                    if (typeof cb === 'function') cb(songs);
                });
            },
            //Update navigator media session data
            updateMediaSession() {
                if ('mediaSession' in navigator) {
                    navigator.mediaSession.metadata = new MediaMetadata({
                        title: this.track.song.title,
                        artist: this.track.song.artist,
                        artwork: [
                            {src: this.track.song.art}
                        ]
                    });
                }
            },


            // play audio stream for a channel
            playChannel() {
                console.log('playChannel');

                //if (this.playing || !channel || !channel.mp3file) return;
                this.loading = true;
                this.clearErrors();
                _audio.playSource(this.station.listen_url);
                _audio.setVolume(this.volume);
            },

            // select a channel to play
            selectChannel(stationId) {
                this.closeAudio();
                this.getSongs(stationId, () => {
                    this.playChannel();
                    this.updateBackground();
                });

                //this.channel = channel;
            },

            // on keyboard events
            onKeyboard(e) {
                const k = e.key || '';
                if (k === ' ' && this.stationId) return this.togglePlay();
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
                if (this.anf) cancelAnimationFrame(this.anf);
            },
        },

        // on app Created
        created() {
            console.log("created Station.vue");
            this.stationId = this.$route.params.id;
            this.selectChannel(this.stationId);
            this.setupAudio();
            this.setupMaintenance();

        },
        mounted() {
            console.log("mounted Station.vue");
            this.initPlayer();
            //this.updateBackground();
        },
        beforeRouteUpdate(to, from, next) {
            console.log(to.params.id);
            this.stationId = to.params.id;
            this.closeAudio();
            this.resetPlayer();
            this.selectChannel(this.stationId);
            next();
        },
        // on app destroyed
        destroyed() {
            this.closeAudio();
            this.clearTimers();
        }

    }
</script>
