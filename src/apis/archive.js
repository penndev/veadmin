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

export const addArchiveTag = (data) => {
  return service({
    url: '/archive/list/tag',
    method: 'post',
    data
  })
}

export const deleteArchiveTag = (params) => {
  return service({
    url: '/archive/list/tag',
    method: 'delete',
    params
  })
}

/**
 * +++++++++++++++++++++++++++++
 * +    资料分类
 * +++++++++++++++++++++++++++++
 */

// 新建分类
export const addCategory = (data) => {
  return service({
    url: '/archive/category',
    method: 'post',
    data
  })
}

// 修改分类
export const updateCategory = (data) => {
  return service({
    url: '/archive/category',
    method: 'put',
    data
  })
}

// 获取分类
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

/**
 * +++++++++++++++++++++++++++++
 * +    资料标签
 * +++++++++++++++++++++++++++++
 */

// 新建分类
export const addTag = (data) => {
  return service({
    url: '/archive/tag',
    method: 'post',
    data
  })
}

// 修改分类
export const updateTag = (data) => {
  return service({
    url: '/archive/tag',
    method: 'put',
    data
  })
}

// 获取分类
export const getTag = (params) => {
  return service({
    url: '/archive/tag',
    method: 'get',
    params
  })
}

export const deleteTag = (params) => {
  return service({
    url: '/archive/tag',
    method: 'delete',
    params
  })
}
