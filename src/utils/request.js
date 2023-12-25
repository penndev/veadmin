import axios from 'axios'
import { authStore } from '@/stores'
import { viewLoading } from '@/stores/reactive'
import { ElMessage, ElMessageBox } from 'element-plus'
import router from '@/router'

const service = axios.create({
  baseURL: import.meta.env.VE_API_URL,
  timeout: 30 * 1000
})

service.interceptors.request.use(
  config => {
    // 展示加载中的弹窗
    if (config.viewLoading !== false && viewLoading.status === false) {
      viewLoading.status = true
    }
    const permission = authStore()
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
    if (viewLoading.status === true) {
      viewLoading.status = false
    }
    return response.data
  },
  error => {
    let status = 0
    if (error.response !== undefined && error.response.status !== undefined) {
      status = error.response.status
    }
    switch (status) {
      case 400:
      case 403:
        ElMessage.error(error.response.data.message ?? error.response.data)
        break
      case 401:
        if (viewLoading.status !== true) {
          break
        }
        ElMessageBox.confirm(
          '用户登录信息失效[ ' + (error.response.data.message ?? error.response.data) + ' ] 点击确定重新登录?',
          '登录失效',
          { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
        ).then(() => {
          router.push({ name: 'login' })
        })
        break
      case 404:
        ElMessage.error('请求的接口未找到，请联系系统管理员！')
        break
      case 500:
        ElMessage.error('后台接口请求失败，请联系系统管理员，或者稍后重试！')
        break
      default:
        ElMessage.error('请求出现错误！，详细信息[' + error.message + ']')
    }
    if (viewLoading.status === true) {
      viewLoading.status = false
    }
    return Promise.reject(error)
  }
)

export default service
