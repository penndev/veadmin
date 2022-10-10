// @ts-check
import { defineStore } from 'pinia'

export default defineStore('permission', {
  state: () => {
    return {
      token: null
      // routes: {} //如果用户需要配置路由权限则配置在这里
    }
  }
})
