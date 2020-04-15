import nowplayingService from '@/services/nowplayingService';
//import { FETCH_FAVORITES, FETCH_TAGS } from './actionTypes';
//import { SET_FAVORITES, SET_TAGS } from './mutationTypes';

export const state = {
    stations: [],
    songs: [],
    trackList: [],
    nowplaying: [],
    currentSong:[],
    //searchText: ''
};

export const actions = {
    async fetchNowplaying({ commit }) {
        console.time("fetchNowplaying")
        console.log("%c fetchNowplaying" , 'background: blue; color: white')
        let nowplaying = await nowplayingService.get();
            commit("setNowplaying",nowplaying.data);
    },
    async fetchStations ({commit })  {
        console.time("fetchStations")
        console.log("%c fetchStations" , 'background: blue; color: white')
        let Songs = await nowplayingService.getChannels();
        commit("setStations",Songs);
    },
    async fetchSongs ({commit },stationId)  {
        console.time("fetchSongs")
        console.log("%c fetchSongs" , 'background: blue; color: white')
        let Songs = await nowplayingService.getSongs(stationId);
        commit("setSongs",Songs);
    },
    resetSongs({commit }){
        commit("resetSongs");
    }


};
export const getters = {
    courrentSong : (state) => {
        return state.currentSong;
    },
    dataByStation : (state) => (stationid) =>  {
        console.log("getters : dataByStation",stationid)
        return state.nowplaying.find( (d) => (stationid) => (d.station.id === stationid)).now_playing.song ;
    },
    hasSongs : (state) => {
        return (!!Object.keys(state.songs).length);
    },
    getBackground : (state) =>{
        return state.currentSong.art || "/img/icon.png" ;
    },
    getStations : (state) => {
        let stations = [];
        for(let s in state.nowplaying ){
            stations.push(state.nowplaying[s].station);
        }
        return stations;
        },
    /*filteredStations : (state) =>  {
        let search = state.search;
        //const regxp = new RegExp( '^('+ state.search +')', 'i' );

        if (search && search.length > 1) {
            console.log("filteredStations: if ",state.search)
            search = search.replace(/[^\w\s\-]+/g, '').replace(/[\r\s\t\n]+/g, ' ').trim();
            return state.nowplaying.filter(item => item.station.name.toLowerCase().includes(search.toLowerCase()))
        }
        console.log("filteredStations",state.search)
        return  state.nowplaying;
    }*/


};
/* eslint no-param-reassign: ["error", { "props": false }] */
export const mutations = {
    setNowplaying : (currentState, nowplaying) => {
        console.log("%c setNowplaying :", 'background: green; color: white',nowplaying);
        console.timeEnd("fetchNowplaying")
        currentState.nowplaying = nowplaying;
        currentState.stations = nowplaying.map( (s) => { return s.station });

        },
    setNowplayingStations : (currentState, Stations) => {
        console.log("%c setNowplayingStations :", 'background: green; color: white',Stations);

        currentState.stations = Stations;
    },
    setStations : (currentState, Stations) => {
        console.log("%c setStations :", 'background: green; color: white',Stations);
        console.timeEnd("fetchStations")
        currentState.stations = Stations;
    },
    setSongs: (currentState, Songs) =>{
        console.log("%c setSongs :", 'background: green; color: white',Songs);
        console.timeEnd("fetchSongs")
        currentState.currentSong = Songs.now_playing.song;
        console.log("%c setSongs : Songs.now_playing.song", 'background: blue; color: white',Songs.now_playing.song);

        currentState.songs = Songs;
    },
    resetSongs: (currentState)=>{
        currentState.songs = []
        currentState.currentSong=[]
    }

};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};