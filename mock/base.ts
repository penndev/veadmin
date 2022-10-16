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

export const router = new Route()