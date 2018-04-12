import Main from './views/main.vue'

const routers = [{
    path: '/',
    meta: {
        title: '代码生成器'
    },
    component: Main
},{
    path: '/main',
    meta: {
        // title: 'main'
    },
    component: Main
}];
export default routers;
