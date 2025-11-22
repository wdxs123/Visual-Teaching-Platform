import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/LoginPage.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/login/RegisterPage.vue')
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('@/views/home/HomeView.vue')
    },
    {
      path: '/electrical-engineering',
      name: 'ElectricalEngineering',
      component: () => import('@/views/electrical-engineering/ElectricalEngineering.vue')
    }
  ],
})

// 移除了所有路由守卫，让页面自由访问
export default router
