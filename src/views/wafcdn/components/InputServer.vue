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
      :min="1"
      :max="65535"
      style="width: 80px"
      @input="updateFullUrl"
    />

    <el-tag v-if="showFullUrl" type="info" style="margin-left: 12px">
      完整URL: {{ modelValue }}
    </el-tag>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";

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

const emit = defineEmits(["update:modelValue"]);

const protocol = ref("");
const domain = ref("");
const port = ref("");

// 解析URL到各个部分
const parseUrl = (url) => {
  if (!url) return;

  try {
    const urlObj = new URL(url);
    protocol.value = urlObj.protocol;
    domain.value = urlObj.hostname;
    port.value = urlObj.port || 80;
  } catch {
    // 如果URL无效，使用默认值
    protocol.value = "http:";
    domain.value = "";
    port.value = "";
  }
};

// 更新完整URL
const updateFullUrl = () => {
  const url = protocol.value + "//" + domain.value + ":" + port.value;
  emit("update:modelValue", url);
};

// 初始化时解析URL
onMounted(() => {
  parseUrl(props.modelValue);
});

// 监听外部URL变化
watch(
  () => props.modelValue,
  (newVal) => {
    parseUrl(newVal);
  },
);
</script>
