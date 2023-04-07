<template>
    <el-upload
        class="upload-demo"
        action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
        :http-request="handleUploadCatch"
        :limit="100"
        :multiple="true"
        accept="video/*"
    >
        <el-button type="primary"  icon="Upload" >点击上传</el-button>
        <template #tip>
            <div class="el-upload__tip">
                仅允许上传视频媒体文件
            </div>
        </template>
    </el-upload>
    <br />
</template>
<script setup>
import { fileUploadPart, fileUploadBefore } from '@/apis/video'
import { MD5LargeFile } from '@/utils'
import { ElNotification } from 'element-plus'

const handleUpload = async (options) => {
  options.onProgress({ percent: 0 })
  // 获取文件的md5
  const filemd5 = await MD5LargeFile(options.file, (p) => {
    const progress = parseInt(p * 100)
    options.onProgress({ percent: (100 - progress) })
  })
  const upload = await fileUploadBefore({
    name: options.file.name,
    md5: filemd5,
    size: options.file.size
  })
  //   处理文件上传
  const countPart = Math.floor(options.file.size / upload.urate)
  for (let currentPart = upload.ucount; currentPart <= countPart; currentPart += 1) {
    const start = currentPart * upload.urate
    const end = start + upload.urate
    const uploadData = options.file.slice(start, end)

    const formData = new FormData()
    formData.append('currentPart', currentPart)
    formData.append('uploadID', filemd5)
    formData.append('uploadData', uploadData)
    await fileUploadPart(formData)
    options.onProgress({ percent: parseInt((currentPart / countPart) * 100) })
  }
}


const handleUploadCatch = async (options) => {
  try {
    await handleUpload(options)
  } catch (error) {
    console.log(error)
    ElNotification({
      title: options.file.name,
      message: error.response.data,
      type: 'error',
      duration: 0
    })
    throw error
  }
}

</script>
