import { ViteDevServer } from "vite"
import { router } from './base'
 
import mockJs from 'mockjs'
const Mock = mockJs as any


router.any("/version", (req,res,next) =>{
  res.end("0.0.1")
})

router.any("/captcha", (req,res,next)=>{
  let uuid = Mock.Random.guid()
  let image = Mock.Random.dataImage('200x100',"1234")
  let result = JSON.stringify({
    "captchaID": uuid,
    "captchaURL": image
  })
  res.end(result)
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
