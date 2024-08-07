import { createRouter, createWebHashHistory } from 'vue-router'

import { dashboard, system } from './modules/system'
import { video, archive } from './modules/video'
import { example, icon } from './modules/example'
import { wafcdn } from './modules/wafcdn'

import { formatRouteItem, formatRouteList } from '@/utils'

/**
 * ==================================================================
 * 动态路由说明
 * > router.addRoute() 不能通过 router.options.routes 获取到。
 * > https://github.com/vuejs/vue-router/issues/1859
 * > 所以最有效率的解决办法是通过hide + beforeEach 来控制权限问题
 *
 * > 菜单展示 src\views\layout\components\AsideBar\MenuItem.vue
 * > 远程鉴权 src\stores\module\auth.js 的 routes 是否包含name 字符串来鉴权是否放行
 * > 权限控制 src\router\auth.js
 *
 * ==================================================================
 * 对象参数介绍
 * > 菜单展示 src\views\layout\components\AsideBar\MenuItem.vue
 * - path : 进行跳转
 * - name : 进行权限验证
 * - children: [] 子元素，用于菜单组，可以不存在。
 * - meta
 *  - white 进行白名单放行。
 *  - hidden 控制是否展示
 *  - title 为空则菜单也会隐藏。
 *  - path 如果存在则表示外部地址 https://element-plus.org
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
    component: () => import('@/views/login.vue'),
    meta: { white: true, hidden: true }
  }
]

// 提供动态编译。编译阶段确定打包路由是否等于
// > wafcdn === wafcdn 来使 rollup来优化代码
if (import.meta.env.MODE === 'wafcdn') {
  wafcdn.path = '/'
  wafcdn.redirect = import.meta.env.VE_INDEX ?? '/stat'
  routes.push(formatRouteItem(wafcdn, '/'))
} else {
  routes.push(...formatRouteList([dashboard, system, archive, video, wafcdn, example, icon]))
}

const router = createRouter({
  // history: createMemoryHistory() //- http://localhost:5173/ 永远不变
  // history: createWebHistory(), //- http://localhost:5173/dashboard 模拟真实路由
  history: createWebHashHistory(), // - http://localhost:5173/#/dashboard hash模拟路由
  routes
})

export default router
