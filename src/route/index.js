import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    component: () => import('../view/loginUser.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
