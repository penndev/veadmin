<template>
  <div class="url-row">
    <el-select v-model="protocol" class="url-scheme">
      <el-option label="http" value="http:" />
      <el-option label="https" value="https:" />
    </el-select>
    <el-input v-model="domain" placeholder="域名或 IP" />
    <el-input v-model="port" placeholder="端口" class="url-port" />
    <el-input v-model="path" placeholder="路径，可空" class="url-path" />
  </div>
  <p v-if="url" class="url-preview">{{ url }}</p>
  <p class="url-preview">
    路径留空，访客路径原样回源。填写后会换掉这条站点路径的前缀，只填 /
    就是去掉前缀。
  </p>
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
    if (next !== "/") {
      next = next.replace(/\/+$/, "");
    }
    value += next;
  }
  url.value = value;
};

// 初始化时解析URL
onMounted(() => {
  try {
    const raw = String(url.value || "");
    const urlObj = new URL(raw);
    protocol.value = urlObj.protocol;
    domain.value = urlObj.hostname;
    port.value = urlObj.port;
    const slash = raw.indexOf("/", raw.indexOf("://") + 3);
    path.value =
      slash === -1 ? "" : raw.slice(slash).replace(/\/+$/, "") || "/";
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

<style scoped>
.url-row {
  display: flex;
  gap: 8px;
  width: 100%;
}
.url-row > .el-input {
  flex: 1;
  min-width: 0;
}
.url-scheme {
  width: 108px;
  flex: none;
}
.url-row > .url-port,
.url-row > .url-path {
  flex: none;
}
.url-port {
  width: 88px;
}
.url-path {
  width: 148px;
}
.url-preview {
  margin: 6px 0 0;
  font-size: 12px;
  line-height: 1.4;
  color: var(--el-text-color-secondary);
  word-break: break-all;
}
</style>
