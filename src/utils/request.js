import axios from 'axios'

const service = axios.create({
  baseURL: import.meta.env.VE_API_URL,
  timeout: 30 * 1000
})

service.interceptors.response.use(
  // 返回正常的数据
  response => {
    return response.data
  }
)

export default service
