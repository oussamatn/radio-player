import nowplayingService from '@/services/nowplayingService';
//import { FETCH_FAVORITES, FETCH_TAGS } from './actionTypes';
//import { SET_FAVORITES, SET_TAGS } from './mutationTypes';

export const state = {
    stations: [],
    trackList: [],
    currentSong:[],
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
        commit("setSongs",Songs.data);
    },


};
export const getters = {
    courrentSong : (state) => (stationid) =>  {
        return currentState.slice().filter(station => (station.id === stationid));
    },



};
/* eslint no-param-reassign: ["error", { "props": false }] */
export const mutations = {
    setNowplaying : (currentState, nowplaying) => {
        console.log("%c setNowplaying :", 'background: blue; color: white',nowplaying);
        console.timeEnd("fetchNowplaying")
    },
    setStations : (currentState, Stations) => {
        console.log("%c setStations :", 'background: blue; color: white',Stations);
        console.timeEnd("fetchStations")
        currentState.stations = Stations;
    },
    setSongs: (currentState, Songs) =>{
        console.log("%c setSongs :", 'background: blue; color: white',Songs);
        console.timeEnd("fetchSongs")
    },

};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};