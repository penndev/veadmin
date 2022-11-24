import SparkMD5 from 'spark-md5'

// file File文件类型
// progress callback(0.11) 进度11%
function MD5LargeFile (file, progress) {
  return new Promise((resolve, reject) => {
    const chunkSize = 20971520
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

export {
  MD5LargeFile
}
