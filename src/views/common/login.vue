<template>
  <div class="site-wrapper site-page--login">
    <div class="site-content__wrapper">
      <div class="site-content">
        <div class="brand-info">
          <h2 class="brand-info__text">VenusAdmin</h2>
          <p class="brand-info__intro">
            VenusAdmin基于Vue3、Element
            Plus构建开发，实现VenusFast后台管理前端功能，提供一套更优的前端解决方案。
          </p>
        </div>
        <div class="login-main">
          <div class="login-title">欢迎登录VenusAdmin</div>
          <div class="login-ways">
            <div
              :class="['way-item', activeWay === 0 ? 'way-item-active' : '']"
              @click="changeLoginWay(0)"
            >
              账号密码登录
            </div>
            <div
              :class="['way-item', activeWay === 1 ? 'way-item-active' : '']"
              @click="changeLoginWay(1)"
            >
              手机/邮箱登录
            </div>
          </div>
          <template v-if="activeWay === 0">
            <el-form
              :model="dataForm"
              :rules="dataRule"
              ref="dataFormRef"
              @keyup.enter="dataFormSubmit()"
            >
              <el-form-item prop="account">
                <el-input
                  v-model="dataForm.account"
                  placeholder="帐号"
                  size="large"
                ></el-input>
              </el-form-item>
              <el-form-item prop="secretKey">
                <el-input
                  v-model="dataForm.secretKey"
                  type="password"
                  size="large"
                  placeholder="密码"
                ></el-input>
              </el-form-item>
              <el-form-item prop="captcha">
                <el-row :gutter="20">
                  <el-col :span="14">
                    <el-input
                      v-model="dataForm.captcha"
                      placeholder="验证码"
                    ></el-input>
                  </el-col>
                  <el-col :span="10" class="login-captcha">
                    <img :src="captchaPath" @click="getCaptcha()" alt="" />
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item>
                <el-button
                  class="login-btn-submit"
                  type="primary"
                  size="large"
                  @click="dataFormSubmit()"
                >
                  登录
                </el-button>
              </el-form-item>
            </el-form>
          </template>
          <template v-if="activeWay === 1">
            <el-form
              :model="dataForm"
              :rules="dataRule"
              ref="dataFormRef"
              @keyup.enter="msgCodeLogin()"
            >
              <el-form-item prop="account">
                <el-input
                  v-model="dataForm.account"
                  placeholder="手机号/邮箱"
                  size="large"
                ></el-input>
              </el-form-item>
              <el-form-item prop="captcha">
                <el-row :gutter="20">
                  <el-col :span="14">
                    <el-input
                      v-model="dataForm.captcha"
                      placeholder="图片验证码"
                    ></el-input>
                  </el-col>
                  <el-col :span="10" class="login-captcha">
                    <img :src="captchaPath" @click="getCaptcha()" alt="" />
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item prop="secretKey">
                <el-input
                  v-model="dataForm.secretKey"
                  placeholder="手机号/邮箱验证码"
                  autocomplete="off"
                />
                <div
                  :class="['captcha-wrapper', timerId ? 'captcha-disable' : '']"
                  @click="getMsgCode()"
                >
                  {{ timerId ? `重新获取(${timer}s)` : '获取验证码' }}
                </div>
              </el-form-item>
              <el-form-item>
                <el-button
                  class="login-btn-submit"
                  type="primary"
                  size="large"
                  @click="msgCodeLogin()"
                >
                  登录
                </el-button>
              </el-form-item>
            </el-form>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getUUID } from '@/utils'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCommonStore } from '@/store'
import { venusServer } from '@/utils/http'
import { loginApi } from '@/api/login-api'
import { commonApi } from '@/api/common-api'
import { ElMessage } from 'element-plus'

const commonStore = useCommonStore()

const dataForm = reactive({
  account: '',
  uuid: '',
  captcha: '',
  secretKey: ''
})

const dataRule = {
  account: [
    {
      required: true,
      message: '帐号不能为空',
      trigger: 'blur'
    }
  ],
  secretKey: [
    {
      required: true,
      message: '密钥不能为空',
      trigger: 'blur'
    }
  ],
  captcha: [
    {
      required: true,
      message: '图片验证码不能为空',
      trigger: 'blur'
    }
  ]
}

const captchaPath = ref('')

const getCaptcha = () => {
  dataForm.uuid = getUUID()
  captchaPath.value = `${venusServer}/captcha?uuid=${dataForm.uuid}`
}

getCaptcha()

const router = useRouter()
const dataFormRef = ref()
const dataFormSubmit = () => {
  dataFormRef.value.validate((valid) => {
    if (valid) {
      loginApi(dataForm)
        .then(async ({ token }) => {
          commonStore.updateToken(token)
          await router.push({
            name: 'main-dynamic'
          })
        })
        .catch(() => {
          getCaptcha()
        })
    }
  })
}

const msgCodeLogin = () => {
  dataFormRef.value.validate((valid) => {
    if (valid) {
      commonApi('/codeLogin', dataForm, { method: 'post' })
        .then(async ({ token }) => {
          commonStore.updateToken(token)
          await router.push({
            name: 'main-dynamic'
          })
        })
        .catch(() => {
          getCaptcha()
        })
    }
  })
}

const activeWay = ref(0)
const changeLoginWay = (way) => {
  if (activeWay.value !== way) {
    getCaptcha()
    activeWay.value = way
  }
}

const timer = ref(0)
const timerId = ref(null)

const getMsgCode = () => {
  commonApi('/code', dataForm, { method: 'post' })
    .then(() => {
      ElMessage.success('验证码发送成功')
      createInterval()
    })
    .catch(() => {
      getCaptcha()
    })
}

const clearIntervalTimer = () => {
  if (timerId.value) {
    timer.value = 60
    clearInterval(timerId.value)
    timerId.value = undefined
  }
}

const createInterval = () => {
  clearIntervalTimer()
  timerId.value = setInterval(() => {
    timer.value = timer.value - 1
    if (timer.value <= 0) {
      clearIntervalTimer()
    }
  }, 1000)
}

onBeforeUnmount(() => {
  clearIntervalTimer()
})
</script>

<style lang="scss" scoped>
.site-wrapper.site-page--login {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: hidden;

  &:before {
    position: fixed;
    top: 0;
    left: 0;
    z-index: -1;
    width: 100%;
    height: 100%;
    content: '';
    background-size: cover;
    background-image: url(@/assets/img/login-bg.webp);
  }

  .site-content__wrapper {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    padding: 0;
    margin: 0;
    overflow-x: hidden;
    overflow-y: auto;
    background-color: transparent;
  }

  .site-content {
    min-height: 100%;
    padding: 30px 500px 30px 30px;
  }

  .brand-info {
    margin: 120px 100px 0 90px;
    color: #fff;
  }

  .brand-info__text {
    margin: 0 0 22px 0;
    font-size: 48px;
    font-weight: 400;
  }

  .brand-info__intro {
    margin: 10px 0;
    font-size: 16px;
    line-height: 1.58;
    opacity: 0.6;
  }

  .login-main {
    position: absolute;
    top: 0;
    right: 0;
    width: 474px;
    min-height: 100%;
    background-color: #fff;
    padding: 180px 60px 180px;
  }

  .login-title {
    height: 44px;
    font-size: 32px;
    font-weight: 600;
    color: #333333;
    line-height: 44px;
    margin-bottom: 32px;
  }

  .login-ways {
    position: relative;
    display: grid;
    grid-gap: 0 48px;
    width: max-content;
    margin-bottom: 32px;
    grid-auto-flow: column;
    grid-auto-columns: max-content;

    .way-item {
      height: 26px;
      cursor: pointer;
      font-size: 18px;
      color: #999999;
      font-weight: 500;
      line-height: 26px;
      text-align: center;

      &-active {
        position: relative;
        color: #2c79ff;

        &:after {
          position: absolute;
          bottom: -8px;
          width: 20px;
          height: 3px;
          content: '';
          left: 50%;
          border-radius: 2px;
          background-color: #2c79ff;
          transform: translateX(-50%);
        }
      }
    }

    &:after {
      position: absolute;
      width: 1px;
      height: 18px;
      content: '';
      right: 50%;
      top: 50%;
      border-radius: 1px;
      background-color: #d8d8d8;
      transform: translate(-50%, -50%);
    }
  }

  .login-captcha {
    overflow: hidden;

    > img {
      width: 100%;
      cursor: pointer;
    }
  }

  .login-btn-submit {
    width: 100%;
    margin-top: 38px;
  }

  .captcha-wrapper {
    position: absolute;
    right: 16px;
    top: 8px;
    height: 24px;
    line-height: 24px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    color: rgba(44, 121, 255, 1);
  }

  .captcha-disable {
    color: #bcbcbc;
  }
}
</style>
