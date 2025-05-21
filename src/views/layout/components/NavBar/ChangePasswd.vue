<template>
  <el-dropdown-item
    icon="Unlock"
    @click="handleChangePasswd"
  >
    修改密码
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
    <el-form
      ref="dialogRef"
      :model="dialog.form"
      :rules="dialog.formRule"
      label-width="auto"
      label-position="left"
    >
      <el-form-item
        label="密码"
        prop="passwd"
      >
        <el-input
          v-model="dialog.form.passwd"
          type="password"
          show-password
        />
      </el-form-item>
      <el-form-item
        label="新密码"
        prop="newPasswd"
      >
        <el-input
          v-model="dialog.form.newPasswd"
          type="password"
          show-password
        />
      </el-form-item>
      <el-form-item
        label="确认密码"
        prop="conformPasswd"
      >
        <el-input
          v-model="dialog.form.conformPasswd"
          type="password"
          show-password
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialog.visible = false">取消</el-button>
        <el-button
          type="primary"
          @click="handleSubmitForm"
        >确定</el-button>
      </span>
    </template>
  </el-drawer>
</template>

<script setup>
import { ref } from 'vue'
import { changePasswd } from '@/apis/login'
import { ElMessage } from 'element-plus'

const dialogRef = ref(null)
const dialog = ref({
  visible: false,
  title: '修改密码',
  form: {},
  formRule: {
    passwd: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      { min: 6, message: '密码最少为6个字符', trigger: 'blur' }
    ],
    newPasswd: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      { min: 6, message: '密码最少为6个字符', trigger: 'blur' }
    ],
    conformPasswd: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      { min: 6, message: '密码最少为6个字符', trigger: 'blur' },
      {
        validator: (rule, value, callback) => {
          if (value !== dialog.value.form.newPasswd) {
            callback(new Error('两次输入密码不一致'))
          }
          callback()
        },
        trigger: 'blur'
      }
    ]
  }
})

const handleSubmitForm = () => {
  // 提交数据
  dialogRef.value.validate((validate) => {
    if (validate) {
      changePasswd(dialog.value.form).then((result) => {
        ElMessage.info(result)
        dialog.value.visible = false
      })
    }
  })
}

const handleChangePasswd = () => {
  dialog.value.visible = true
}

</script>
