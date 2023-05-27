import service from '@/utils/request'

// 新建资料
export const addArchive = (data) => {
  return service({
    url: '/archive/list',
    method: 'post',
    data
  })
}

// 修改资料
export const updateArchive = (data) => {
  return service({
    url: '/archive/list',
    method: 'put',
    data
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

/**
 * 视频分类
 */

// 新建资料
export const addCategory = (data) => {
  return service({
    url: '/archive/category',
    method: 'post',
    data
  })
}

// 修改资料
export const updateCategory = (data) => {
  return service({
    url: '/archive/category',
    method: 'put',
    data
  })
}

// 获取媒体列表
export const getCategory = (params) => {
  return service({
    url: '/archive/category',
    method: 'get',
    params
  })
}

export const deleteCategory = (params) => {
  return service({
    url: '/archive/category',
    method: 'delete',
    params
  })
}
