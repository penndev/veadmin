import { resolve } from 'path'

// 格式化路由数据
export const format = (routes) => {
  const routelist = []
  const formatRouteChildren = (children, basePath) => {
    children.path = resolve(basePath, children.path)
    if (children.children) {
      for (const item of children.children) { formatRouteChildren(item, children.path) }
    }
  }
  for (const item of routes) {
    formatRouteChildren(item, '/')
    routelist.push(item)
  }
  return routelist
}
