import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import App from '@/App.vue'
// import element icon source
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'

// import pania store
import stores from '@/stores'

// import router from '@/router' // import origin router
import router from '@/router/permission' // import after permission router

const app = createApp(App)

app.config.globalProperties.$env = import.meta.env

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(router)
app.use(stores)
app.use(ElementPlus)

app.mount('#app')
