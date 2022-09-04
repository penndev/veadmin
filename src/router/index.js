import { createRouter, createWebHashHistory } from 'vue-router'
import { format } from '@/utils/route'

import Layout from '@/views/layout/index.vue'

const routes = [
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        name: 'Dashboard',
        meta: { title: '仪表盘', icon: 'Odometer' }
      }
    ]
  },
  {
    path: '/system',
    component: Layout,
    meta: { title: '系统设置', icon: 'Setting' },
    children: [
      {
        path: 'administrator',
        component: () => import('@/views/system/administrator.vue'),
        meta: { title: '管理员', icon: 'User' }
      },
      {
        path: 'permission',
        component: () => import('@/views/system/permission.vue'),
        meta: { title: '访问权限', icon: 'Filter' }
      },
      {
        path: 'accesslog',
        component: () => import('@/views/system/accesslog.vue'),
        meta: { title: '请求日志', icon: 'Postcard' }
      }
    ]
  },
  {
    path: '/icon',
    component: () => import('@/views/icon/index.vue'),
    name: 'Icon',
    meta: { title: '图标', icon: 'PictureRounded' }
  },
  {
    path: '/login',
    component: () => import('@/views/login/index.vue')
  }

]

const router = createRouter({
  history: createWebHashHistory(),
  routes: format(routes)
})

export default router
