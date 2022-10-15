import { ViteDevServer, Connect } from "vite"
import * as http from 'node:http';

type Service = [req: Connect.IncomingMessage, res: http.ServerResponse, next: Connect.NextFunction]

type CallRoute = (
  // s :Service
  req: Connect.IncomingMessage,
  res: http.ServerResponse,
  next: Connect.NextFunction
) => void

class Route {
  service: Service
  routerlist:CallRoute[] = []
  any(route:string,func:CallRoute){
    this.routerlist[route] = func
  }
  match(s:string){
    let callback:CallRoute = this.routerlist[s]
    if(callback == undefined){
      this.service[1].end(s + " | 404")
      return
    }
    callback(...this.service)
  }
  setService(s:Service){
    this.service = s
    this.match(s[0].url)
  }
}

const router = new Route()
router.any("/version", (req,res,next) =>{
  res.end("0.0.1")
})




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
