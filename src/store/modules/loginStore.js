import Util from './../../libs/util';

const LOGINSTATUS = 'LOGINSTATUS';
const CHANGELOGININFO = 'CHANGELOGININFO';

const state = {
    loginStatus: false,
    loginInfo: {
        authToken: '',
        username: '',
        loginId: ''
    }
};
const mutations = {
    [LOGINSTATUS](state, status) {
        state.loginStatus = status;
    },
    [CHANGELOGININFO](state, data) {
        state.loginInfo = data;
    }
};

const getters = {
    loginInfo: state => state.loginInfo,
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
