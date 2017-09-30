import Index from './views/index.vue'
import Main from './views/main.vue'

const routers = [{
    path: '/',
    meta: {
        title: 'ssss'
    },
    component: Index
},{
    path: '/main',
    meta: {
        // title: 'main'
    },
    component: Main
}];
export default routers;
