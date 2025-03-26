<template>
  <div class="url-input-container">
    <el-select
      v-model="protocol"
      style="width: 120px;"
      @change="updateFullUrl"
    >
      <el-option
        label="http://"
        value="http://"
      />
      <el-option
        label="https://"
        value="https://"
      />
    </el-select>

    <el-input
      v-model="domain"
      placeholder="域名或IP"
      style="width: 200px;"
      input-style="border: 0"
      @input="updateFullUrl"
    />
    <el-input
      v-model="port"
      placeholder="端口"
      type="number"
      :min="1"
      :max="65535"
      style="width: 80px"
      @input="updateFullUrl"
    >
      <template #prefix>
        :
      </template>
    </el-input>

    <el-tag
      v-if="showFullUrl"
      type="info"
      style="margin-left: 12px"
    >
      完整URL: {{ modelValue }}
    </el-tag>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    required: true
  },
  showFullUrl: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:modelValue'])

const protocol = ref('http://')
const domain = ref('')
const port = ref('')

// 解析URL到各个部分
const parseUrl = (url) => {
  if (!url) return

  try {
    const urlObj = new URL(url)
    protocol.value = urlObj.protocol + '//'
    domain.value = urlObj.hostname
    port.value = urlObj.port || (urlObj.protocol === 'https:' ? '443' : '80')
  } catch {
    // 如果URL无效，使用默认值
    protocol.value = 'https://'
    domain.value = ''
    port.value = ''
  }
}

// 更新完整URL
const updateFullUrl = () => {
  // 清理输入
  const cleanDomain = domain.value.replace(/^https?:\/\//, '').replace(/\/$/, '')
  const cleanPort = port.value.toString().replace(/\D/g, '')

  // 构建完整URL
  let fullUrl = protocol.value + cleanDomain
  if (cleanPort && cleanPort !== '80' && cleanPort !== '443') {
    fullUrl += ':' + cleanPort
  }

  // 触发更新
  emit('update:modelValue', fullUrl)
}

// 初始化时解析URL
onMounted(() => {
  parseUrl(props.modelValue)
})

// 监听外部URL变化
watch(() => props.modelValue, (newVal) => {
  parseUrl(newVal)
})

</script>
