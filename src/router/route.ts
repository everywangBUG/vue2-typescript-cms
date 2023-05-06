import { LOGIN_TOKEN } from '@/constants/login'
import { localCache } from '@/utils/cache'
import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    // 判断用户是否登录? '/main' : '/login'
    redirect: '/main'
  },
  {
    path: '/login',
    component: () => import('@/views/login/login.vue')
  },
  {
    path: '/main',
    name: 'main',
    component: () => import('@/views/main/main.vue')
  },
  {
    path: '/:pathMatch(.*)',
    component: () => import('@/views/not-found/notFound.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

const localRoutes = [
  {
    path: '/main/analysis/dashboard',
    component: () => import('@/views/main/analysis/dashboard/dashboard.vue')
  },
  {
    path: '/main/analysis/overview',
    component: () => import('@/views/main/analysis/overview/overview.vue')
  },
  {
    path: '/main/system/role',
    component: () => import('@/views/main/system/role/role.vue')
  },
  {
    path: '/main/system/user',
    component: () => import('@/views/main/system/user/user.vue')
  }
]

// 使用addRoute动态路由的添加
router.addRoute('main', localRoutes[0])
router.addRoute('main', localRoutes[1])

// 路由守卫
//参数：to(跳转的位置)/from(从哪里跳转过来)
//返回值：返回值决定了导航的路径(不返回或返回undefined，默认跳转)
router.beforeEach((to) => {
  // 如果登录成功，即token验证成功，进入main页面
  // token没有获取到值的时候，跳转到login页面
  const token = localCache.getCache(LOGIN_TOKEN)
  if (to.path.startsWith('/main') && !token) {
    return LOGIN_TOKEN
  }
  if (to.path === LOGIN_TOKEN && token) {
    return '/main'
  }
})

export default router
