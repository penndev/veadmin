import service from '@/utils/request'

// 上传文件
export const fileUploadBefore = (data) => {
  return service({
    url: '/video/upload/before',
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

// 新增转码配置
export const addTranscode = (data) => {
  return service({
    url: '/video/transcode',
    method: 'post',
    data
  })
}
export const listTranscode = (params) => {
  return service({
    url: '/video/transcode',
    method: 'get',
    params
  })
}
export const updateTranscode = (data) => {
  return service({
    url: '/video/transcode',
    method: 'put',
    data
  })
}
export const deleteTranscode = (params) => {
  return service({
    url: '/video/transcode',
    method: 'delete',
    params
  })
}

export const addTask = (data) => {
  return service({
    url: '/video/task',
    method: 'post',
    data
  })
}

// 获取媒体列表
export const listTask = (params) => {
  return service({
    url: '/video/task',
    method: 'get',
    params
  })
}

export const deleteTask = (params) => {
  return service({
    url: '/video/task',
    method: 'delete',
    params
  })
}

export const progressTask = (params) => {
  return service({
    url: '/video/task/progress',
    method: 'get',
    params
  })
}
