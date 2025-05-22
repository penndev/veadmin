import { defineStore } from "pinia";

export default defineStore("pagination", {
  state: () => {
    return {
      data: {},
    };
  },
  persist: true, // 配置持久化
});
