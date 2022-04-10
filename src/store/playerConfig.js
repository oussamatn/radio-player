import ConfigService from "@/services/configService";

export const state = {
    playerConfig: []
};
export const actions = {
    async fetchConfig({ commit }) {
        console.time("setConfig")
        console.log("%c fetchConfig" , 'background: black; color: white')
        let config = await ConfigService.getConfig();
        return new Promise((resolve, reject) => {
            try{
                commit("setConfig",config);
                resolve();
            }catch (e) {
                reject();
            }
        });

    },
};
export const getters = {
    getConfig : (state) => {
        return state.playerConfig;
    },

};
export const mutations = {
    setConfig : (currentState, config) => {
        console.log("%c setConfig :", 'background: green; color: white',config);
        console.timeEnd("setConfig")
        currentState.playerConfig = config;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};