<template>
  <div class="url-input-container">
    <el-select v-model="protocol" style="width: 120px">
      <el-option label="http:" value="http:" />
      <el-option label="https:" value="https:" />
    </el-select>
    //
    <el-input
      v-model="domain"
      placeholder="域名或IP"
      style="width: 200px"
      input-style="border: 0"
    />
    :
    <el-input
      v-model="port"
      placeholder="端口"
      type="number"
      style="width: 80px"
    />
    <el-input
      v-model="path"
      placeholder="路径 /api"
      style="width: 160px; margin-left: 8px"
    />
    <el-tag type="info" style="margin-left: 12px">
      完整URL: {{ modelValue }}
    </el-tag>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";

// 解析URL到各个部分
const protocol = ref("");
const domain = ref("");
const port = ref("");
const path = ref("");

const url = defineModel();

const buildURL = () => {
  let value = protocol.value + "//" + domain.value + ":" + port.value;
  let next = String(path.value || "").trim();
  if (next !== "") {
    if (!next.startsWith("/")) {
      next = "/" + next;
    }
    next = next.replace(/\/+$/, "");
    value += next;
  }
  url.value = value;
};

// 初始化时解析URL
onMounted(() => {
  try {
    const urlObj = new URL(url.value);
    protocol.value = urlObj.protocol;
    domain.value = urlObj.hostname;
    port.value = urlObj.port;
    path.value =
      urlObj.pathname === "/" ? "" : urlObj.pathname.replace(/\/+$/, "");
    if (!port.value) {
      port.value = protocol.value === "http:" ? "80" : "443";
    }
  } catch {
    // 如果URL无效，使用默认值
    protocol.value = "http:";
    domain.value = "";
    port.value = 80;
    path.value = "";
  }
  watch(protocol, () => {
    protocol.value == "http:" ? (port.value = "80") : (port.value = "443");
    buildURL();
  });
  watch(port, () => {
    buildURL();
  });
  watch(domain, () => {
    buildURL();
  });
  watch(path, () => {
    buildURL();
  });
});
</script>
