import { createRouter, createWebHashHistory } from 'vue-router'
import { formatRouteList } from '@/utils'
import Layout from '@/views/layout/index.vue'

/**
 * 动态路由不能通过 router.options.routes 获取到。https://github.com/vuejs/vue-router/issues/1859
 * 所以最有效率的解决办法是通过hide + beforeEach 来控制权限问题
 * - 参数介绍
 * path : 进行跳转
 * name : 进行权限验证
 * meta.white 进行白名单放行。
 * meta.hidden 控制是否展示
 * meta.title 为空则菜单也会隐藏。
 *  - 备注说明
 * 如果菜单childen只有一个则子meta 菜单处理详见src\views\layout\components\AsideBar\MenuItem.vue
 * 通过配置src\stores\module\auth.js的routes是否包含name字符串来鉴权是否放行
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
    name: 'login',
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    meta: { white: true, hidden: true }
  },
  // menu route
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
