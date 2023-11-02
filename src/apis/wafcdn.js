import service from '@/utils/request'

// 上传文件前置检查
export const stat = (params) => {
  return service({
    url: '/stat',
    method: 'get',
    params,
    viewLoading: false
  })
}

// 获取系统验证码
export const getDomain = (params) => {
  return service({
    url: '/domain',
    method: 'get',
    params
  })
}

export const postExample = (data) => {
  return service({
    url: '/example/admin',
    method: 'post',
    data
  })
}

export const putExample = (data) => {
  return service({
    url: '/example/admin',
    method: 'put',
    data
  })
}

export const deleteExample = (params) => {
  return service({
    url: '/example/admin',
    method: 'delete',
    params
  })
}
