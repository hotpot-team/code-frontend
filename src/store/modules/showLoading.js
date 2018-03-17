import { SHOWLOADING,HIDELOADING } from '../type.js';

const state = {
    showLoading:false
};

const mutations = {
    [SHOWLOADING](state){
        state.showLoading = true;
    },
    [HIDELOADING](state){
        state.showLoading = false;
    }
};
const getters = {
    showLoading(state){
        return state.showLoading
    }
};
const actions = {
  
};
export default {
    state,
    getters,
    actions,
    mutations
};
