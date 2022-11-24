import axios from 'axios'
import { permissionStoe } from '@/stores'
import { viewLoading } from '@/stores/reactive'
import { ElMessage } from 'element-plus'

const service = axios.create({
  baseURL: import.meta.env.VE_API_URL,
  timeout: 30 * 1000
})

service.interceptors.request.use(
  config => {
    if (viewLoading.viewLoadingStatus === false) {
      viewLoading.viewLoadingStatus = true
    }
    const permission = permissionStoe()
    // 获取token
    config.headers = {
      'x-token': permission.token,
      ...config.headers
    }
    return config
  }
)

service.interceptors.response.use(
  // 返回正常的数据
  response => {
    if (viewLoading.viewLoadingStatus === true) {
      viewLoading.viewLoadingStatus = false
    }
    return response.data
  },
  error => {
    if (viewLoading.viewLoadingStatus === true) {
      viewLoading.viewLoadingStatus = false
    }
    console.log('Request Error:', error)
    switch (error.response.status) {
      case 400:
        ElMessage.error(error.response.data.message ?? error.response.data)
        break
      case 404:
        ElMessage.error('接口未找到！ 404')
        break
    }
    return Promise.reject(error)
  }
)

export default service
