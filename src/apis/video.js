import service from '@/utils/request'

// 上传文件
export const fileUploadBefore = (data) => {
  return service({
    url: '/video/upload/part',
    method: 'post',
    data
  })
}
export const fileUploadPart = (data) => {
  return service({
    url: '/video/upload/part',
    method: 'put',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    viewLoading: false
  })
}

// 获取媒体列表
export const listFile = (params) => {
  return service({
    url: '/video/file',
    method: 'get',
    params
  })
}
export const updateFile = (data) => {
  return service({
    url: '/video/file',
    method: 'put',
    data
  })
}
export const deleteFile = (params) => {
  return service({
    url: '/video/file',
    method: 'delete',
    params
  })
}

// 转码配置
export const addTranscode = (data) => {
  return service({
    url: '/media/admin',
    method: 'post',
    data
  })
}

export const addTask = () => {

}
