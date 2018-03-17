import iView from 'iview';
import stores from './store';
import Util from './libs/util';

let loginInit = {};

loginInit.login = function(router){
    router.onReady(()=>{
        if(window.localStorage.loginInfo && JSON.parse(window.localStorage.loginInfo)){
            stores.commit('CHANGELOGININFO',JSON.parse(window.localStorage.loginInfo));
        }
        if(stores.state.mutations.loginInfo.authToken ===''){
            router.push({path: '/'});
        }
    });
    //请求前
    Util.ajax.interceptors.request.use(function(config){
        if (stores.state.mutations.loginInfo.authToken !='') {
            config.headers.AUTH_TOKEN = `${stores.state.mutations.loginInfo.authToken}`;
            config.headers.CURRENT_USER = `${stores.state.mutations.loginInfo.loginId}`;
        }
        if (config.showLoading) {
            stores.commit('SHOWLOADING');
            config.timeout = 20000;
        }
        return config;
    },function(err){
        stores.dispatch('hideloader');
        return Promise.reject(err);
    });

    //请求后
    Util.ajax.interceptors.response.use(function(response){
        //提示请求成功
        stores.commit('HIDELOADING');
        return response;

    },function(err){
        if(err.response && err.response.status == 401){
            stores.commit('CHANGELOGININFO',{authToken:'',username:'',loginId:''});
            window.localStorage.removeItem('loginInfo');
            router.replace({
                path: '/',
                query: {redirect: router.currentRoute.fullPath}
            });
        }
        if (stores.getters.showLoading) {
            stores.dispatch('hideloader');
        }
        return Promise.reject(err);
    });
}

export default loginInit;

