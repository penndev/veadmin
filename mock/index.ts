import {ViteDevServer} from "vite"



// route 定义路由组数据
const route = (route:string):string => {
  const result = route + " | 404"
  return result
}

export const mockPlugin = () => ({
  name: 'mock-server',
  configureServer(server:ViteDevServer){
    // 返回一个在内部中间件安装后
    // 被调用的后置钩子 return () => {}
    server.middlewares.use("/mock", (req, res, next) => {
      // console.log(req.url)
      let result = route(req.url)
      res.end(result)
    })
    
  }
})
