import { createRouter, createWebHistory } from 'vue-router'
import VueCookies from 'vue-cookies'

const routes = [
    {
        name: '登录',
        path: '/login',
        component: () => import('../views/Login.vue')
    },
    {
        name: '框架页',
        path: '/',
        component: () => import('../views/Framework.vue'),
        redirect:'/blog/list',
        children: [
            {
                name: '博客管理',
                path: '/blog/list',
                component: () => import('../views/blog/BlogList.vue')

            },
            {
                name: '博客分类',
                path: '/blog/category',
                component: () => import('../views/blog/BlogCategory.vue')

            }]
    }

]

const router = createRouter({
    routes,
    history: createWebHistory()
})

router.beforeEach((to, from, next) => {
    const userInfo = VueCookies.get('userInfo');
    if (!userInfo && to.path != "/login") {
        router.push('/login')
    }
    next();
})
export default router