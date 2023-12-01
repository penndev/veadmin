import { createApp } from 'vue'
import App from '@/App.vue'

// import element lnag icon source
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import '@/styles/index.scss'

import stores from '@/stores' // import pania store
import router from '@/router/auth' // import after permission router

const app = createApp(App)
app.config.globalProperties.$env = import.meta.env

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(router)
app.use(stores)
app.use(ElementPlus, {
  locale: zhCn
})
app.mount('#app')
