import Index from './views/index.vue'
import Main from './views/main.vue'

const routers = [{
    path: '/',
    meta: {
        title: 'home'
    },
    component: Index
},{
    path: '/main',
    meta: {
        title: 'main'
    },
    component: Main
}];
export default routers;
