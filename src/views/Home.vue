<template>

        <!-- app root container -->
        <div id="app" class="app-wrap">

            <!-- initial spinner -->
            <div id="_spnr">
                <svg width="100" height="100" xmlns="https://www.w3.org/2000/svg" viewBox="0 0 100 100"
                     preserveAspectRatio="xMidYMid" class="lds-ring">
                    <circle cx="50" cy="50" fill="none" r="40" stroke="#8086a0" stroke-width="10"></circle>
                    <circle cx="50" cy="50" fill="none" r="40" stroke="#1e1f30" stroke-width="6" stroke-linecap="round"
                            stroke-dasharray="150 100"></circle>
                </svg>
                <noscript>
                    This applications requires Javascript to run.
                    Make sure Javascript is enabled in your web browser settings and try again.
                    <a href="https://www.enable-javascript.com/" target="_blank">Visit this link</a>
                    for more information on how to enable Javascript.
                </noscript>
            </div>
            <!-- app player container -->
            <main id="player-wrap" class="player-wrap" style="opacity: 0;">

                <!-- bg absolute elements -->
                <!-- <figure id="player-bg" class="player-bg" style="background-image: url( img/bg.jpg );"></figure> -->
                <figure id="player-bg" class="player-bg" style="background-image: url( img/icon.png );"></figure>
                <canvas id="player-canvas" class="player-canvas"></canvas>

                <!-- main player layout -->
                <section class="player-layout">

                    <!-- player top header -->
                    <header class="player-header flex-row flex-middle flex-stretch">
                        <h2 class="text-clip flex-1"><i class="fa fa-headphones"></i> <span
                                @click="setRoute( null )">FM Player</span></h2>
                        <button class="text-nowrap common-btn" id="sidebar" @click="toggleSidebar( true )"><i
                                class="fa fa-bars"></i></button>
                    </header>

                    <!-- player middle content area -->
                    <main class="player-content flex-row">

                        <!-- default greet message -->
                        <section class="player-greet" v-if="!hasChannel && !hasError">
                            <div class="fx fx-slide-left push-bottom"><h1>Pick a Station</h1></div>
                            <div class="fx fx-slide-left fx-delay-1 push-bottom">
                                <div id="firebaseui-auth-container"></div>
                            </div>
                            <div class="fx fx-slide-up fx-delay-2 pad-top">
                                <button class="cta-btn" @click="toggleSidebar( true )"><i
                                        class="fa fa-headphones">&nbsp;</i>
                                    View Stations
                                </button>
                            </div>

                            <div id=installer>
                                <button class=button>Install</button>
                            </div>

                        </section>

                        <!-- show selected channel info if possible -->
                        <section class="player-channel flex-1" v-if="hasChannel && !hasError" :key="channel.id">
                            <div class="flex-autorow flex-top flex-stretch">

                                <!-- station details -->
                                <div class="flex-item flex-1">

                                    <!-- station -->
                                    <div class="push-bottom">
                                        <div class="flex-row flex-middle">
                                            <img class="img-round fx fx-drop-in fx-delay-1" :src="channel.image"
                                                 width="80"
                                                 height="80" :alt="channel.title"/>
                                            <div class="pad-left fx fx-slide-left fx-delay-2">
                                                <h3 class="text-clip">{{ channel.name }}</h3>
                                                <div class="text-nowrap">
                                                    <span class="text-clip text-uppercase">a {{ channel.shortcode | toText }} &nbsp;</span>
                                                    <favBtn :id="channel.id" :active="channel.favorite"
                                                             @change="toggleFavorite"></favBtn>
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

                                    <!-- current track -->

                                    <!--
                                    <div class="card push-bottom fx fx-slide-up fx-delay-4" :key="track.played_at">

                                      <img class="img-round" width="70" height="70" :src="currentsong.art" />
                                      <div><span class="text-secondary">{{ currentsong.title | toText( 'N/A' ) }}</span></div>
                                      <div><span class="text-faded">From:</span> <span class="text-bright">{{ currentsong.album | toText( 'N/A' ) }}</span></div>
                                      <div><span class="text-faded">By:</span> <span class="text-default">{{ currentsong.artist | toText( 'N/A' ) }}</span></div>

                                    </div>
                                     -->


                                    <div class="card push-bottom flex-row flex-top flex-stretch fx fx-slide-up fx-delay-4 flex-1"
                                         :key="track.played_at">

                                        <img class="fx fx-fade-in" width="70" height="70" :src="currentsong.art"/>
                                        <div class="pad-left">
                                            <div><span
                                                    class="text-secondary">{{ currentsong.title | toText( 'N/A' ) }}</span>
                                            </div>
                                            <!--                       <div><span class="text-faded">From:</span> <span class="text-bright">{{ currentsong.album | toText( 'N/A' ) }}</span></div> -->
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
                                                <!--                       <div><span class="text-faded">From:</span> <span class="text-bright">{{ s.song.album | toText( 'N/A' ) }}</span></div> -->
                                                <div><span class="text-faded">By:</span> <span class="text-bright">{{ s.song.artist | toText( 'N/A' ) }}</span>
                                                </div>
                                            </div>
                                        </li>

                                    </ul>
                                </div>

                            </div>
                        </section>

                        <!-- show tracks for selected channel if possible -->
                        <section class="player-errors flex-1 text-center" v-if="hasError" key="errors">
                            <div class="push-bottom fx fx-drop-in fx-delay-1">
                                <i class="fa fa-plug text-huge text-faded"></i>
                            </div>
                            <div class="fx fx-slide-up fx-delay-2">
                                <h3>Oops, there's a problem!</h3>
                            </div>
                            <hr/>
                            <div v-for="( e, i ) of errors" class="push-bottom fx fx-slide-up"
                                 :class="'fx-delay-' + ( i + 3 )">
                                <span class="text-primary">{{ e }}</span>
                            </div>
                            <hr/>
                            <button class="cta-btn text-nowrap fx fx-slide-up fx-delay-4" @click="tryAgain">
                                <i class="fa fa-refresh"></i> Try again
                            </button>
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
                            <div class="text-clip push-left">
                                <span>{{ timeDisplay }}</span>
                                <span class="text-faded" v-if="hasChannel">&nbsp;|&nbsp;</span>
                                <span class="fx fx-fade-in fx-delay-1" v-if="hasChannel"
                                      :key="channel.id">{{ channel.title }}</span>
                            </div>
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

                </section> <!-- layout wrapper -->

                <!-- player stations overlay + sidebar -->
                <section class="player-stations" :class="{ 'visible': sidebar }" @click="toggleSidebar( false )">
                    <aside class="player-stations-sidebar" @click.stop>

                        <!-- sidebar search -->
                        <header class="player-stations-header flex-row flex-middle flex-stretch">
                            <div class="form-input push-right">
                                <i class="fa fa-search"></i>
                                <input type="text" placeholder="Search station..." v-model="searchText"/>
                            </div>
                            <button class="common-btn" @click="toggleSidebar( false )"><i
                                    class="fa fa-times-circle"></i>
                            </button>
                        </header>

                        <!-- sidebar stations list -->
                        <ul class="player-stations-list">
                            <li class="player-stations-list-item flex-row flex-top flex-stretch"
                                v-for="c of channelsList"
                                :key="c.id" @click="setRoute( c.route )" :class="{ 'active': c.active }">
                                <figure class="push-right if-small">
                                    <img class="img-round" width="70" height="70" :src="c.image" :alt="c.name"/>
                                </figure>
                                <aside class="flex-1">
                                    <div class="flex-row flex-middle flex-space">
                                        <div class="player-stations-list-title text-bright text-clip">{{ c.name }}</div>
                                        <div class="text-nowrap">
                                            <!--  <span class="text-secondary"><i class="fa fa-headphones"></i> {{ c.listeners | toCommas( 0 ) }} &nbsp;</span> -->
                                            <favBtn :id="c.id" :active="c.favorite" @change="toggleFavorite"></favBtn>
                                        </div>
                                    </div>
                                    <div class="text-small">
                                        <!-- <span class="text-faded text-uppercase text-small">{{ c.genre | toText }}</span> <br /> -->
                                        {{ c.description }}
                                    </div>
                                </aside>
                            </li>
                        </ul>

                    </aside>
                </section>

            </main> <!-- player -->

        </div> <!-- wrapper -->

</template>

<script>
    /**
     * Main app JS entry file.
     */


    // import '../js/serviceWorker';
    import '../scss/app.scss';
    import '../js/filters';
    //import '../js/favorite';
    // import "../js/PWAinstaller";
    //import "../js/init-firebase";

    import _soma from '../js/soma';
    import _audio from '../js/audio';
    //import _scene from '../js/scene';
    import _utils from '../js/utils';
    import _store from '../js/store';
    import favBtn from "@/views/favBtn";

    export default {
        name: 'home',
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
                sidebar: false,
                volume: 0.5,
                // channels stuff
                channels: [],
                channel: {},
                songs: [],
                track: {},
                currentsong: {},
                favorites: [],
                errors: {},
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

            // filter channels list
            channelsList() {
                let list = this.channels.slice();
                let search = this.searchText.replace(/[^\w\s\-]+/g, '').replace(/[\r\s\t\n]+/g, ' ').trim();

                if (search && search.length > 1) {
                    list = _utils.search(list, 'name', search);
                }
                if (this.sortParam) {
                    list = _utils.sort(list, this.sortParam, this.sortOrder, true);
                }
                if (this.channel.id) {
                    list = list.map(i => {
                        i.active = (this.channel.id === i.id) ? true : false;
                        return i;
                    });
                }
                return list;
            },

            // filter songs list
            songsList() {
                let list = this.songs.slice();
                return list;
            },

            // sort-by label for buttons, etc
            sortLabel() {
                switch (this.sortParam) {
                    case 'title'     :
                        return 'Station Name';
                    case 'listeners' :
                        return 'Listeners Count';
                    case 'favorite'  :
                        return 'Saved Favorites';
                    case 'genre'     :
                        return 'Music Genre';
                }
            },

            // check if audio can be played
            canPlay() {
                return (this.channel.id && !this.loading) ? true : false;
            },

            // check if a channel is selected
            hasChannel() {
                return this.channel.id ? true : false;
            },

            // check if there are tracks loaded
            hasSongs() {
                return this.songs.length ? true : false;
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
                this.itv = setInterval(() => {
                    //this.getChannels(); // update channels
                    this.getSongs(this.channel); // update channel tracks
                }, 1000 * 30);
            },

            // set an erro message
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
                window.addEventListener('hashchange', e => this.applyRoute(window.location.hash));
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

            // try resuming stream problem if possible
            tryAgain() {
                this.clearErrors();
                this.playChannel(this.channel);
            },

            // show/hide the sidebar
            toggleSidebar(toggle) {
                this.sidebar = (typeof toggle === 'boolean') ? toggle : false;
            },

            // show sidebar at startup if there are no errors
            initSidebar() {
                if (this.hasError) return;
                this.toggleSidebar(false);
            },

            // toggle stream playback for current selected channel
            togglePlay() {
                if (this.loading) return;
                if (this.playing) return this.closeAudio();
                return this.playChannel(this.channel);
            },

            // load last sort options from store
            loadSortOptions() {
                const opts = _store.get('sorting_data');
                if (opts && opts.param) this.sortParam = opts.param;
                if (opts && opts.order) this.sortOrder = opts.order;
            },

            // toggle sort order
            toggleSortOrder() {
                this.sortOrder = (this.sortOrder === 'asc') ? 'desc' : 'asc';
            },

            // apply sorting and toggle order
            sortBy(param, order) {
                if (this.sortParam === param) {
                    this.toggleSortOrder();
                } else {
                    this.sortOrder = order || 'asc';
                }
                this.sortParam = param;
                _store.set('sorting_data', {param: this.sortParam, order: this.sortOrder});
            },

            // load saved favs list from store
            loadFavorites() {
                const favs = _store.get('favorites_data');
                if (!Array.isArray(favs)) return;
                this.favorites = favs;
            },

            // save favs to a .m3u file
            saveFavorites() {
                let data = '#EXTM3U';
                for (let id of this.favorites) {
                    const channel = this.channels.filter(c => (c.id === id)).shift();
                    if (!channel) continue;
                    data += '\n\n';
                    data += `#EXTINF:0,${channel.title} [JoujmaFM]\n`;
                    data += `${channel.mp3file}`;
                }
                const elm = document.createElement('a');
                elm.setAttribute('href', 'data:audio/mpegurl;charset=utf-8,' + encodeURIComponent(data));
                elm.setAttribute('download', 'somafm_favorites.m3u');
                elm.setAttribute('target', '_blank');
                document.body.appendChild(elm);
                setTimeout(() => elm.click(), 100);
                setTimeout(() => elm.remove(), 1000);
            },

            // toggle favorite channel by id
            toggleFavorite(id, toggle) {
                let favs = this.favorites.slice();
                favs = favs.filter(fid => (fid !== id));
                if (toggle) favs.push(id);
                this.favorites = favs;
                this.updateCurrentChannel();
                _store.set('favorites_data', favs);
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

            // setup animation canvas
            setupCanvas() {
                _scene.setupCanvas();
            },

            // audio visualizer animation loop
            updateCanvas() {
                this.anf = requestAnimationFrame(this.updateCanvas);
                if (!this.visible) return;
                const freq = _audio.getFreqData();
                _scene.updateObjects(freq);
            },

            // get channels data from api
            getChannels(sidebar) {
                _soma.getChannels((err, channels) => {
                    if (err) return this.setError('channels', err);
                    if (sidebar) this.toggleSidebar(true);
                    this.channels = channels;
                    this.setError('channels', '');
                    this.updateCurrentChannel();
                    this.applyRoute(window.location.hash);
                });
            },

            // get songs list for a channel from api
            getSongs(channel, cb) {
                if (!channel || !channel.id || !channel.songsurl) return;
                if (!this.isCurrentChannel(channel)) {
                    this.songs = [];
                    this.track = {};
                    this.currentsong = {};
                }

                _soma.getSongs(channel, (err, songs) => {
                    if (err) return this.setError('songs', err);
                    if (typeof cb === 'function') cb(songs);
                    this.track = songs.now_playing;
                    this.currentsong = songs.now_playing.song;
                    this.updateMediaSession();
                    this.songs = songs.song_history.slice(0, 4);
                    this.setError('songs', '');
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
            // checks is a channel is currently selected
            isCurrentChannel(channel) {
                if (!channel || !channel.id || !this.channel.id) return false;
                if (this.channel.id !== channel.id) return false;
                return true;
            },

            // update data for current selected channel
            updateCurrentChannel() {
                for (let c of this.channels) {
                    // see if channel has been saved as a favorite
                    c.favorite = (this.favorites.indexOf(c.id) >= 0);
                    // see if channel is currently selected
                    if (this.isCurrentChannel(c)) {
                        this.channel = Object.assign(this.channel, c);
                        c.active = true;
                    }
                }
            },

            // play audio stream for a channel
            playChannel(channel) {
                if (this.playing || !channel || !channel.mp3file) return;
                this.loading = true;
                this.clearErrors();
                _audio.playSource(channel.mp3file);
                _audio.setVolume(this.volume);
            },

            // select a channel to play
            selectChannel(channel) {
                if (!channel || !channel.id) return;
                if (this.isCurrentChannel(channel)) return;
                this.closeAudio();
                this.toggleSidebar(false);
                this.playChannel(channel);
                this.getSongs(channel);
                this.channel = channel;
            },

            // set station route
            setRoute(route) {
                route = '/' + String(route || '').replace(/^[\#\/]+|[\/]+$/g, '').trim();
                window.location.hash = route;
            },

            // parse url hash route actions
            applyRoute(route) {
                const data = String(route || '').replace(/^[\#\/]+|[\/]+$/g, '').trim().split('/');
                const action = data.length ? data.shift() : '';
                const param = data.length ? data.shift() : '';

                if (!action) {
                    this.closeAudio();
                    this.resetPlayer();
                    return;
                }
                if (action === 'channel' && param) {
                    const channel = this.channels.filter(c => (c.shortcode === param)).shift();
                    this.selectChannel(channel);
                    return;
                }
            },

            // on keyboard events
            onKeyboard(e) {
                const k = e.key || '';
                if (k === ' ' && this.channel.id) return this.togglePlay();
                if (k === 'Enter') return this.toggleSidebar(true);
                if (k === 'Escape') return this.toggleSidebar(false);
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

        // on app mounted
        mounted() {
            console.log("mounted");
            this.loadSortOptions();
            this.loadFavorites();
            this.getChannels(false);
            this.setupAudio();
            //if(typeof AudioContext != "undefined" || typeof AudioContext != "undefined")
            //document.addEventListener("mouseover", this.setupAudio);

            //this.setupCanvas();
            //this.updateCanvas();
            this.setupMaintenance();
            this.initPlayer();
        },

        // on app destroyed
        destroyed() {
            this.closeAudio();
            this.clearTimers();
        }

    }
</script>
