import service from '@/utils/request'

// 用户登录相关
export const postLogin = (data) => {
  return service({
    url: '/login',
    method: 'post',
    data
  })
}

// 用户两步验证登录
export const postOTPLogin = (data) => {
  return service({
    url: '/login-2fa',
    method: 'post',
    data
  })
}

export const changePasswd = (data) => {
  return service({
    url: '/change-passwd',
    method: 'put',
    data
  })
}
