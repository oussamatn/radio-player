<template>

    <div id="app" class="app-wrap" >
        <!-- app player container -->
        <main id="player-wrap" class="player-wrap" style="opacity: 0;" >
            <!-- bg absolute elements -->
            <figure id="player-bg" class="player-bg" v-bind:style="{ 'background-image' : `url(  ${ getBackground} )` }"></figure>
            <audioVisualizations ></audioVisualizations>
            <!-- main player layout -->
            <section class="player-layout" v-if="init">
                <!-- player top header -->
                <header class="player-header flex-row flex-middle flex-stretch">
                    <h2 class="text-clip flex-1"><i class="fa fa-headphones"></i>
                      <router-link to="/" custom v-slot="{ navigate }" >
                        <span @click="navigate" @keypress.enter="navigate" role="link"> {{ config.title }}</span>
                      </router-link>
                    </h2>
                    <button class="text-nowrap common-btn" id="sidebar" @click="toggleSidebar( true )"><i
                            class="fa fa-bars" aria-label="sidebar"></i></button>
                </header>
                <router-view ></router-view>
            </section> <!-- layout wrapper -->
            <!-- player stations overlay + sidebar -->
            <section class="player-stations"
                     :class="{ 'visible': sidebar }"
                     @click="toggleSidebar( false )"
                     v-if="channels"
            >
                <aside class="player-stations-sidebar" @click.stop>
                    <!-- sidebar search -->
                    <header class="player-stations-header flex-row flex-middle flex-stretch">
                        <div class="form-input push-right">
                            <i class="fa fa-search"></i>
                            <input type="text"
                                   :placeholder="$t('search_a_station')"
                                   v-model="searchText"
                                   v-on:input="debounceFilter"
                                   aria-label="search"/>
                        </div>
                        <button class="common-btn" @click="toggleSidebar( false )"><i
                                class="fa fa-times-circle" aria-label="Closesidebar"></i>
                        </button>
                    </header>

                    <!-- sidebar stations list -->
                    <ul class="player-stations-list">
                        <router-link tag="li" class="player-stations-list-item flex-row flex-top flex-stretch"
                                     v-for="c of filteredStations"
                                     :key="c.station.id"
                                     :to="{ name: 'station',
                                            params: {
                                                    id: c.station.id,
                                                    shortcode : c.station.shortcode
                                     }}"

                        >
                            <!--<figure id="player-bg" class="player-bg"
                                    v-bind:style="{ 'background-image' : `url(  ${ c.now_playing.song.art } )` }">
                            </figure>-->
                            <figure class="push-right ">
                                <img class="img-round" width="70" height="70"
                                     :src="c.now_playing.song.art"
                                     :alt="c.station.name"
                                     @error="c.station.image='/img/icon.png'"/>

                            </figure>
                            <aside class="flex-1">
                                <div class="flex-row flex-middle flex-space">
                                    <div class="player-stations-list-title text-bright text-clip">{{ c.station.name }}</div>
                                    <div class="text-nowrap">
                                        <favBtn :id="c.station.id"></favBtn>
                                    </div>
                                </div>
                                <div class="text-small nowplaying" >
                                    <div v-if="c.live.islive" id="live">LIVE:  </div>
                                   <span class="text-condense" id="title">
                                        {{ c.now_playing.song.title  | toText}}
                                    </span>
                                    <span class="text-uppercase text-small" id="artist">
                                        {{ c.now_playing.song.artist  | toText}}
                                    </span>


                                </div>
                            </aside>
                        </router-link>
                    </ul>
                </aside>
            </section>

        </main> <!-- player -->
    </div>
</template>

<script>
    import './scss/app.scss';
    import './js/filters';

    import favBtn from "@/views/components/favBtn";
    import audioVisualizations from "@/views/station/components/audioVisualizations";
    import { mapGetters, mapState  } from 'vuex';
    import { debounce } from "debounce";


    export default {
        name: 'home',
        components: {
            favBtn,audioVisualizations
        },
        data: () => {
            return {
                // toggles
                init: false,
                visible: false,
                loading: true,
                sidebar: false,
                filteredStations: [],
                searchText: '',
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


            },
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
            debounceFilter: debounce(function (e) {
                this.filterStations()
            }, 500),

            filterStations() {
                let search = this.searchText;
                let list = this.channels.slice();

                if (search && search.length > 1) {
                    console.log("filteredStations: if ",this.search)
                    search = search.replace(/[^\w\s\-]+/g, '').replace(/[\r\s\t\n]+/g, ' ').trim();
                    this.filteredStations =  list.filter(item => item.station.name.toLowerCase().includes(search.toLowerCase()))
                }else this.filteredStations = this.channels;
                console.log("filteredStations",this.filteredStations)
                console.log("filteredStations : searchText",this.searchText)

            },
        },
        computed: {
            ...mapState('nowplaying',{
                channels : 'nowplaying',
            }),
            ...mapGetters('nowplaying',[
                'getBackground',
            ]),
            config(){
              return this.$store.getters["playerConfig/getConfig"];
            },

        },
        // on app mounted
        mounted() {
            console.log("App : mounted");
            this.$store.dispatch('playerConfig/fetchConfig').then(()=>{
              document.title = this.config.title
            });
            this.$store.dispatch('nowplaying/fetchNowplaying').then(()=>{
                this.initView();
            })

        },
        watch: {
            $route() {
                this.toggleSidebar();
            },
            channels(stations){
               // console.log("watch : channels" , this.filteredStations);
                if (Object.keys(this.filteredStations).length === 0 ) this.filteredStations = stations;
            },
        },
        // on app destroyed
        destroyed() {

        }
    }

</script>