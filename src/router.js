import Index from './views/index.vue'
import Main from './views/main.vue'
import tabMain from './views/tabs/tabconfig.vue'

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
},{
    path: '/tabMain',
    meta: {
        title: 'tabMain'
    },
    component: tabMain
}];
export default routers;
