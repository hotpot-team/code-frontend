import Util from './../libs/util';
import { SHOWLOADING,HIDELOADING } from './type.js';
const LOGINSTATUS = 'LOGINSTATUS';
const CHANGELOGININFO = 'CHANGELOGININFO';

const state = {
    loginStatus: false,
    showLoading:false,
    loginInfo: {
        authToken: '',
        username: '',
        loginId: ''
    }
};

const mutations = {
    [SHOWLOADING](state){
        state.showLoading = true;
    },
    [HIDELOADING](state){
        state.showLoading = false;
    },
    [LOGINSTATUS](state, status) {
        state.loginStatus = status;
    },
    [CHANGELOGININFO](state, data) {
        state.loginInfo = data;
    }
};
const getters = {
    loginInfo: state => state.loginInfo,
    showLoading(state){
        return state.showLoading
    }
};
const actions = {
    goLogin({ commit }, data) {
        Util.ajax.post('/login', data).then((response) => {
            commit(LOGINSTATUS, true);
            const info = {};
            info.authToken = response.headers.auth_token;
            info.username = response.data.username;
            window.localStorage.loginInfo = JSON.stringify(info);
            commit(CHANGELOGININFO, info);
        }).catch(function() {});
    }
};
export default {
    state,
    getters,
    actions,
    mutations
};
