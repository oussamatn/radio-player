<template>
    <!-- TODO import header + sidebar component -->
    <div id="app" class="app-wrap" >
        <!-- app player container -->
        <main id="player-wrap" class="player-wrap" style="opacity: 0;" >
            <!-- bg absolute elements -->
            <figure id="player-bg" class="player-bg" v-bind:style="{ 'background-image': 'url(' + background + ')' }"></figure>
            <!-- main player layout -->
            <section class="player-layout" v-if="init">
                <!-- player top header -->
                <header class="player-header flex-row flex-middle flex-stretch">
                    <h2 class="text-clip flex-1"><i class="fa fa-headphones"></i> <router-link to="/" exact
                                                                                               tag="span">FM Player</router-link></h2>
                    <button class="text-nowrap common-btn" id="sidebar" @click="toggleSidebar( true )"><i
                            class="fa fa-bars" aria-label="sidebar"></i></button>
                </header>
                <router-view ></router-view>
            </section> <!-- layout wrapper -->
            <!-- player stations overlay + sidebar -->
            <section class="player-stations" :class="{ 'visible': sidebar }" @click="toggleSidebar( false )">
                <aside class="player-stations-sidebar" @click.stop>

                    <!-- sidebar search -->
                    <header class="player-stations-header flex-row flex-middle flex-stretch">
                        <div class="form-input push-right">
                            <i class="fa fa-search"></i>
                            <input type="text" placeholder="Search station..." v-model="searchText" aria-label="search"/>
                        </div>
                        <button class="common-btn" @click="toggleSidebar( false )"><i
                                class="fa fa-times-circle" aria-label="Closesidebar"></i>
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
                                        <favBtn :id="c.id" ></favBtn>
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
                nowPlaying:{},
                channels: [],
                channel: {},
                background : "/img/icon.png",
                errors: {},
            }
        },
        methods: {
            initView() {
                console.log("init View");
                this.init = true;
                document.querySelector('#_spnr').style.display = 'none';
                document.querySelector('#player-wrap').style.opacity = '1';
                document.addEventListener('visibilitychange', e => {
                    this.visible = (document.visibilityState === 'visible')
                });
                this.background  = "/img/icon.png";

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

            getChannels(sidebar) {
                _joujma.getChannels((err, channels) => {
                    if (err) return this.setError('channels', err);
                    if (sidebar) this.toggleSidebar(true);
                    this.channels = channels;
                    this.setError('channels', '');

                    //this.applyRoute(window.location.hash);
                });
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
            //this.closeAudio();
            //this.clearTimers();
        }
    }

</script>
