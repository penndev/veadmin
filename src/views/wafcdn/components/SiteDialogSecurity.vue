<template>
  <div class="security-list">
    <!-- 开启IP限制 -->
    <el-form-item label="开启IP限制" prop="security.ip.status">
      <el-switch
        v-model="security.ip.status"
        inline-prompt
        active-icon="Check"
        inactive-icon="Close"
      />
    </el-form-item>
    <el-card v-if="security.ip.status" shadow="never" class="ip-card">
      <IPRegionSelect v-model="security.ip.region" />
      <el-switch
        size="large"
        v-model="security.ip.allowed"
        inline-prompt
        style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
        active-text="允许以上地区访问"
        inactive-text="限制以上地区访问"
      />
    </el-card>

    <!-- 开启速率限制 -->
    <el-form-item label="开启速率限制" prop="security.limit.status">
      <el-switch
        v-model="security.limit.status"
        inline-prompt
        active-icon="Check"
        inactive-icon="Close"
      />
    </el-form-item>
    <el-card v-if="security.limit.status" shadow="never" class="security-card">
      <el-form-item label="单链接限速 k/s" prop="security.limit.rate">
        <el-input-number v-model="security.limit.rate" />
      </el-form-item>
      <el-form-item label="请求速率" prop="security.limit">
        <span class="rate-line">
          <el-input-number :min="1" v-model="security.limit.seconds" />
          秒内最多
          <el-input-number :min="10" v-model="security.limit.queries" />
          次
        </span>
      </el-form-item>
    </el-card>

    <!-- 开启接口验签 -->
    <el-form-item label="开启接口验签" prop="security.sign.status">
      <el-switch
        v-model="security.sign.status"
        inline-prompt
        active-icon="Check"
        inactive-icon="Close"
      />
    </el-form-item>
    <el-card v-if="security.sign.status" shadow="never" class="security-card">
      <el-form-item label="加密密钥" prop="security.sign.key">
        <el-input v-model="security.sign.key" />
      </el-form-item>
      <el-form-item label="加密方法" prop="security.sign.method">
        <el-select v-model="security.sign.method" placeholder="加密方法">
          <el-option key="HMAC_MD5" label="HMAC_MD5算法" value="HMAC_MD5" />
          <el-option key="HMAC_SHA1" label="HMAC_SHA1算法" value="HMAC_SHA1" />
          <el-option
            key="HMAC_SHA256"
            label="HMAC_SHA256算法"
            value="HMAC_SHA256"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="过期时间/参数名" prop="security.sign.expire_args">
        <el-input v-model="security.sign.expire_args" />
      </el-form-item>
      <el-form-item label="签名/参数名" prop="security.sign.sign_args">
        <el-input v-model="security.sign.sign_args" />
      </el-form-item>
    </el-card>

    <!-- 开启跨域处理 -->
    <el-form-item label="开启跨域处理" prop="security.cors.status">
      <el-switch
        v-model="security.cors.status"
        inline-prompt
        active-icon="Check"
        inactive-icon="Close"
      />
    </el-form-item>
    <el-card v-if="security.cors.status" shadow="never" class="security-card">
      <el-form-item label="允许请求来源" prop="security.cors.origin">
        <el-input
          v-model="security.cors.origin"
          placeholder="Access-Control-Allow-Origin"
        />
      </el-form-item>
      <el-form-item label="允许请求方法" prop="security.cors.method">
        <el-input
          v-model="security.cors.method"
          placeholder="Access-Control-Allow-Methods"
        />
      </el-form-item>
      <el-form-item label="允许请求头" prop="security.cors.header">
        <el-input
          v-model="security.cors.header"
          placeholder="Access-Control-Allow-Headers"
        />
      </el-form-item>
      <el-form-item label="跨域请求凭据" prop="security.cors.credentials">
        <el-input
          v-model="security.cors.credentials"
          placeholder="Access-Control-Allow-Credentials"
        />
      </el-form-item>
      <el-form-item label="跨域状态缓存/秒" prop="security.cors.age">
        <el-input-number
          v-model="security.cors.age"
          placeholder="Access-Control-Max-Age"
        />
      </el-form-item>
    </el-card>

    <el-form-item label="人机JS验证" prop="security.captcha">
      <el-switch
        v-model="security.captcha"
        inline-prompt
        active-icon="Check"
        inactive-icon="Close"
      />
    </el-form-item>
  </div>
</template>

<script setup>
import IPRegionSelect from "./IPRegionSelect.vue";

const security = defineModel();
</script>

<style scoped>
.security-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.security-card {
  margin: 0 0 8px 120px;
}
.security-card :deep(.el-card__body) {
  padding: 14px 16px 2px;
}
.ip-card {
  margin: 0 0 8px 120px;
}
.ip-card :deep(.el-card__body) {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.rate-line {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
