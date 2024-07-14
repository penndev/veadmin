import { reactive } from 'vue'

// 加载请求的遮罩层状态存储
export const viewLoading = reactive({
  status: false,
  text: '正在加载中'
})
