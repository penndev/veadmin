import { createRouter, createWebHashHistory } from 'vue-router'

import { dashboard, system } from './modules/system'
import { video, archive } from './modules/video'
import { example, icon } from './modules/example'
import { wafcdn } from './modules/wafcdn'

import { formatRouteItem, formatRouteList } from '@/utils'

/**
 * 动态路由 router.addRoute() 不能通过 router.options.routes 获取到。https://github.com/vuejs/vue-router/issues/1859
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

const routes = [
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
  }
]

// 提供动态编译。
if (import.meta.env.MODE === 'wafcdn') {
  wafcdn.path = '/'
  wafcdn.redirect = '/index'
  routes.push(formatRouteItem(wafcdn, '/'))
} else {
  routes.push(...formatRouteList([dashboard, system, archive, video, wafcdn, example, icon]))
}

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
