import { createApp } from "vue";
import App from "@/App.vue";
const app = createApp(App);

// import element lang icon source
import ElementPlus from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

import "@/styles/index.scss";

import stores from "@/stores"; // import pinia store
import router from "@/router/auth"; // import after permission router

// 引入自定义拓展组件
import ElTableColumnTruncated from "@/components/ElTableColumnTruncated.vue";
import ElPaginationPlus from "@/components/ElPaginationPlus.vue";
app.component("ElTableColumnTruncated", ElTableColumnTruncated);
app.component("ElPaginationPlus", ElPaginationPlus);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.use(router);
app.use(stores);
app.use(ElementPlus, {
  locale: zhCn,
});
app.mount("#app");
