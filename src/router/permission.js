import router from '.'
import { permissionStoe } from '@/stores'

router.beforeEach(async (to, from, next) => {
  // console.log(to, from)
  // 如果跳转路由是在白名单中则直接放行
  if (to.meta.white !== undefined && to.meta.white === true) {
    next()
    return
  }
  // 如果用户登录过的 则直接放行
  const permission = permissionStoe()
  if (permission.token != null) {
    next()
    return
  }

  // 最后的结果则跳转到登录页面
  console.log('未放行')
  next({ name: 'login' })
})

export default router
