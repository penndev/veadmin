import service from '@/utils/request'

export const getExample = (params) => {
  return service({
    url: '/example/list',
    method: 'get',
    params
  })
}

export const postExample = (data) => {
  return service({
    url: '/example/create',
    method: 'post',
    data
  })
}

export const putExample = (data) => {
  return service({
    url: '/example/update',
    method: 'put',
    data
  })
}

export const deleteExample = (params) => {
  return service({
    url: '/example/delete',
    method: 'delete',
    params
  })
}
