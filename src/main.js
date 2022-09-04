import { createApp } from 'vue'
import ElementPlus from 'element-plus'

// 引入组件
import App from '@/App.vue'
import router from '@/router'
import stores from '@/stores'

// 引入资源
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'

const app = createApp(App)

app.config.globalProperties.$env = import.meta.env

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(router)
app.use(stores)
app.use(ElementPlus)

app.mount('#app')
