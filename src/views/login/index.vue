
<template>
  <div id="userLayout">
    <div class="login_panle">
      <div class="login_panle_form">

        <div class="login_panle_form_title">

          <img class="login_panle_form_title_logo" src="@/assets/logo.svg" />

          <div class="login_panle_form_title_p" >
            用户登录
          </div>

        </div>

        <el-form ref="loginForm" v-model="formData" >
          <el-form-item prop="username">
            <el-input v-model="formData.username" placeholder="请输入用户名" >
              <template #suffix>
                <span class="input-icon">
                  <el-icon><User /></el-icon>
                </span>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              placeholder="请输入密码"
              v-model="formData.password"
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
          <el-form-item prop="captcha">
            <div class="vPicBox">
              <el-input
                v-model="formData.captcha"
                placeholder="请输入验证码"
                style="width: 60%"
              />
              <div class="vPic">
                <img alt="请输入验证码"
                  :src="captcha"
                  @click="handleChangeCaptcha"
                >
              </div>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary" size="large" style="width: 46%;"
              @click="formSubmit(formData)"
            >
              登 录
            </el-button>
          </el-form-item>
        </el-form>

      </div>
      <div class="login_panle_right" />
    </div>
  </div>
</template>

<script setup>
import { permissionStoe } from '@/stores'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

// 处理用户登录成功后的操作
const permission = permissionStoe()
const router = useRouter()

// 密码
const lock = ref('lock')
const handleChangeLock = () => {
  lock.value = lock.value === 'lock' ? 'unlock' : 'lock'
}

// 图片验证码
const captcha = ref('https://img0.baidu.com/it/u=2973059902,1235913705&fm=253&fmt=auto?w=240&h=120')
const handleChangeCaptcha = () => {
  captcha.value = ''
}

const formData = ref({
  username: '',
  password: '',
  captcha: ''
})

const formSubmit = (form) => {
  console.log(form)
  // 登录成功后需要处理的操作。
  permission.token = 'dev'
  router.push('/')
}

</script>

<style lang="scss" scoped>
#userLayout {
    // margin: 0;
    // padding: 0;
    background-image: url("@/assets/login/login_background.jpg");
    background-size: cover;
    width: 100%;
    height: 100%;
    // border: 3px solid red;
    // position: relative;
    .input-icon{
        padding-right: 6px;
        padding-top: 4px;
    }
    .login_panle {
        width: 96vw;
        height: 100vh;
        background-color: rgba(255, 255, 255, .8);
        backdrop-filter: blur(5px);
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        .login_panle_right {
            // background-image: url("@/assets/vue.svg");
            background-image: url("@/assets/logo-with-shadow.png");
            background-size: cover;
            width: 40%;
            height: 60%;
            float: right !important;
        }
        .login_panle_form {
            width: 420px;
            background-color: #fff;
            padding: 40px 40px 40px 40px;
            border-radius: 10px;
            box-shadow: 2px 3px 7px rgba(0, 0, 0, .2);
            .login_panle_form_title {
                display: flex;
                align-items: center;
                margin: 30px 0;
                .login_panle_form_title_logo {
                    width: 90px;
                    height: 72px;
                }
                .login_panle_form_title_p {
                    font-size: 40px;
                    padding-left: 20px;
                }
            }
            .vPicBox{
                display:flex;
                justify-content:space-between;
                width:100%;
            }
            .vPic {
                width: 33%;
                height: 38px;
                background: #ccc;
                img {
                    width: 100%;
                    height: 100%;
                    vertical-align: middle;
                }
            }
        }
        // .login_panle_foot {
        //     position: absolute;
        //     bottom: 20px;
        //     .links {
        //         display: flex;
        //         align-items: center;
        //         justify-content: space-between;
        //         .link-icon {
        //             width: 30px;
        //             height: 30px;
        //         }
        //     }
        //     .copyright {
        //         color: #777777;
        //         margin-top: 5px;
        //     }
        // }
    }
}

//小屏幕不显示右侧，将登陆框居中
@media (max-width: 750px) {
    .login_panle_right {
        display: none;
    }
    .login_panle {
        margin-left: 2vw;
    }
    .login_panle_form {
        width: 100%;
    }
}

</style>
