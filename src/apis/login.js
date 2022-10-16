import service from '@/utils/request'

// 获取系统验证码
export const postLogin = (data) => {
  return service({
    url: '/login',
    method: 'post',
    data
  })
}
