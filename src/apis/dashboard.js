import service from '@/utils/request'

// 获取系统验证码
export const getDashboardTotal = (params) => {
  return service({
    url: '/dashboard/total',
    method: 'get',
    params
  })
}
