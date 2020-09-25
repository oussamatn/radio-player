import nowplayingService from '@/services/nowplayingService';
//import { FETCH_FAVORITES, FETCH_TAGS } from './actionTypes';
//import { SET_FAVORITES, SET_TAGS } from './mutationTypes';

export const state = {
    stationId:0,
    stations: [],
    songs: [],
    trackList: [],
    nowplaying: [],
    currentSong:[],
    currentStation:[]
    //searchText: ''
};

export const actions = {
    StationId({commit},stationId){
        commit("setStationId",stationId);
        commit("setNowplayingStation", stationId);

    },
    async fetchNowplaying({ commit },stationId) {
        console.time("fetchNowplaying")
        console.log("%c fetchNowplaying" , 'background: blue; color: white')
        let nowplaying = await nowplayingService.get();
        return new Promise((resolve, reject) => {
            try{
                commit("setNowplaying",nowplaying);
                if(!isNaN(stationId)) commit("setNowplayingStation", stationId);
                resolve();
            }catch (e) {
                reject();
            }

        });

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
        return new Promise((resolve, reject) => {
            commit("setSongs",Songs);resolve();
        });

    },
    resetSongs({commit }){
        commit("resetSongs");
    }


};
export const getters = {
    /*courrentSong : (state) => {
        return state.currentSong;
    },
    CurrentSong : (state) =>  {
        let stationid = state.stationId
        console.log("getters : CurrentSong",stationid)
        return state.nowplaying.find( (d) => (stationid) => (d.station.id === stationid)).now_playing.song;
    },*/
    SongsByStation : (state) => {
        let stationid = state.stationId
        console.log("getters : SongsByStation",stationid)
        return state.nowplaying.find( (d) => (stationid) => (d.station.id === stationid)).songs ;
    },
    getIDfromShortcode : (state) => (shortcode) =>{
        console.log("getIDfromShortcode",shortcode )
        let found = state.nowplaying.find( (d) => (d.station.shortcode === shortcode));
        console.log("getIDfromShortcode: found",found,"shortcode",shortcode )
        return found.station.id ;
    },
    hasSongs : (state) => {
        return (!!Object.keys(state.songs).length);
    },
    getBackground : (state) =>{
        console.log(state.currentSong);
        if(state.currentSong.song)
            return state.currentSong.song.art
        else return "/img/icon.png" ;
    },
    getStations : (state) => {
        let stations = [];
        for(let s in state.nowplaying ){
            stations.push(state.nowplaying[s].station);
        }
        return stations;
        },

};

export const mutations = {
    setStationId : (currentState, stationId) => {
        currentState.stationId = stationId;
    },
    setNowplaying : (currentState, nowplaying) => {
        let stationId = currentState.stationId;
        console.log("%c stationId :", 'background: green; color: white',stationId);
        console.log("%c setNowplaying :", 'background: green; color: white',nowplaying);
        console.timeEnd("fetchNowplaying")
        currentState.nowplaying = nowplaying;
        currentState.stations = nowplaying.map( (s) => { return s.station });
    },
    setNowplayingStation : (currentState,stationId) => {

        let nowplaying = currentState.nowplaying;



        if( !isNaN(stationId)){
            let currentStation = nowplaying.find( (d) => d.station.id === stationId);
            console.log("%c setNowplayingStation : currentStation", 'background: green; color: white',currentStation);
            currentState.currentStation = currentStation.station;
            currentState.currentSong = currentStation.now_playing;
            currentState.songs = currentStation.song_history;
        }

    },
    setStations : (currentState, Stations) => {
        console.log("%c setStations :", 'background: green; color: white',Stations);
        console.timeEnd("fetchStations")
        currentState.stations = Stations;
    },
    setSongs: (currentState, Songs) =>{
        console.log("%c setSongs :", 'background: green; color: white',Songs);
        console.timeEnd("fetchSongs")
        currentState.currentSong = Songs.now_playing;
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