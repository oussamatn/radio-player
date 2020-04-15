import FavoritesService from '@/services/favoritesService';
//import { FETCH_FAVORITES, FETCH_TAGS } from './actionTypes';
//import { SET_FAVORITES, SET_TAGS } from './mutationTypes';

export const state = {
  favoritesList: [],
};

export const actions = {
  fetchFavorites({ commit }) {
         commit("setFavorites", FavoritesService.get());
  },
  toggleFavorite : ({ state, commit },stationId) => {

       //if(state.favoritesList === undefined )
       //     return commit("addFavorites", stationId);

      let favs = state.favoritesList.slice().filter(fid => (fid === stationId));
      if (!favs.length)
            commit("addFavorites", stationId);
      else
            commit("delFavorites", stationId);
  }
};
export const getters = {
  isFavorites : (state) => (stationId) => {
         return (state.favoritesList.indexOf(stationId) >= 0);
  },
};
/* eslint no-param-reassign: ["error", { "props": false }] */
export const mutations = {

  setFavorites : (currentState, favorites) =>{

        if(favorites === undefined)
               currentState.favoritesList = new Array();
        else
               currentState.favoritesList = favorites;

        FavoritesService.set(currentState.favoritesList);
  },
  addFavorites : (currentState,stationId) => {
       currentState.favoritesList.push(stationId);
      FavoritesService.set(currentState.favoritesList);
  },
  delFavorites : (currentState,stationId) => {
        currentState.favoritesList = currentState.favoritesList.filter(fid => (fid !== stationId));
        FavoritesService.set(currentState.favoritesList);
    },

};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};