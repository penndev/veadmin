import { createPinia } from 'pinia'
const stores = createPinia()

export { default as layoutStoe } from './module/layout'
export { default as permissionStoe } from './module/permission'

export default stores
