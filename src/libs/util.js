import axios from 'axios';
import env from '../config/env';

let util = {

};
util.title = function(title) {
    title = title ? title + ' - Home' : 'iView project';
    window.document.title = title;
};
const ajaxUrl = env === 'development' ?
    'http://127.0.0.1:8085' :
    env === 'production' ?
    'http://127.0.0.1:8085' :
    'http://127.0.0.1:8085';
util.ajax = axios.create({
    baseURL: ajaxUrl,
    timeout: 30000
});
util.ajaxUrl = ajaxUrl;

export default util;
