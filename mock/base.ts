import { Connect } from "vite"
import * as http from 'node:http';

export type Service = [req: Connect.IncomingMessage, res: http.ServerResponse, next: Connect.NextFunction]

export type CallRoute = (
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
  get(route:string,func:CallRoute){
    this.routerlist[route+'_GET'] = func
  }
  match(s:string,m?:string){
    let callback:CallRoute = this.routerlist[s]
    if(callback == undefined){ //详细方法匹配
      callback = this.routerlist[s+'_'+m]
    }
    if(callback == undefined){
      this.service[1].end(s + " | 404")
      return
    }
    callback(...this.service)
  }
  setService(s:Service){
    this.service = s
    const url = s[0].url.split("?")[0]
    this.match(url,s[0].method)
  }
}

export const router = new Route()