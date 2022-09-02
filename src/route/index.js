import { createRouter, createWebHashHistory } from 'vue-router'

import Layout from '@/view/layout/index.vue'

const routes = [
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/view/dashboard/index.vue'),
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
        component: () => import('@/view/dashboard/index.vue'),
        meta: { title: '管理员', icon: 'User' }

      },
      {
        path: 'permission',
        component: () => import('@/view/dashboard/index.vue'),
        meta: { title: '访问权限', icon: 'Filter' }
      },
      {
        path: 'accesslog',
        component: () => import('@/view/dashboard/index.vue'),
        meta: { title: '请求日志', icon: 'Postcard' }
      }
    ]
  },
  {
    path: '/icon',
    component: () => import('@/view/dashboard/index.vue'),
    name: 'Icon',
    meta: { title: 'Dashboard', icon: 'User' }
  },
  {
    path: '/login',
    component: () => import('@/view/login/index.vue')
  },

  //

  {
    path: '/system1',
    component: Layout,
    meta: { title: '系统设置', icon: 'Setting' },
    children: [
      {
        path: 'administrator',
        component: () => import('@/view/dashboard/index.vue'),
        meta: { title: '管理员', icon: 'User' }

      },
      {
        path: 'permission',
        component: () => import('@/view/dashboard/index.vue'),
        meta: { title: '访问权限', icon: 'Filter' }
      },
      {
        path: 'accesslog',
        component: () => import('@/view/dashboard/index.vue'),
        meta: { title: '请求日志', icon: 'Postcard' }
      },
      {
        path: 'administrator',
        component: () => import('@/view/dashboard/index.vue'),
        meta: { title: '管理员', icon: 'User' }

      },
      {
        path: 'permission',
        component: () => import('@/view/dashboard/index.vue'),
        meta: { title: '访问权限', icon: 'Filter' }
      },
      {
        path: 'accesslog',
        component: () => import('@/view/dashboard/index.vue'),
        meta: { title: '请求日志', icon: 'Postcard' }
      },
      {
        path: 'administrator',
        component: () => import('@/view/dashboard/index.vue'),
        meta: { title: '管理员', icon: 'User' }

      },
      {
        path: 'permission',
        component: () => import('@/view/dashboard/index.vue'),
        meta: { title: '访问权限', icon: 'Filter' }
      },
      {
        path: 'accesslog',
        component: () => import('@/view/dashboard/index.vue'),
        meta: { title: '请求日志', icon: 'Postcard' }
      },
      {
        path: 'permission',
        component: () => import('@/view/dashboard/index.vue'),
        meta: { title: '访问权限', icon: 'Filter' }
      },
      {
        path: 'accesslog',
        component: () => import('@/view/dashboard/index.vue'),
        meta: { title: '请求日志', icon: 'Postcard' }
      },
      {
        path: 'permission',
        component: () => import('@/view/dashboard/index.vue'),
        meta: { title: '访问权限', icon: 'Filter' }
      },
      {
        path: 'accesslog',
        component: () => import('@/view/dashboard/index.vue'),
        meta: { title: '请求日志', icon: 'Postcard' }
      },
      {
        path: 'permission',
        component: () => import('@/view/dashboard/index.vue'),
        meta: { title: '访问权限', icon: 'Filter' }
      },
      {
        path: 'accesslog',
        component: () => import('@/view/dashboard/index.vue'),
        meta: { title: '请求日志', icon: 'Postcard' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
