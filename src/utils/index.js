import SparkMD5 from "spark-md5";
import { resolve } from "path";

// file File文件类型
// progress callback(0.11) 进度11%
export function MD5LargeFile(file, progress) {
  return new Promise((resolve, reject) => {
    const chunkSize = 10 * 1048576;
    const chunks = Math.ceil(file.size / chunkSize);

    const blobSlice = File.prototype.slice;
    const spark = new SparkMD5.ArrayBuffer();
    let currentChunk = 0;

    const fileReader = new FileReader();
    fileReader.onload = function (e) {
      spark.append(e.target.result);
      currentChunk++;
      if (currentChunk < chunks) {
        if (typeof progress === "function") {
          progress(currentChunk / chunks);
        }
        loadNext();
      } else {
        resolve(spark.end());
      }
    };
    fileReader.onerror = function (e) {
      reject(e);
    };
    function loadNext() {
      const start = currentChunk * chunkSize;
      const end =
        start + chunkSize >= file.size ? file.size : start + chunkSize;
      fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
    }
    loadNext();
  });
}

// 格式路由路径
export const formatRouteItem = (children, basePath) => {
  children.path = resolve(basePath, children.path);
  if (children.children) {
    for (const item of children.children) {
      formatRouteItem(item, children.path);
    }
  }
  return children;
};

// 格式化路由
// 将路由的路径进行拼装。
export const formatRouteList = (routes) => {
  const routeList = [];
  for (const item of routes) {
    formatRouteItem(item, "/");
    routeList.push(item);
  }
  return routeList;
};
