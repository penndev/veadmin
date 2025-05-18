import SparkMD5 from 'spark-md5'
import { resolve } from 'path'

// file File文件类型
// progress callback(0.11) 进度11%
export function MD5LargeFile (file, progress) {
  return new Promise((resolve, reject) => {
    const chunkSize = 10 * 1048576
    const chunks = Math.ceil(file.size / chunkSize)

    const blobSlice = File.prototype.slice
    const spark = new SparkMD5.ArrayBuffer()
    let currentChunk = 0

    const fileReader = new FileReader()
    fileReader.onload = function (e) {
      spark.append(e.target.result)
      currentChunk++
      if (currentChunk < chunks) {
        if (typeof progress === 'function') {
          progress(currentChunk / chunks)
        }
        loadNext()
      } else {
        resolve(spark.end())
      }
    }
    fileReader.onerror = function (e) {
      reject(e)
    }
    function loadNext () {
      const start = currentChunk * chunkSize
      const end = start + chunkSize >= file.size ? file.size : start + chunkSize
      fileReader.readAsArrayBuffer(blobSlice.call(file, start, end))
    }
    loadNext()
  })
}

// 格式化文件大小
// 从字节开始格式化
export const fileSizeFormat = (byteLen) => {
  const TB = 1099511627776
  const GB = 1073741824
  const MB = 1048576
  const KB = 1024

  if (typeof byteLen !== 'number' || isNaN(byteLen)) {
    throw new Error('Input must be a valid number')
  }

  if (byteLen >= TB) {
    return (byteLen / TB).toFixed(2) + 'TB'
  } else if (byteLen >= GB) {
    return (byteLen / GB).toFixed(2) + 'GB'
  } else if (byteLen >= MB) {
    return (byteLen / MB).toFixed(2) + 'MB'
  } else if (byteLen >= KB) {
    return (byteLen / KB).toFixed(2) + 'KB'
  } else {
    return byteLen + 'Byte'
  }
}

// 格式化BPS
export const byteBPSFormat = (byteLen) => {
  const bps = byteLen * 8
  if (bps > 1000000000) {
    return (bps / 1000000000).toFixed(2) + 'Gbps'
  } else if (bps > 1000000) {
    return (bps / 1000000).toFixed(1) + 'Mbps'
  } else if (bps > 1000) {
    return (bps / 1000).toFixed(1) + 'Kbps'
  } else {
    return bps + 'bps'
  }
}

// 格式化时间 秒对文字
export const timeFormat = (sec) => {
  if (sec >= 3600) {
    return (sec / 3600).toFixed(2) + '小时'
  } else if (sec >= 60) {
    return (sec / 60).toFixed(2) + '分钟'
  } else {
    return sec + '秒'
  }
}

// 返回时间戳。或者unix格式化字符串
export const dateFormat = (dateString, timestamp) => {
  const date = (timestamp && timestamp > 0) ? new Date(timestamp * 1000) : new Date()
  const year = date.getFullYear().toString()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return dateString
    .replace('Y', year)
    .replace('m', month)
    .replace('d', day)
    .replace('H', hours)
    .replace('i', minutes)
    .replace('s', seconds)
}

// 格式路由路径
export const formatRouteItem = (children, basePath) => {
  children.path = resolve(basePath, children.path)
  if (children.children) {
    for (const item of children.children) {
      formatRouteItem(item, children.path)
    }
  }
  return children
}

// 格式化路由
// 将路由的路径进行拼装。
export const formatRouteList = (routes) => {
  const routeList = []
  for (const item of routes) {
    formatRouteItem(item, '/')
    routeList.push(item)
  }
  return routeList
}

/**
 * 模拟其他语言的 sleep 函数
 * @param ms 毫秒
 * @returns promise
 */
export const sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}
