<template>
  <el-upload
    class="upload-demo"
    :http-request="handleUploadCatch"
    :limit="100"
    :multiple="true"
    accept="video/*"
    v-bind="$attrs"
  >
    <el-button type="primary" icon="Upload"> 点击上传 </el-button>
    <template #tip>
      <div class="el-upload__tip">仅允许上传视频媒体文件</div>
    </template>
  </el-upload>
  <br />
</template>
<script setup>
import { fileUploadPart, fileUploadBefore } from "@/apis/video";
import { MD5LargeFile } from "@/utils";
import { ElNotification } from "element-plus";

const handleUpload = async (options) => {
  options.onProgress({ percent: 0 });
  // 获取文件的md5
  const fileMd5 = await MD5LargeFile(options.file, (p) => {
    const progress = parseInt(p * 100);
    options.onProgress({ percent: 100 - progress });
  });
  const upload = await fileUploadBefore({
    name: options.file.name,
    md5: fileMd5,
    size: options.file.size,
  });
  if (
    typeof upload.partCount !== "number" ||
    typeof upload.partSize !== "number"
  ) {
    throw new Error("服务器返回错误数据");
  }
  //   处理文件上传
  const countPart = Math.floor(options.file.size / upload.partSize);
  for (
    let currentPart = upload.partCount;
    currentPart <= countPart;
    currentPart += 1
  ) {
    const start = currentPart * upload.partSize;
    const end = start + upload.partSize;
    const uploadData = options.file.slice(start, end);

    const formData = new FormData();
    formData.append("currentPart", currentPart);
    formData.append("uploadID", fileMd5);
    formData.append("uploadData", uploadData);
    await fileUploadPart(formData);
    options.onProgress({ percent: parseInt((currentPart / countPart) * 100) });
  }
};

const handleUploadCatch = async (options) => {
  try {
    await handleUpload(options);
  } catch (error) {
    console.error(error);
    ElNotification({
      title: options.file.name,
      message: error.response?.data ?? error.message,
      type: "error",
      duration: 0,
    });
    throw error;
  }
};
</script>
