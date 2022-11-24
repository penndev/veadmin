import service from '@/utils/request'

export const uploadBefore = (data) => {
  return service({
    url: '/upload/before',
    method: 'post',
    data
  })
}

// 获取系统验证码
export const uploadPart = (data) => {
  return service({
    url: '/upload/part',
    method: 'put',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
