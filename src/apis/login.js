import service from '@/utils/request'

// 用户登录相关
export const postLogin = (data) => {
  return service({
    url: '/login',
    method: 'post',
    data
  })
}

export const changePasswd = (data) => {
  return service({
    url: '/changepasswd',
    method: 'put',
    data
  })
}
