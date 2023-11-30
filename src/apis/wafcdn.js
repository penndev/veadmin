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

export const getDomain = (params) => {
  return service({
    url: '/domain',
    method: 'get',
    params
  })
}

export const putDomain = (data) => {
  return service({
    url: '/domain',
    method: 'put',
    data
  })
}

export const getCache = (params) => {
  return service({
    url: '/cache',
    method: 'get',
    params
  })
}

export const deleteCache = (params) => {
  return service({
    url: '/cache',
    method: 'delete',
    params
  })
}

export const postControlHost = (data) => {
  return service({
    url: '/control/host',
    method: 'post',
    data
  })
}

export const getControlHost = (params) => {
  return service({
    url: '/control/host',
    method: 'get',
    params
  })
}

export const putControlHost = (data) => {
  return service({
    url: '/control/host',
    method: 'put',
    data
  })
}

export const deleteControlHost = (params) => {
  return service({
    url: '/control/host',
    method: 'delete',
    params
  })
}

export const installControlHost = (data) => {
  return service({
    url: '/control/host/install',
    method: 'put',
    data
  })
}
