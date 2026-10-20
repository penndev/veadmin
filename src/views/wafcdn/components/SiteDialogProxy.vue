<template>
  <el-card shadow="never" class="proxy-block">
    <template #header>
      <div class="card-header">
        <span>回源设置</span>
      </div>
    </template>
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
    <p class="proxy-sub">回源请求头</p>
    <div v-for="(value, index) in proxy.header" :key="index" class="header-row">
      <el-input v-model="value.name" placeholder="名称" />
      <el-input v-model="value.value" placeholder="值" />
      <el-button link type="danger" @click="proxy.header.splice(index, 1)">
        删除
      </el-button>
    </div>
    <el-button @click="proxy.header.push({ name: '', value: '' })">
      添加请求头
    </el-button>
  </el-card>

  <el-card shadow="never" class="proxy-block">
    <template #header>
      <div class="card-header">
        <span>连接池</span>
      </div>
    </template>
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
      label="超时时间/秒"
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
  </el-card>

  <el-card shadow="never" class="proxy-block">
    <template #header>
      <div class="card-header">
        <span>缓存设置</span>
      </div>
    </template>

    <el-form-item label="快捷清理" :prop="propPrefix + '.cache_purge'">
      <el-switch
        v-model="proxy.cache_purge"
        :active-value="true"
        active-text="允许快捷清理"
        :inactive-value="false"
        inactive-text="不允许清理"
      />
    </el-form-item>

    <p class="cache-hint">1 小时 3600 秒，1 天 86400 秒，7 天 604800 秒。</p>

    <div v-for="(value, index) in proxy.cache" :key="index" class="cache-rule">
      <div class="cache-rule-main">
        <el-input v-model="value.ruth" placeholder="路径 /regex" />
        <el-input-number
          v-model="value.time"
          :controls="false"
          placeholder="秒"
        />
        <span class="cache-age">{{ secFormat(value.time) }}</span>
        <el-button link type="danger" @click="proxy.cache.splice(index, 1)">
          删除
        </el-button>
      </div>
      <div class="cache-rule-extra">
        <el-switch
          v-model="value.args"
          inline-prompt
          active-text="保留参数"
          inactive-text="忽略参数"
        />
        <el-select v-model="value.method" multiple placeholder="请求方法">
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
      </div>
    </div>

    <el-button
      @click="
        proxy.cache.push({
          ruth: null,
          args: true,
          time: null,
          method: [],
          status: [],
        })
      "
    >
      添加缓存规则
    </el-button>
  </el-card>
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
.header-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}
.header-row .el-input {
  flex: 1;
}
.proxy-block {
  margin-top: 12px;
}
.proxy-block :deep(.el-card__header) {
  padding: 10px 16px;
}
.proxy-block :deep(.el-card__body) {
  padding: 14px 16px;
}
.proxy-sub {
  margin: 4px 0 8px;
  font-size: 13px;
  color: var(--el-text-color-secondary);
}
.cache-hint {
  margin: 0 0 8px;
  font-size: 13px;
  color: var(--el-text-color-secondary);
}
.cache-rule {
  padding: 10px 0;
  border-top: 1px solid var(--el-border-color-lighter);
}
.cache-rule-main,
.cache-rule-extra {
  display: flex;
  align-items: center;
  gap: 8px;
}
.cache-rule-extra {
  margin-top: 8px;
}
.cache-rule-main .el-input {
  flex: 1;
}
.cache-rule-main .el-input-number {
  width: 110px;
}
.cache-rule-extra .el-select {
  flex: 1;
}
.cache-age {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  white-space: nowrap;
}
</style>
