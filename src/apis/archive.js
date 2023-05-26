import service from '@/utils/request'

// 新建资料
export const addArchive = (data) => {
  return service({
    url: '/archive/list',
    method: 'post',
    data
    // headers: {
    //   'Content-Type': 'multipart/form-data'
    // }
  })
}

// 修改资料
export const updateArchive = (data) => {
  return service({
    url: '/archive/list',
    method: 'put',
    data
    // headers: {
    //   'Content-Type': 'multipart/form-data'
    // }
  })
}

// 获取媒体列表
export const getArchive = (params) => {
  return service({
    url: '/archive/list',
    method: 'get',
    params
  })
}

export const deleteArchive = (params) => {
  return service({
    url: '/archive/list',
    method: 'delete',
    params
  })
}
