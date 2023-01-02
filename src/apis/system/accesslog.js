import service from '@/utils/request'

export const getSystemAccesslog = (params) => {
  return service({
    url: '/system/admin/accesslog',
    method: 'get',
    params
  })
}
