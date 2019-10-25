<template>


    <!-- player middle content area -->
    <main class="player-content flex-row">
        <section class="player-greet" id="home">
            <div class="fx fx-slide-left push-bottom"><h1>Pick a Station</h1></div>
            <div id=installer>
                <button class=button>Install</button>
            </div>
            <div class="fx fx-slide-left fx-delay-1 push-bottom">
                <div id="firebaseui-auth-container"></div>
            </div>
            <div class="fx fx-slide-up fx-delay-2 pad-top">
                <button class="cta-btn" @click="toggleSidebar( true )"><i
                        class="fa fa-headphones" aria-label="OpenSidebar">&nbsp;</i>
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
        watch: {},

        // computed methods
        computed: {},

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
