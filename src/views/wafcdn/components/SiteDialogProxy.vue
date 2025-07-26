<template>
  <br />
  <!-- 回源设置 -->
  <el-card shadow="always">
    <template #header>
      <div class="card-header">
        <span>回源设置</span>
      </div>
    </template>
    <el-form-item label="主机" prop="proxy.server">
      <InputServer v-model="proxy.server" />
    </el-form-item>
    <el-form-item label="Host" prop="proxy.host">
      <el-input v-model="proxy.host" />
    </el-form-item>
    <div class="card-header">
      <span>回源请求头</span>
    </div>
    <el-row v-for="(value, index) in proxy.header" :key="index" :gutter="10">
      <el-col :span="11">
        <el-input v-model="value.name" placeholder="名" />
      </el-col>

      <el-col :span="11">
        <el-input v-model="value.value" placeholder="值" />
      </el-col>
      <el-col :span="2" style="text-align: center">
        <el-button
          type="danger"
          icon="Delete"
          circle
          @click="proxy.header.splice(index, 1)"
        />
      </el-col>
      <el-col :span="24" style="height: 5px" />
    </el-row>
    <el-button
      type="primary"
      icon="Plus"
      circle
      @click="proxy.header.push({ name: null, value: null })"
    />
  </el-card>

  <br />
  <el-card shadow="always">
    <template #header>
      <div class="card-header">
        <span>连接池</span>
      </div>
    </template>
    <el-form-item label="连接数" prop="proxy.keepalive_requests">
      <el-input-number v-model="proxy.keepalive_requests" :controls="false" />
    </el-form-item>
    <el-form-item label="超时时间" prop="proxy.keepalive_timeout">
      <el-input-number v-model="proxy.keepalive_timeout" :controls="false" />
    </el-form-item>
  </el-card>

  <br />
  <el-card shadow="always">
    <template #header>
      <div class="card-header">
        <span>缓存设置</span>
      </div>
    </template>

    <el-tag>时/秒: 3600</el-tag> &nbsp; <el-tag>周/秒: 86400</el-tag> &nbsp;
    <el-tag>月/秒: 604800</el-tag> &nbsp;
    <el-tag>年/秒: 31536000</el-tag> &nbsp;
    <el-divider />

    <el-row
      v-for="(value, index) in proxy.cache"
      :key="index"
      style="margin: 5px auto"
      :gutter="10"
    >
      <el-col :md="6">
        <el-input v-model="value.ruth" placeholder="路径/regex" />
      </el-col>
      <el-col :md="3">
        <el-switch
          v-model="value.args"
          inline-prompt
          style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
          active-text="保留GET参数"
          inactive-text="忽略GET参数"
        />
      </el-col>
      <el-col :md="5">
        <el-input-number
          v-model="value.time"
          :controls="false"
          placeholder="缓存时间/s"
        />
        <el-tag>{{ secFormat(value.time) }}</el-tag>
      </el-col>
      <el-col :md="4">
        <el-select v-model="value.method" multiple placeholder="请求方法">
          <el-option key="GET" label="GET" value="GET" />
          <el-option key="POST" label="POST" value="POST" />
          <el-option key="PUT" label="PUT" value="PUT" />
          <el-option key="DELETE" label="DELETE" value="DELETE" />
          <el-option key="PATCH" label="PATCH" value="PATCH" />
          <el-option key="HEAD" label="HEAD" value="HEAD" />
          <el-option key="OPTIONS" label="OPTIONS" value="OPTIONS" />
        </el-select>
      </el-col>
      <el-col :md="4">
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
      </el-col>
      <el-col :md="2" style="text-align: right">
        <el-button
          type="danger"
          icon="Delete"
          circle
          @click="proxy.cache.splice(index, 1)"
        />
      </el-col>
      <el-divider />
    </el-row>

    <el-button
      type="primary"
      icon="Plus"
      circle
      @click="
        proxy.cache.push({
          ruth: null,
          args: true,
          time: null,
          method: [],
          status: [],
        })
      "
    />
  </el-card>
</template>
<script setup>
import { secFormat } from "penndev/utils";
import InputServer from "./InputServer.vue";

const proxy = defineModel();
</script>
