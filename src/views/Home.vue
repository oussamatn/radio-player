<template>


        <!-- player middle content area -->
        <main class="player-content flex-row">
            <section class="player-greet" id="home">
                <div class="fx fx-slide-left push-bottom"><h1>Pick a Station</h1></div>
                <div id=installer>
                    <button class=button>Install</button>
                </div>
                <!-- <ul>
                     <li class="player-stations-list-item flex-row flex-top flex-stretch"
                         v-for="c of channelsList"
                         :key="c.id" @click="redirectToStation( c.id )" :class="{ 'active': c.active }">
                         <figure class="push-right ">
                             <img class="img-round" width="70" height="70" :src="c.image" :alt="c.name"/>
                         </figure>
                         <aside class="flex-1">
                             <div class="flex-row flex-middle flex-space">
                                 <div class="player-stations-list-title text-bright text-clip">{{ c.name }}</div>
                                 <div class="text-nowrap">
                                     <favBtn :id="c.id" :active="c.favorite" @change="toggleFavorite"></favBtn>
                                 </div>
                             </div>
                             <div class="text-small">
                                 <span class="text-faded text-uppercase text-small">{{ c.description | toText}}</span> <br />
                             </div>
                         </aside>
                     </li>
                 </ul>
                 -->
                <div class="fx fx-slide-left fx-delay-1 push-bottom">
                    <div id="firebaseui-auth-container"></div>
                </div>
                <div class="fx fx-slide-up fx-delay-2 pad-top">
                    <button class="cta-btn" @click="toggleSidebar( true )"><i
                            class="fa fa-headphones">&nbsp;</i>
                        View Stations
                    </button>
                </div>

            </section>
        </main>



</template>

<script>
    /**
     * Main app JS entry file.
     */




    export default {
        name: 'home',

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

          },

        // computed methods
        computed: {

        },

        // custom methods
        methods: {
            toggleSidebar(){
                this.$parent.toggleSidebar(true);
            },
        },

        // on app mounted
        mounted() {
            console.log("mounted Home.vue");

        },

        // on app destroyed
        destroyed() {
        }

    }
</script>
