<template>
  <div class="url-input-container">
    <el-select v-model="protocol" style="width: 120px" @change="updateFullUrl">
      <el-option label="http:" value="http:" />
      <el-option label="https:" value="https:" />
    </el-select>
    //
    <el-input
      v-model="domain"
      placeholder="域名或IP"
      style="width: 200px"
      input-style="border: 0"
      @input="updateFullUrl"
    />
    :
    <el-input
      v-model="port"
      placeholder="端口"
      type="number"
      style="width: 80px"
      @input="updateFullUrl"
    />
    <el-tag v-if="showFullUrl" type="info" style="margin-left: 12px">
      完整URL: {{ modelValue }}
    </el-tag>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  showFullUrl: {
    type: Boolean,
    default: true,
  },
});

// 解析URL到各个部分
const protocol = ref("");
const domain = ref("");
const port = ref("");
const parseUrl = (url) => {
  console.log(url);
  try {
    const urlObj = new URL(url);
    protocol.value = urlObj.protocol;
    domain.value = urlObj.hostname;
    if (urlObj.port == "") {
      if (protocol.value == "http:") {
        port.value = "80";
      } else {
        port.value = "443";
      }
    } else {
      port.value = urlObj.port;
    }
  } catch {
    // 如果URL无效，使用默认值
    protocol.value = "http:";
    domain.value = "";
    port.value = 80;
  }
};

// 更新完整URL到父级
const emit = defineEmits(["update:modelValue"]);
const updateFullUrl = () => {
  const url = protocol.value + "//" + domain.value + ":" + port.value;
  emit("update:modelValue", url);
};

// 初始化时解析URL
onMounted(() => {
  parseUrl(props.modelValue);
});
</script>
