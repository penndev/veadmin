<template>
  <div id="userLayout">
    <div class="login_panel">
      <div class="login_panel_form">
        <div class="login_panel_form_title">
          <img
            class="login_panel_form_title_logo"
            src="/logo.svg"
          >
          <div class="login_panel_form_title_p">
            用户登录
          </div>
        </div>
        <el-form
          ref="loginForm"
          :rules="rules"
          :model="formData"
        >
          <el-form-item prop="username">
            <el-input
              v-model="formData.username"
              placeholder="请输入用户名"
            >
              <template #suffix>
                <span class="input-icon">
                  <el-icon>
                    <User />
                  </el-icon>
                </span>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="formData.password"
              placeholder="请输入密码"
              :type="lock === 'lock' ? 'password' : 'text'"
            >
              <template #suffix>
                <a class="input-icon">
                  <el-icon>
                    <component
                      :is="lock"
                      @click="handleChangeLock"
                    />
                  </el-icon>
                </a>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item
            ref="captchaForm"
            prop="captcha"
          >
            <div class="vPicBox">
              <el-input
                v-model="formData.captcha"
                placeholder="请输入验证码"
                style="width: 60%"
              />
              <div class="vPic">
                <img
                  alt="验证码"
                  :src="captcha"
                  @click="handleChangeCaptcha"
                >
              </div>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              size="large"
              style="width: 46%;"
              @click="formSubmit"
            >
              登 录
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="login_panel_right" />
    </div>
  </div>
</template>

<script setup>
import { authStore } from '@/stores'
import { useRouter, useRoute } from 'vue-router'
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
// import 接口
import { getCaptcha } from '@/apis/captcha'
import { postLogin, postOTPLogin } from '@/apis/login'

// 密码展示效果
const lock = ref('lock')
const handleChangeLock = () => {
  lock.value = lock.value === 'lock' ? 'unlock' : 'lock'
}

// 默认验证码过期时间
const captchaDefaultExpiredTime = 120 * 1000

// 图片验证码
const captcha = ref('')

let captchaExpired = Date.now()
const handleChangeCaptcha = () => {
  getCaptcha().then((result) => {
    captcha.value = result.captchaURL
    formData.captchaID = result.captchaID
    formData.captcha = null
    if (typeof (formData.captchaExpires) === 'number') {
      captchaExpired = Date.now() + formData.captchaExpires * 1000
    } else {
      captchaExpired = Date.now() + captchaDefaultExpiredTime
    }
  })
}

handleChangeCaptcha()

// 用户登录验证相关

const formData = reactive({
  username: '',
  password: '',
  captchaID: '',
  captcha: ''
})

const rules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 5, message: '用户名最少为5个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码最少为6个字符', trigger: 'blur' }
  ],
  captcha: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 4, message: '验证码长度为四位', trigger: 'change' }
  ]
})

// 处理用户登录相关逻辑
const loginForm = ref(null)
const captchaForm = ref(null)
const permission = authStore()
const router = useRouter()
const route = useRoute()

// 登录成功后处理 多次使用，拆分为函数
const formLoginAction = (result) => {
  if (typeof result.token === 'undefined') {
    ElMessage.error('登录失败，未获取到token！')
    return
  }
  permission.token = result.token
  permission.routes = result.routes
  permission.nickname = result.nickname ?? '未设置昵称'
  router.push(route.query.redirect ?? result.index ?? '/')
}

// otp验证器验证
// 将自己设置为一个函数失败后自己再次调用自己
const formLoginOTP = (result) => {
  ElMessageBox.prompt(`请输入验证器(${result.otpTitle})的密钥`, '两步验证', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    inputPattern: /^[0-9]{6}$/,
    inputErrorMessage: '请输入6位数字'
  }).then(({ value }) => {
    postOTPLogin({ code: value, id: result.id }).then((resultOTP) => {
      formLoginAction(resultOTP)
    }).catch(async () => {
      // await sleep(500)
      // formLoginOTP(result)
    })
  }).catch(() => {
    ElMessage({
      type: 'info',
      message: '请稍后重新登录'
    })
  })
}

const formSubmit = () => {
  // 验证码过期触发失败
  if (Date.now() > captchaExpired) {
    captchaForm.value.validateState = 'error'
    captchaForm.value.validateMessage = '验证码过期 请点击验证码刷新重试'
    return
  }
  loginForm.value.validate((validate) => {
    if (validate) { // 判断表单是否验证通过。
      postLogin(formData).then((result) => {
        // 判断是否需要谷歌验证器登录
        if (result.otpStatus === 1) {
          formLoginOTP(result)
        } else {
          formLoginAction(result)
        }
      }).catch(() => {
        handleChangeCaptcha()
      })
    }
  })
}

</script>

<style lang="scss" scoped>

#userLayout {
  background-image: url("@/assets/login/login_background.jpg");
  background-size: cover;
  width: 100%;
  height: 100%;

  .input-icon {
    padding-right: 6px;
    padding-top: 4px;
  }

  .login_panel {
    width: 96vw;
    height: 100%;
    background-color: rgba(255, 255, 255, .8);
    backdrop-filter: blur(5px);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;

    .login_panel_right {
      background-image: url("@/assets/logo-with-shadow.png");
      background-size: cover;
      width: 40%;
      height: 60%;
      float: right !important;
    }

    .login_panel_form {
      width: 420px;
      background-color: #fff;
      padding: 40px 40px 40px 40px;
      border-radius: 10px;
      box-shadow: 2px 3px 7px rgba(0, 0, 0, .2);

      .login_panel_form_title {
        display: flex;
        align-items: center;
        margin: 30px 0;

        .login_panel_form_title_logo {
          width: 90px;
          height: 72px;
        }

        .login_panel_form_title_p {
          font-size: 40px;
          padding-left: 15px;
        }
      }

      .vPicBox {
        display: flex;
        justify-content: space-between;
        width: 100%;
      }

      .vPic {
        width: 33%;
        height: 38px;
        background: #cccccc88;

        img {
          width: 100%;
          height: 100%;
          vertical-align: middle;
        }
      }
    }
  }
}

//小屏幕不显示右侧，将登陆框居中
@media (max-width: 768px) {
  .login_panel_right {
    display: none;
  }

  .login_panel {
    margin-left: 2vw;
  }

  .login_panel_form {
    width: 100%;
  }
}
</style>
