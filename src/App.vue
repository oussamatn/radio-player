<template>
    <!--<div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>-->
    <!-- TODO import header + sidebar component -->
    <div id="app" class="app-wrap">
        <div id="_spnr">
            <svg width="100" height="100" xmlns="https://www.w3.org/2000/svg" viewBox="0 0 100 100"
                 preserveAspectRatio="xMidYMid" class="lds-ring">
                <circle cx="50" cy="50" fill="none" r="40" stroke="#8086a0" stroke-width="10"></circle>
                <circle cx="50" cy="50" fill="none" r="40" stroke="#1e1f30" stroke-width="6" stroke-linecap="round"
                        stroke-dasharray="150 100"></circle>
            </svg>
        </div>

        <!-- app player container -->
        <main id="player-wrap" class="player-wrap">
            <!-- bg absolute elements -->
            <figure id="player-bg" class="player-bg" v-bind:style="{ 'background-image': 'url(' + background + ')' }"></figure>
            <!-- main player layout -->
            <section class="player-layout">
                <!-- player top header -->
                <header class="player-header flex-row flex-middle flex-stretch">
                    <h2 class="text-clip flex-1"><i class="fa fa-headphones"></i> <router-link to="/" exact
                                                                                               tag="span">FM Player</router-link></h2>
                    <button class="text-nowrap common-btn" id="sidebar" @click="toggleSidebar( true )"><i
                            class="fa fa-bars"></i></button>
                </header>
                <router-view></router-view>
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
                        <router-link tag="li" class="player-stations-list-item flex-row flex-top flex-stretch"
                                     v-for="c of channelsList"
                                     :key="c.id" :to="{ name: 'station', params: { id: c.shortcode }}"
                                     :class="{ 'active': c.active }">
                            <figure class="push-right ">
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
                                    <span class="text-faded text-uppercase text-small">{{ c.description | toText}}</span>
                                    <br/>
                                </div>
                            </aside>
                        </router-link>
                    </ul>

                </aside>
            </section>

            <!--<canvas id="player-canvas" class="player-canvas" ></canvas>-->
        </main> <!-- player -->
    </div>
</template>

<script>
    import './scss/app.scss';
    import './js/filters';
    import "./js/init-firebase";
    import _joujma from './js/api';
    import favBtn from "@/views/favBtn";
    import _utils from './js/utils';
    import _store from './js/store';


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
                searchText: '',
                channels: [],
                channel: {},
                background : "/img/icon.png",
                favorites: [],
                errors: {},
            }
        },
        methods: {
            initView() {
                console.log("init View");
                document.querySelector('#_spnr').style.display = 'none';
                document.querySelector('#player-wrap').style.opacity = '1';
                document.addEventListener('visibilitychange', e => {
                    this.visible = (document.visibilityState === 'visible')
                });
                this.background  = "/img/icon.png";
                this.init = true;
            },
            // set an erro message
            setError(key, err) {
                let errors = Object.assign({}, this.errors);
                errors[key] = String(err || '').trim();
                if (err) console.warn('ERROR(' + key + '):', err);
                this.errors = errors;
            },
            toggleSidebar(toggle) {
                this.sidebar = (typeof toggle === 'boolean') ? toggle : false;
            },
            onKeyboard(e) {
                const k = e.key || '';
                if (k === 'Enter') return this.toggleSidebar(true);
                if (k === 'Escape') return this.toggleSidebar(false);
            },
            updateCurrentChannel() {
                for (let c of this.channels) {
                    // see if channel has been saved as a favorite
                    c.favorite = (this.favorites.indexOf(c.id) >= 0);
                    // see if channel is currently selected
                    /*
                    if (this.isCurrentChannel(c)) {
                        this.channel = Object.assign(this.channel, c);
                        c.active = true;
                    }
                     */
                }
            },
            getChannels(sidebar) {
                _joujma.getChannels((err, channels) => {
                    if (err) return this.setError('channels', err);
                    if (sidebar) this.toggleSidebar(true);
                    this.channels = channels;
                    this.setError('channels', '');
                    this.updateCurrentChannel();
                    //this.applyRoute(window.location.hash);
                });
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
                elm.setAttribute('download', 'Joujma_favorites.m3u');
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
        },
        computed: {
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
                        i.active = (this.channel.id === i.id);
                        return i;
                    });
                }
                return list;
            },
        },

        // on app mounted
        mounted() {
            console.log("App : mounted");
            this.loadFavorites();
            this.getChannels(false);
            this.initView();
        },
        watch: {
            $route() {
                this.toggleSidebar();
            }
        },
        // on app destroyed
        destroyed() {
            this.closeAudio();
            this.clearTimers();
        }
    }

</script>
