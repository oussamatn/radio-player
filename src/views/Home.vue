<template>

    <!-- player middle content area -->
    <main class="player-content flex-autorow stationView">
        <div class="player-greet flex-1" id="home">
                <div class="fx fx-slide-left push-bottom"><h1 v-html="$t('pick_a_station')">Pick a Station</h1></div>

                <div class="fx fx-slide-up fx-delay-2 pad-top">
                    <button class="cta-btn" @click="toggleSidebar( true )"><i
                            class="fa fa-headphones" aria-label="OpenSidebar">&nbsp;</i>
                         {{$t('view_stations')}}
                    </button>
                </div>
        </div>
        <ul class="flex-grid home-station-list">
            <router-link tag="li" class="card fx flex-grid-sm flex-1" id="station"
                         v-for="(c,i) of channels"
                         :class="'fx-slide-left fx-delay-' + ( i + 2 )"
                         :key="c.station.id"
                         :to="{ name: 'station',params: { id: c.station.id, shortcode : c.station.shortcode }}" >

<!--                <figure id="player-bg" class="player-bg"-->
<!--                        v-bind:style="{ 'background-image' : `url(  ${ c.now_playing.song.art } )` }">-->
<!--                </figure>-->
              <div class="flex-row flex-middle flex-space">
                <div class="player-stations-list-title text-bright text-clip">{{ c.station.name }}</div>
                <div class="text-nowrap">
                  <favBtn :id="c.station.id"></favBtn>
                </div>
              </div>
                <figure class="station-play">
                    <div id="station-logo">
                        <img width="100" height="100"
                             :src="c.station.image"
                             :alt="c.station.name"
                             @error="c.station.image='/img/icon.png'"
                        />
                    </div>
                    <div class="station-hover">
                        <i class="far fa-play-circle fx fx-drop-in"></i>
                    </div>

                </figure>

                <aside class="flex-1">

                    <div class="text-small nowplaying" >
                        <div v-if="c.live.islive" id="live">LIVE </div>
                        <div class="text-uppercase text-small" id="title">
                              {{ c.now_playing.song.title  | str_limit(30)}}
                        </div>
                      <div class="text-condense" id="artist">
                           {{ c.now_playing.song.artist  | toText }}
                      </div>
                    </div>
                </aside>
            </router-link>
        </ul>
    </main>


</template>

<script>
    /**
     * Home
     */
    import { mapGetters, mapState  } from 'vuex';
    import favBtn from "@/views/components/favBtn";
    export default {
        name: 'home',
        components: {
            favBtn
        },
        data: () => {
            return {
                // toggles
                visible: false,
                sidebar: false,
                errors: {},

            }
        },

        // watch methods
        watch: {},

        // computed methods
        computed: {
            ...mapState('nowplaying',{
                channels : 'nowplaying',
            }),
            ...mapGetters('nowplaying',[
            ]),
          config(){
            return this.$store.getters["playerConfig/getConfig"];
          },
        },

        // custom methods
        methods: {
            toggleSidebar() {
                this.$parent.toggleSidebar(true);
            },
        },

        // on app mounted
        mounted() {
            console.log("mounted Home.vue");
            this.$parent.init = true;
        },

        // on app destroyed
        destroyed() {
        }

    }
</script>
