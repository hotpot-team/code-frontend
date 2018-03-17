import Vue from 'vue';
import Vuex from 'vuex';
import mutations from './modules/loginStore';
import showLoading from './modules/showLoading';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        mutations,
        showLoading
    }
});
