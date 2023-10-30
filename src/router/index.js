import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from '@/views/layout/index.vue'
import { resolve } from 'path'

// 格式路由结构
const formatRouteList = (routes) => {
  // 原始路由列表
  const routelist = []
  const formatRouteChildren = (children, basePath) => {
    children.path = resolve(basePath, children.path)
    if (children.children) {
      for (const item of children.children) {
        formatRouteChildren(item, children.path)
      }
    }
  }
  for (const item of routes) {
    formatRouteChildren(item, '/')
    // 进行角色权限验证
    routelist.push(item)
  }
  return routelist
}

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
    path: '/archive',
    component: Layout,
    redirect: '/archive/index',
    meta: { title: '资料档案', icon: 'Postcard' },
    children: [
      {
        path: 'list',
        component: () => import('@/views/archive/list.vue'),
        name: 'archiveList',
        meta: { title: '资料列表', icon: 'Memo' }
      },
      {
        path: 'category',
        component: () => import('@/views/archive/category.vue'),
        name: 'archiveCategory',
        meta: { title: '分类列表', icon: 'Grid' }
      },
      {
        path: 'tag',
        component: () => import('@/views/archive/tag.vue'),
        name: 'archiveTag',
        meta: { title: '标签列表', icon: 'PriceTag' }
      }
    ]
  },
  {
    path: '/wafcdn',
    component: Layout,
    redirect: '/wafcdn/stat',
    meta: { title: 'WAFCDN', icon: 'Postcard' },
    children: [
      {
        path: 'stat',
        component: () => import('@/views/wafcdn/stat.vue'),
        name: 'WafCdnStat',
        meta: { title: '状态总览', icon: 'Odometer' }
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
