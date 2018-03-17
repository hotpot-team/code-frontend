import axios from 'axios';
import env from '../config/env';

let util = {

};
let rescenterDev = 'http://cmpdev.changan.com';
let rescenterPro = 'http://cmpdev.changan.com';
let rescenterTest = 'http://cmpdev.changan.com';
util.title = function(title) {
    title = title ? title + ' - Home' : 'iView project';
    window.document.title = title;
};
//10.17.12.117:8080
const ajaxUrl = env === 'development' ?
    'http://127.0.0.1:8080' :
    env === 'production' ?
    'http://10.64.13.39:8903' :
    'http://10.64.13.39:8903';
const resUrl = env === 'development' ? rescenterDev : env === 'production' ? rescenterPro : rescenterTest;
util.ajax = axios.create({
    baseURL: ajaxUrl,
    timeout: 30000
});
util.resAjax = axios.create({
    baseURL: resUrl,
    timeout: 3000000
});
util.ajaxUrl = ajaxUrl;

export default util;
