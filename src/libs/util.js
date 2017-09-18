import axios from 'axios';
import env from '../config/env';

let util = {

};
util.title = function(title) {
    title = title ? title + ' - Home' : 'iView project';
    window.document.title = title;
};

const ajaxUrl = env === 'development' ?
    'http://10.64.13.39:8901' :
    env === 'production' ?
    'http://10.64.13.39:8901' :
    'http://10.64.13.39:8901';

util.ajax = axios.create({
    baseURL: ajaxUrl,
    timeout: 30000
});

util.ajaxUrl = ajaxUrl;

export default util;