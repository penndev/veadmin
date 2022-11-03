import { ViteDevServer } from "vite"
import "./login"
import "./dashboard"

import { router } from "./base"


// 导出mock路由组
export const mockPlugin = () => ({
  name: 'mock-server',
  configureServer(server:ViteDevServer){
    // 返回一个在内部中间件安装后
    // 被调用的后置钩子 return () => {}
    server.middlewares.use("/mock", (...context) => {
      router.setService(context)
    })
  }
})
