import service from '@/utils/request'

export const getSystemRole = (params) => {
  return service({
    url: '/system/role',
    method: 'get',
    params
  })
}

export const postSystemRole = (data) => {
  return service({
    url: '/system/role',
    method: 'post',
    data
  })
}

export const putSystemRole = (data) => {
  return service({
    url: '/system/role',
    method: 'put',
    data
  })
}

export const deleteSystemRole = (params) => {
  return service({
    url: '/system/role',
    method: 'delete',
    params
  })
}
