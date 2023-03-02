import { createRouter, createWebHashHistory } from 'vue-router'
import { formatRouteList } from '@/utils'
import Layout from '@/views/layout/index.vue'

/**
 * 动态路由不能通过 router.options.routes 获取到。https://github.com/vuejs/vue-router/issues/1859
 * 所以最有效率的解决办法是通过hide + beforeEach 来控制权限问题
 * formatRouteList route.meta.white 不做任何校验。 否则会进行权限判断是否hidden.
 */
const routes = formatRouteList([
  // default route
  {
    name: 'notFound',
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/layout/404.vue'),
    meta: { white: true, hidden: true }
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        name: 'Dashboard',
        meta: { white: true, title: '仪表盘', icon: 'Odometer' }
      }
    ]
  },
  {
    name: 'login',
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    meta: { white: true, hidden: true }
  },
  // dynamic route
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
  {
    path: '/video',
    component: Layout,
    redirect: '/video/index',
    meta: { title: '视频管理', icon: 'Film' },
    children: [
      {
        path: 'file',
        component: () => import('@/views/video/file.vue'),
        name: 'videoFile',
        meta: { title: '视频文件', icon: 'Files' }
      },
      {
        path: 'transcode',
        component: () => import('@/views/video/transcode.vue'),
        name: 'videoTranscode',
        meta: { title: '编码配置', icon: 'Memo' }
      },
      {
        path: 'task',
        component: () => import('@/views/video/task.vue'),
        name: 'videoTask',
        meta: { title: '任务管理', icon: 'DocumentCopy' }
      }
    ]
  },
  {
    path: 'icon',
    component: Layout,
    name: 'Icon',
    meta: { // 处理外链
      title: '图标',
      icon: 'PictureRounded',
      path: 'https://element-plus.org/zh-CN/component/icon.html#%E5%9B%BE%E6%A0%87%E9%9B%86%E5%90%88'
    }
  }
])

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
