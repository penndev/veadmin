// @ts-check
import { defineStore } from 'pinia'

export default defineStore('layout', {
  state: () => {
    return {
      collapse: false, // 侧边栏 true->收缩 false->展示
      history: {} // 历史列表。 {  path: route.path, name: route.name, meta: route.meta }
    }
  },
  persist: true // 配置持久化
})
