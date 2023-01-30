import service from '@/utils/request'

// 获取媒体列表
export const getMedia = (params) => {
  return service({
    url: '/media/list',
    method: 'get',
    params
  })
}

export const postMedia = (data) => {
  return service({
    url: '/system/admin',
    method: 'post',
    data
  })
}

export const putMedia = (data) => {
  return service({
    url: '/system/admin',
    method: 'put',
    data
  })
}

export const deleteMedia = (params) => {
  return service({
    url: '/media/list',
    method: 'delete',
    params
  })
}

// 获取分片列表
export const getMediaTs = (params) => {
  return service({
    url: '/media/mpegts/list',
    method: 'get',
    params
  })
}

export const postMediaTs = (data) => {
  return service({
    url: '/system/admin',
    method: 'post',
    data
  })
}

export const putMediaTs = (data) => {
  return service({
    url: '/system/admin',
    method: 'put',
    data
  })
}

export const deleteMediaTs = (params) => {
  return service({
    url: '/mediats/list',
    method: 'delete',
    params
  })
}

//  提交任务
export const submitMediaHls = (data) => {
  return service({
    url: '/job/hls/submit',
    method: 'post',
    data
  })
}
export const submitMediaTs = (data) => {
  return service({
    url: '/job/mpegts/submit',
    method: 'post',
    data
  })
}

// 上传文件
export const MediaUploadBefore = (data) => {
  return service({
    url: '/media/upload/part',
    method: 'post',
    data
  })
}
export const MediaUploadPart = (data) => {
  return service({
    url: '/media/upload/part',
    method: 'put',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
