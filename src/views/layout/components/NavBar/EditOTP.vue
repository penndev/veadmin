<template>
  <el-dropdown-item
    icon="Check"
    @click="dialog.visible = true"
  >
    两步验证
  </el-dropdown-item>

  <el-drawer
    v-model="dialog.visible"
    :title="dialog.title"
    :close-on-click-modal="false"
    append-to-body
    destroy-on-close
    close-on-press-escape
    center
  >
    <el-steps
      :active="dialog.active"
      align-center
      finish-status="success"
    >
      <el-step title="创建验证器" />
      <el-step title="验证安装状态" />
      <el-step title="保存验证器" />
    </el-steps>

    <div
      v-if="dialog.active === 1"
    >
      <p
        style="text-align: left; margin-bottom: 10px;"
      >
        <strong>使用的应用程序步骤介绍：</strong><br>
        1. 下载并安装OTP验证器(Google Authenticator, 腾讯身份验证器等)<br>
        2. 打开应用程序，点击“+”按钮添加新账户。<br>
        3. 选择“扫描条形码”并使用手机扫描下方的二维码。<br>
        4. 谷歌验证器会生成一个动态验证码，输入该验证码完成绑定。<br>
      </p>
      <img
        :src="`https://api.qrserver.com/v1/create-qr-code/?data=${dialog.otp.uri}&size=150x150`"
        alt="验证器参数"
        style="margin-bottom: 10px; border: 1px solid gray; border-radius: 5px; width: 150px;"
      >
    </div>

    <el-form
      ref="dialogRef"
      :model="dialog.form"
      :rules="dialog.formRule"
      label-width="auto"
      label-position="left"
      style="margin-top: 30px;"
    >
      <el-form-item
        v-if="dialog.active === 0"
        label="验证器名称"
        prop="otpTitle"
      >
        <el-col :span="12">
          <el-input
            v-model="dialog.form.otpTitle"
            placeholder="验证器名称"
          />
        </el-col>
        <el-col :span="3" />
        <el-col :span="6">
          <el-button
            type="primary"
            @click="handleAddOtpSecret"
          >
            下一步
          </el-button>
        </el-col>
      </el-form-item>

      <el-form-item
        v-if="dialog.active === 1"
        label="验证器口令"
      >
        <el-col :span="10">
          <el-input
            v-model="dialog.otp.code"
            type="number"
            max="999999"
            min="100000"
            placeholder="请输入验证码"
          />
        </el-col>
        <el-col :span="3" />
        <el-col :span="6">
          <el-button
            type="primary"
            @click="handleVerifyOtpSecret"
          >
            下一步
          </el-button>
        </el-col>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialog.visible = false">取消</el-button>
        <el-button
          v-if="dialog.active === 2"
          type="primary"
          @click="handleSubmitForm"
        >保存验证器</el-button>
      </span>
    </template>
  </el-drawer>
</template>

<script setup>
import { ref } from 'vue'
import { changeOTP } from '@/apis/login'
import { ElMessage } from 'element-plus'
import { getOTPSecret, verifyOTPSecret } from '@/apis/system/administrator'

const dialogRef = ref(null)
const dialog = ref({
  visible: false,
  title: 'OTP设备管理',
  active: 0,
  form: {
    otpTitle: '',
    otpSecret: ''
  },
  otp: { // 二维码数据
    uri: '', // 二维码文本内容
    code: null, // 二维码验证码
    secret: null // 二维码密钥
  }
})

const handleAddOtpSecret = () => { // 发送请求添加两步验证
  getOTPSecret({
    topic: import.meta.env.VE_NAME,
    title: dialog.value.form.otpTitle
  }).then((result) => {
    dialog.value.otp.secret = result.secret
    dialog.value.otp.uri = result.uri
    dialog.value.active = 1
  })
}

const handleVerifyOtpSecret = () => { // 验证两步验证
  if (dialog.value.otp.code == null) {
    ElMessage.error('请输入验证码')
    return
  }
  verifyOTPSecret({ code: dialog.value.otp.code, secret: dialog.value.otp.secret }).then((result) => {
    console.log(result)
    ElMessage.success('验证成功')
    dialog.value.form.otpSecret = dialog.value.otp.secret
    dialog.value.active = 2
  })
}

const handleSubmitForm = () => {
  // 提交数据
  dialogRef.value.validate((validate) => {
    if (validate) {
      changeOTP(dialog.value.form).then((result) => {
        ElMessage.info(result)
        dialog.value.visible = false
      })
    }
  })
}

</script>
