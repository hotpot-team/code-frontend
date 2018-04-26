import Vue from 'vue';
import iView from 'iview';
import VueRouter from 'vue-router';
import Routers from './router';

import Util from './libs/util';
import App from './app.vue';
import 'iview/dist/styles/iview.css';
import stores from './store';

import { Tree } from 'element-ui';

import VueTable from './template/vueTable.vue';
import TextEdit from './template/textEdit.vue';
// import loginInit from './login';
import Base64 from './base64';

Vue.use(VueRouter);
Vue.use(iView);
Vue.use(Tree);

Vue.prototype.base64 = new Base64();
Util.ajax.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    if (config.showLoading) {
        config.timeout = 20000;
        stores.commit('SHOWLOADING');
    }
    return config;
}, function (error) {
    // 对请求错误做些什么
    if (stores.getters.showLoading) {
        stores.commit('HIDELOADING');
    }
    return Promise.reject(error);
});
// 添加响应拦截器
Util.ajax.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    if (stores.getters.showLoading) {
        stores.commit('HIDELOADING');
    }
    return response;
}, function (error) {
    // 对响应错误做点什么
    if (stores.getters.showLoading) {
        stores.commit('HIDELOADING');
    }
    return Promise.reject(error);
});
Vue.prototype.$http = Util.ajax;

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

// loginInit.login(router);

//请求前
// Util.ajax.interceptors.request.use(function(config){
//     config.url = Util.ajaxUrl + config.url;
//     if (config.showLoading) {
//         config.timeout = 20000;
//         stores.commit('SHOWLOADING');
//     }
//     return config;
// },function(err){
//     stores.commit('HIDELOADING');
//     return Promise.reject(err);
// });
// //请求后
// Util.ajax.interceptors.response.use(function(response){
//     if (stores.getters.showLoading) {
//         stores.commit('HIDELOADING');
//     }
//     //提示请求成功
//     return response;
// },function(err){
//     if (stores.getters.showLoading) {
//         stores.commit('HIDELOADING');
//         iView.Message.error('请求失败!');
//     }
//     return Promise.reject(err);
// });

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
