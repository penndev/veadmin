import { authStoe } from '@/stores'
import router from '@/router'
import { ElMessage } from 'element-plus'

// 路由挂载比store挂载早。不能直接初始化
let auth = null
const getToken = () => {
  if (auth === null) {
    auth = authStoe()
  }
  return !!auth.token
}
const getRole = (name) => {
  if (auth === null) {
    auth = authStoe()
  }
  if (auth.routes === '*') return true
  return auth.routes.indexOf(name) !== -1
}

router.beforeEach(async (to, from, next) => {
  if (to.meta && to.meta.white === true) { // 放行白名单
    next()
    return
  }
  if (getToken()) { // 用户登陆过
    if (getRole(to.name)) { // 验证权限
      next()
    } else { // 提示权限不足
      ElMessage.error(`当前用户暂时无权访问，请联系管理员添加[${to.name}]权限。`)
    }
    return
  }

  // 最后的结果则跳转到登录页面
  // console.log('this router is not access [to],[from]', to, from)
  next({
    name: 'login',
    query: {
      redirect: to.fullPath
    }
  })
})

export default router
