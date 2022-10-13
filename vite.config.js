import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import eslint from 'vite-plugin-eslint'
import { resolve } from 'path'

const mockPlugin = () => ({
  name: 'mock-server',
  configureServer(server){
    // 返回一个在内部中间件安装后
    // 被调用的后置钩子
    return () => {
      server.middlewares.use((req, res, next) => {
        // 自定义请求处理...
        console.log(req.url)
        next()
      })
    }
  }
})


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    eslint({
      fix: true
    }),
    mockPlugin()
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      'path': 'path-browserify',
    }
  },
  envPrefix: ['VITE','VE']
})
