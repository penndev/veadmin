// @ts-check
import { defineStore } from "pinia";

export default defineStore("layout", {
  state: () => {
    return {
      /**
       * 侧边栏
       * true->收缩
       * false->展示
       */
      collapse: false,
    };
  },
  persist: true, // 配置持久化
});
