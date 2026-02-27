<template>
  <div class="login-container">
    <div class="login-left">
      <div class="login-intro">
        <h1 class="system-name">AI系统</h1>
        <p class="system-slogan">智能催收 · 高效管理</p>
        <div class="feature-cards">
          <div class="feature-card">
            <el-icon class="feature-icon"><Files /></el-icon>
            <h3>案件管理</h3>
            <p>全面的案件信息管理</p>
          </div>
          <div class="feature-card">
            <el-icon class="feature-icon"><DataAnalysis /></el-icon>
            <h3>数据分析</h3>
            <p>直观的数据可视化</p>
          </div>
          <div class="feature-card">
            <el-icon class="feature-icon"><Bell /></el-icon>
            <h3>智能提醒</h3>
            <p>及时的任务提醒</p>
          </div>
          <div class="feature-card">
            <el-icon class="feature-icon"><User /></el-icon>
            <h3>团队协作</h3>
            <p>高效的协同工作</p>
          </div>
        </div>
      </div>
    </div>

    <div class="login-right">
      <div class="login-form-wrapper">
        <h2 class="login-title">欢迎登录</h2>
        <p class="login-subtitle">AI系统</p>

        <el-form
          ref="loginFormRef"
          :model="loginForm"
          :rules="loginRules"
          class="login-form"
          @submit.prevent="handleLogin"
        >
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              placeholder="请输入账号"
              size="large"
              :prefix-icon="User"
            />
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码"
              size="large"
              :prefix-icon="Lock"
              show-password
              @keyup.enter="handleLogin"
            />
          </el-form-item>

          <el-form-item prop="captcha">
            <div class="captcha-row">
              <el-input
                v-model="loginForm.captcha"
                placeholder="请输入验证码"
                size="large"
                :prefix-icon="CircleCheck"
                @keyup.enter="handleLogin"
              />
              <div class="captcha-image" @click="refreshCaptcha">
                <img v-if="captchaImage" :src="captchaImage" alt="验证码" />
                <el-icon v-else class="refresh-icon"><Refresh /></el-icon>
              </div>
            </div>
          </el-form-item>

          <el-form-item>
            <el-checkbox v-model="loginForm.remember">记住密码</el-checkbox>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              size="large"
              class="login-button"
              :loading="loading"
              @click="handleLogin"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { User, Lock, CircleCheck, Refresh, Files, DataAnalysis, Bell } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import { getCaptcha } from '@/api/auth'
import type { LoginParams } from '@/types'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const loginFormRef = ref<FormInstance>()
const loading = ref(false)
const captchaImage = ref('')
const captchaId = ref('')

const loginForm = reactive<LoginParams>({
  username: '',
  password: '',
  captcha: '',
  captchaId: '',
  remember: false
})

const loginRules: FormRules = {
  username: [
    { required: true, message: '请输入账号', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ],
  captcha: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 4, message: '验证码长度为4位', trigger: 'blur' }
  ]
}

// 获取验证码
async function fetchCaptcha() {
  try {
    // 清理旧的blob URL
    if (captchaImage.value && captchaImage.value.startsWith('blob:')) {
      URL.revokeObjectURL(captchaImage.value)
    }
    
    const response = await getCaptcha()
    // 将blob转换为URL
    const blob = response.data
    captchaImage.value = URL.createObjectURL(blob)
    // 验证码ID从响应头或cookie中获取（根据后端实现调整）
    captchaId.value = response.headers['captcha-id'] || new Date().getTime().toString()
    loginForm.captchaId = captchaId.value
  } catch (error) {
    console.error('获取验证码失败:', error)
    // 如果API调用失败,使用mock数据
    captchaId.value = 'mock-captcha-id'
    captchaImage.value = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjQwIj48dGV4dCB4PSIxMCIgeT0iMzAiIGZvbnQtc2l6ZT0iMjQiPjEyMzQ8L3RleHQ+PC9zdmc+'
    loginForm.captchaId = 'mock-captcha-id'
  }
}

// 刷新验证码
function refreshCaptcha() {
  fetchCaptcha()
}

// 登录
async function handleLogin() {
  if (!loginFormRef.value) return

  await loginFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        loading.value = true
        await userStore.login(loginForm)
        ElMessage.success('登录成功')
        
        // 跳转到重定向地址或首页
        const redirect = route.query.redirect as string
        router.push(redirect || '/home')
      } catch (error: any) {
        ElMessage.error(error.message || '登录失败')
        // 登录失败后刷新验证码
        refreshCaptcha()
        loginForm.captcha = ''
      } finally {
        loading.value = false
      }
    }
  })
}

onMounted(() => {
  fetchCaptcha()
})

// 清理blob URL
onUnmounted(() => {
  if (captchaImage.value && captchaImage.value.startsWith('blob:')) {
    URL.revokeObjectURL(captchaImage.value)
  }
})

</script>

<style scoped lang="scss">
.login-container {
  display: flex;
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-left {
  flex: 0 0 40%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.login-intro {
  max-width: 500px;
  color: #fff;
}

.system-name {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 16px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.system-slogan {
  font-size: 24px;
  margin-bottom: 48px;
  opacity: 0.9;
}

.feature-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.feature-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  transition: transform 0.3s;

  &:hover {
    transform: translateY(-4px);
    background: rgba(255, 255, 255, 0.15);
  }

  .feature-icon {
    font-size: 40px;
    margin-bottom: 12px;
  }

  h3 {
    font-size: 18px;
    margin-bottom: 8px;
  }

  p {
    font-size: 14px;
    opacity: 0.8;
  }
}

.login-right {
  flex: 0 0 60%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  padding: 40px;
}

.login-form-wrapper {
  width: 100%;
  max-width: 400px;
}

.login-title {
  font-size: 32px;
  font-weight: 600;
  color: #303133;
  text-align: center;
  margin-bottom: 8px;
}

.login-subtitle {
  font-size: 16px;
  color: #909399;
  text-align: center;
  margin-bottom: 40px;
}

.login-form {
  .el-form-item {
    margin-bottom: 24px;
  }
}

.captcha-row {
  display: flex;
  gap: 12px;
  width: 100%;

  .el-input {
    flex: 1;
  }
}

.captcha-image {
  width: 120px;
  height: 40px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
  transition: all 0.3s;

  &:hover {
    border-color: #3a8ee6;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 4px;
  }

  .refresh-icon {
    font-size: 24px;
    color: #909399;
  }
}

.login-button {
  width: 100%;
}
</style>
