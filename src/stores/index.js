import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
const stores = createPinia()

stores.use(piniaPluginPersistedstate)

export { default as layoutStoe } from './module/layout'
export { default as authStoe } from './module/auth'

export default stores
