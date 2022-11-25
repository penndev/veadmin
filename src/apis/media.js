import service from '@/utils/request'

// 获取系统验证码
export const getMedia = (params) => {
  return service({
    url: '/media/list',
    method: 'get',
    params
  })
}

export const postMedia = (data) => {
  return service({
    url: '/system/admin',
    method: 'post',
    data
  })
}

export const putMedia = (data) => {
  return service({
    url: '/system/admin',
    method: 'put',
    data
  })
}

export const deleteMedia = (params) => {
  return service({
    url: '/system/admin',
    method: 'delete',
    params
  })
}

export const submitMedia = (data) => {
  return service({
    url: '/job/submit',
    method: 'post',
    data
  })
}
