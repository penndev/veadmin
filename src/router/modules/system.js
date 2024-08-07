import Layout from '@/views/layout/index.vue'

export const dashboard = {
  path: '/',
  component: Layout,
  redirect: '/dashboard',
  children: [
    {
      path: 'dashboard',
      component: () => import('@/views/dashboard.vue'),
      name: 'Dashboard',
      meta: { title: '仪表盘', icon: 'Odometer' }
    }
  ]
}

export const system = {
  path: '/system',
  component: Layout,
  redirect: '/system/administrator',
  meta: { title: '系统设置', icon: 'Setting' },
  children: [
    {
      path: 'administrator',
      component: () => import('@/views/system/administrator.vue'),
      name: 'SystemAdministrator',
      meta: { title: '管理员', icon: 'User' }
    },
    {
      path: 'permission',
      component: () => import('@/views/system/permission.vue'),
      name: 'SystemPermission',
      meta: { title: '访问权限', icon: 'Filter' }
    },
    {
      path: 'accesslog',
      component: () => import('@/views/system/accesslog.vue'),
      name: 'SystemAccesslog',
      meta: { title: '请求日志', icon: 'Postcard' }
    }
  ]
}
