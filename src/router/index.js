import {createRouter,createWebHistory} from 'vue-router'

const routes = [
    {
        name:'登录',
        path:'/login',
        component:() => import('../views/Login.vue')
    }
]

const router = createRouter({
    routes,
    history:createWebHistory()
})
export default router