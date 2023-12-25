import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
const stores = createPinia()

stores.use(piniaPluginPersistedstate)

export { default as layoutStore } from './module/layout'
export { default as authStore } from './module/auth'

export default stores
