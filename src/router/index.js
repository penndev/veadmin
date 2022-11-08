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
    path: '/example',
    component: Layout,
    redirect: '/example/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/example/index.vue'),
        name: 'exampleIndex',
        meta: { title: '示例列表', icon: 'Tickets' }
      }
    ]
  },
  { // 处理外链
    path: 'icon',
    component: Layout,
    name: 'Icon',
    meta: {
      title: '图标',
      icon: 'PictureRounded',
      path: 'https://element-plus.org/zh-CN/component/icon.html#%E5%9B%BE%E6%A0%87%E9%9B%86%E5%90%88'
    }
  },
  // 以下路由必须固定存在
  {
    name: 'login',
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    meta: { white: true, hidden: true }
  },
  {
    name: 'notFound',
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/layout/404.vue'),
    meta: { white: true, hidden: true }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes: format(routes)
})

export default router
