import Vue from 'vue';
import Vuex from 'vuex';

import actions from './actions.js';
import mutations from './loginStore';
import loading from './mutation';

Vue.use(Vuex);
export default new Vuex.Store({
    modules:{
        mutations,
        loading
    },
    actions
});