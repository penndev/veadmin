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

//
export const getDomain = (params) => {
  return service({
    url: '/domain',
    method: 'get',
    params
  })
}

//
export const putDomain = (data) => {
  return service({
    url: '/domain',
    method: 'put',
    data
  })
}
