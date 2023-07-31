import service from '@/utils/request'

// 获取系统验证码
export const getExample = (params) => {
  return service({
    url: '/example/admin',
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
