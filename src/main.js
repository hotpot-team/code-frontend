import Vue from 'vue';
import iView from 'iview';
import VueRouter from 'vue-router';
import VueAxios from 'vue-axios';
import axios from 'axios';
import Routers from './router';

import Util from './libs/util';
import App from './app.vue';
import 'iview/dist/styles/iview.css';
import stores from './store/store.js';

import VueTable from './template/vueTable.vue';

import TextEdit from './template/textEdit.vue';

Vue.use(VueRouter);
Vue.use(iView);
Vue.use(VueAxios, axios);

Vue.component('vue-table', VueTable);
Vue.component('text-edit', TextEdit);

// 路由配置
const RouterConfig = {
    routes: Routers
};
const router = new VueRouter(RouterConfig);
global.host = Util.ajaxUrl;

router.beforeEach((to, from, next) => {
    iView.LoadingBar.start();
    Util.title(to.meta.title);
    next();
});

router.afterEach(() => {
    iView.LoadingBar.finish();
    window.scrollTo(0, 0);
});
this.$http = axios;
//请求前
axios.interceptors.request.use(function(config){
    config.url = Util.ajaxUrl + config.url;
    if (config.showLoading) {
        stores.dispatch('showloader');
    }
    return config;
},function(err){
    stores.dispatch('hideloader');
    return Promise.reject(err);
});
//请求后
axios.interceptors.response.use(function(response){
    stores.dispatch('hideloader');
    //提示请求成功
    return response;
},function(err){
    stores.dispatch('hideloader');
    return Promise.reject(err);
});

new Vue({
    el: '#app',
    router: router,
    store:stores,
    render: h => h(App)
});

Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
