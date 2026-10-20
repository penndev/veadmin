<template>
  <div class="proxy">
    <el-form-item
      label="回源地址"
      :prop="propPrefix + '.server'"
      :rules="[{ required: true, message: '请填写回源地址' }]"
    >
      <InputServer v-model="proxy.server" />
    </el-form-item>
    <el-form-item label="Host" :prop="propPrefix + '.host'">
      <el-input v-model="proxy.host" />
    </el-form-item>
    <el-form-item label="请求头">
      <div class="stack">
        <div v-if="proxy.header.length" class="cols head-cols">
          <span>名称</span>
          <span>值</span>
          <span></span>
        </div>
        <div v-for="(value, index) in proxy.header" :key="index" class="cols">
          <el-input v-model="value.name" placeholder="名称" />
          <el-input v-model="value.value" placeholder="值" />
          <el-button link type="danger" @click="proxy.header.splice(index, 1)">
            删除
          </el-button>
        </div>
        <el-button @click="proxy.header.push({ name: '', value: '' })">
          添加请求头
        </el-button>
      </div>
    </el-form-item>
    <el-form-item
      label="连接数"
      :prop="propPrefix + '.keepalive_requests'"
      :rules="[{ required: true, message: '必须设置连接数10-10000' }]"
    >
      <el-input-number
        :min="10"
        :max="10000"
        v-model="proxy.keepalive_requests"
        :controls="false"
      />
    </el-form-item>
    <el-form-item
      label="超时/秒"
      :prop="propPrefix + '.keepalive_timeout'"
      :rules="[{ required: true, message: '必须设置超时时间5-300秒' }]"
    >
      <el-input-number
        :min="5"
        :max="300"
        v-model="proxy.keepalive_timeout"
        :controls="false"
      />
    </el-form-item>
    <el-form-item label="快捷清理" :prop="propPrefix + '.cache_purge'">
      <el-switch
        v-model="proxy.cache_purge"
        inline-prompt
        active-text="允许"
        inactive-text="关闭"
      />
    </el-form-item>
    <el-form-item label="缓存规则">
      <div class="stack">
        <p class="cache-hint">
          路径是 Lua 正则。点写成 %. ，结尾用 $，横线写成 %-。例如 %.js$ 匹配 js
          文件。3600 秒是 1 小时，86400 秒是 1 天。
        </p>
        <div v-if="proxy.cache.length" class="cache-cols cache-head">
          <span>Lua 正则</span>
          <span>秒</span>
          <span>参数</span>
          <span>方法</span>
          <span>状态码</span>
          <span></span>
        </div>
        <div
          v-for="(value, index) in proxy.cache"
          :key="index"
          class="cache-cols"
        >
          <el-input v-model="value.ruth" placeholder="如 %.js$" />
          <div class="seconds">
            <el-input-number
              v-model="value.time"
              :controls="false"
              placeholder="秒"
            />
            <span class="cache-age">{{ secFormat(value.time) }}</span>
          </div>
          <el-switch
            v-model="value.args"
            inline-prompt
            active-text="保留"
            inactive-text="忽略"
          />
          <el-select
            v-model="value.method"
            multiple
            collapse-tags
            placeholder="方法"
          >
            <el-option key="GET" label="GET" value="GET" />
            <el-option key="POST" label="POST" value="POST" />
            <el-option key="PUT" label="PUT" value="PUT" />
            <el-option key="DELETE" label="DELETE" value="DELETE" />
            <el-option key="PATCH" label="PATCH" value="PATCH" />
            <el-option key="HEAD" label="HEAD" value="HEAD" />
            <el-option key="OPTIONS" label="OPTIONS" value="OPTIONS" />
          </el-select>
          <el-select
            v-model="value.status"
            multiple
            collapse-tags
            filterable
            allow-create
            :reserve-keyword="false"
            placeholder="状态码"
            @change="
              (values) => {
                const intValues = values
                  .map((v) => {
                    const num = typeof v === 'string' ? parseInt(v, 10) : v;
                    return isNaN(num) ? null : num;
                  })
                  .filter((v) => v !== null);
                value.status = [...new Set(intValues)];
              }
            "
          >
            <el-option key="200" label="200" :value="200" />
            <el-option key="301" label="301" :value="301" />
          </el-select>
          <el-button link type="danger" @click="proxy.cache.splice(index, 1)">
            删除
          </el-button>
        </div>
        <el-button
          @click="
            proxy.cache.push({
              ruth: '',
              args: true,
              time: null,
              method: ['GET'],
              status: [200],
            })
          "
        >
          添加缓存规则
        </el-button>
      </div>
    </el-form-item>
  </div>
</template>
<script setup>
import { secFormat } from "penndev/utils";
import InputServer from "./InputServer.vue";

const proxy = defineModel();

defineProps({
  propPrefix: {
    type: String,
    default: "proxy",
  },
});
</script>

<style scoped>
.stack {
  width: 100%;
}
.cols,
.cache-cols {
  display: grid;
  gap: 8px;
  align-items: center;
  margin-bottom: 8px;
}
.cols {
  grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr) 48px;
}
.cache-cols {
  grid-template-columns:
    minmax(120px, 1.4fr) 148px 64px minmax(96px, 1fr)
    minmax(88px, 0.9fr) 36px;
}
.head-cols,
.cache-head {
  margin-bottom: 6px;
  font-size: 12px;
  line-height: 1;
  color: var(--el-text-color-secondary);
}
.cache-hint {
  margin: 0 0 8px;
  font-size: 13px;
  line-height: 1.5;
  color: var(--el-text-color-secondary);
}
.seconds {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
}
.seconds .el-input-number {
  width: 88px;
  flex: none;
}
.cache-cols :deep(.el-select) {
  width: 100%;
}
.cache-age {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  white-space: nowrap;
}
</style>
