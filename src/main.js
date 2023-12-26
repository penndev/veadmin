import { createApp } from 'vue'
import App from '@/App.vue'

// import element lang icon source
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import '@/styles/index.scss'

import stores from '@/stores' // import pinia store
import router from '@/router/auth' // import after permission router

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(router)
app.use(stores)
app.use(ElementPlus, {
  locale: zhCn
})
app.mount('#app')
