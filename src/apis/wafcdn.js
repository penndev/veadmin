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
