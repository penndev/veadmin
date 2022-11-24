<template>
    <el-upload
        class="upload-demo"
        action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
        :http-request="handleUpload"
    >
        <el-button type="primary"  icon="Upload" >点击上传</el-button>
        <template #tip>
            <div class="el-upload__tip">
                文件上传提示符
            </div>
        </template>
    </el-upload>
    <br />
</template>
<script setup>
import { uploadPart, uploadBefore } from '@/apis/upload'
import { MD5LargeFile } from '@/utils/md5'

const limitsize = 1024 * 1024 * 2 // 2m

const handleUpload = async (options) => {
  options.onProgress({ percent: 0 })
  // 获取文件的md5
  const filemd5 = await MD5LargeFile(options.file, (p) => { '进度->p' })
  const upload = await uploadBefore({
    name: options.file.name,
    md5: filemd5
  })
  //   处理文件上传
  const countPart = Math.ceil(options.file.size / limitsize)
  for (let currentPart = upload.currentPart; currentPart <= countPart; currentPart += 1) {
    const start = (currentPart - 1) * limitsize
    const end = start + limitsize
    const uploadData = options.file.slice(start, end)

    const formData = new FormData()
    formData.append('currentPart', currentPart)
    formData.append('countPart', countPart)
    formData.append('uploadID', upload.id)
    formData.append('uploadData', uploadData)
    await uploadPart(formData)
    options.onProgress({ percent: currentPart / countPart })
  }
}

</script>
