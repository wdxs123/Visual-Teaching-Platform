<!-- src/views/login/LoginPage.vue -->
<template>
  <div class="login-container">
    <!-- 背景装饰元素 -->
    <div class="decorations">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="triangle triangle-1"></div>
      <div class="triangle triangle-2"></div>
    </div>

    <!-- 主登录卡片 -->
    <div class="login-card">
      <!-- 左侧品牌区域 -->
      <div class="brand-section">
        <div class="logo">
          <div class="logo-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#4F46E5"/>
              <path d="M2 17L12 22L22 17" stroke="#4F46E5" stroke-width="2"/>
              <path d="M2 12L12 17L22 12" stroke="#4F46E5" stroke-width="2"/>
            </svg>
          </div>
          <h1>智慧学苑</h1>
          <p class="tagline">开启知识探索之旅</p>
        </div>

        <div class="features">
          <div class="feature">
            <span class="feature-icon">📚</span>
            <div>
              <h3>海量课程</h3>
              <p>覆盖多个学科领域</p>
            </div>
          </div>
          <div class="feature">
            <span class="feature-icon">🎯</span>
            <div>
              <h3>个性化学习</h3>
              <p>根据你的进度调整</p>
            </div>
          </div>
          <div class="feature">
            <span class="feature-icon">🏆</span>
            <div>
              <h3>成就系统</h3>
              <p>记录每一步成长</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧登录表单 -->
      <div class="form-section">
        <div class="form-header">
          <h2>欢迎回来</h2>
          <p>请登录你的账户继续学习</p>
        </div>

        <!-- 全局错误提示 -->
        <div v-if="generalError" class="error-alert">
          <svg class="error-icon" viewBox="0 0 24 24" fill="none">
            <path d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          {{ generalError }}
        </div>

        <!-- 登录方式切换 -->
        <div class="login-methods">
          <button
            :class="['method-btn', activeMethod === 'account' ? 'active' : '']"
            @click="activeMethod = 'account'"
          >
            <svg class="icon" viewBox="0 0 24 24" fill="none">
              <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" stroke-width="2"/>
              <path d="M20 21V19C20 16.7909 18.2091 15 16 15H8C5.79086 15 4 16.7909 4 19V21" stroke="currentColor" stroke-width="2"/>
            </svg>
            账号登录
          </button>
          <button
            :class="['method-btn', activeMethod === 'phone' ? 'active' : '']"
            @click="activeMethod = 'phone'"
          >
            <svg class="icon" viewBox="0 0 24 24" fill="none">
              <path d="M3 5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5Z" stroke="currentColor" stroke-width="2"/>
              <path d="M10 17H14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            手机登录
          </button>
        </div>

        <!-- 账号登录表单 -->
        <form v-if="activeMethod === 'account'" @submit.prevent="handleAccountLogin" class="login-form">
          <div class="form-group">
            <label for="account">账号 <span class="required">*</span></label>
            <div class="input-wrapper">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none">
                <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" stroke-width="2"/>
                <path d="M20 21V19C20 16.7909 18.2091 15 16 15H8C5.79086 15 4 16.7909 4 19V21" stroke="currentColor" stroke-width="2"/>
              </svg>
              <input
                id="account"
                v-model="accountForm.account"
                type="text"
                placeholder="请输入用户名或邮箱"
                required
                :class="{ 'error': errors.account }"
                @input="clearError('account')"
                @keyup.enter="handleAccountLogin"
              >
            </div>
            <div v-if="errors.account" class="error-message">{{ errors.account }}</div>
            <div v-else class="hint-message">可以使用注册的用户名或邮箱登录</div>
          </div>

          <div class="form-group">
            <label for="password">密码 <span class="required">*</span></label>
            <div class="input-wrapper">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none">
                <path d="M12 15V17M6 21H18C19.1046 21 20 20.1046 20 19V13C20 11.8954 19.1046 11 18 11H6C4.89543 11 4 11.8954 4 13V19C4 20.1046 4.89543 21 6 21Z" stroke="currentColor" stroke-width="2"/>
                <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" stroke-width="2"/>
              </svg>
              <input
                id="password"
                v-model="accountForm.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="请输入密码"
                required
                :class="{ 'error': errors.password }"
                @input="clearError('password')"
                @keyup.enter="handleAccountLogin"
              >
              <button type="button" class="password-toggle" @click="showPassword = !showPassword">
                <svg v-if="showPassword" viewBox="0 0 24 24" fill="none">
                  <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" stroke-width="2"/>
                  <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
                </svg>
                <svg v-else viewBox="0 0 24 24" fill="none">
                  <path d="M14.12 14.12C13.8454 14.4147 13.5141 14.6511 13.1462 14.8151C12.7782 14.9791 12.3809 15.0673 11.9781 15.0744C11.5753 15.0815 11.1752 15.0074 10.8016 14.8565C10.4281 14.7056 10.0887 14.481 9.80385 14.1961C9.51897 13.9113 9.29439 13.5719 9.14351 13.1984C8.99262 12.8248 8.91853 12.4247 8.92563 12.0219C8.93274 11.6191 9.02091 11.2218 9.18488 10.8538C9.34884 10.4858 9.58525 10.1546 9.88 9.88M17.94 17.94C16.2306 19.243 14.1491 19.9649 12 20C5 20 1 12 1 12C2.24389 9.68189 3.96914 7.65661 6.06 6.06L17.94 17.94ZM9.9 4.24C10.5883 4.07888 11.2931 3.99836 12 4C19 4 23 12 23 12C22.393 13.1356 21.6691 14.2047 20.84 15.19L9.9 4.24Z" stroke="currentColor" stroke-width="2"/>
                </svg>
              </button>
            </div>
            <div v-if="errors.password" class="error-message">{{ errors.password }}</div>
          </div>

          <div class="form-options">
            <label class="checkbox">
              <input type="checkbox" v-model="accountForm.remember">
              <span>记住我</span>
            </label>
            <router-link to="/forgot-password" class="forgot-password">
              忘记密码？
            </router-link>
          </div>

          <button type="submit" class="submit-btn" :disabled="loading">
            <span v-if="loading" class="btn-content">
              <svg class="spinner" viewBox="0 0 50 50">
                <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" stroke-width="5"></circle>
              </svg>
              登录中...
            </span>
            <span v-else class="btn-content">立即登录</span>
          </button>
        </form>

        <!-- 手机登录表单 -->
        <form v-else @submit.prevent="handlePhoneLogin" class="login-form">
          <div class="form-group">
            <label for="phone">手机号码 <span class="required">*</span></label>
            <div class="input-wrapper">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none">
                <path d="M3 5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5Z" stroke="currentColor" stroke-width="2"/>
                <path d="M10 17H14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              <input
                id="phone"
                v-model="phoneForm.phone"
                type="tel"
                placeholder="请输入手机号码"
                required
                :class="{ 'error': errors.phone }"
                @input="clearError('phone')"
              >
            </div>
            <div v-if="errors.phone" class="error-message">{{ errors.phone }}</div>
          </div>

          <div class="form-group">
            <label for="smsCode">验证码 <span class="required">*</span></label>
            <div class="input-wrapper">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none">
                <path d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2"/>
              </svg>
              <input
                id="smsCode"
                v-model="phoneForm.smsCode"
                type="text"
                placeholder="请输入验证码"
                maxlength="6"
                required
                :class="{ 'error': errors.smsCode }"
                @input="clearError('smsCode')"
              >
              <button
                type="button"
                class="sms-btn"
                :disabled="smsCountdown > 0"
                @click="sendSmsCode"
              >
                {{ smsCountdown > 0 ? `${smsCountdown}s后重试` : '获取验证码' }}
              </button>
            </div>
            <div v-if="errors.smsCode" class="error-message">{{ errors.smsCode }}</div>
          </div>

          <button type="submit" class="submit-btn" :disabled="loading">
            <span v-if="loading" class="btn-content">
              <svg class="spinner" viewBox="0 0 50 50">
                <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" stroke-width="5"></circle>
              </svg>
              登录中...
            </span>
            <span v-else class="btn-content">立即登录</span>
          </button>
        </form>

        <!-- 快速登录选项 -->
        <div class="quick-login-options">
          <div class="option" @click="quickLogin('demo')">
            <div class="option-icon">🚀</div>
            <div class="option-text">
              <div class="option-title">体验账号</div>
              <div class="option-desc">快速体验平台功能</div>
            </div>
          </div>
          <div class="option" @click="quickLogin('teacher')">
            <div class="option-icon">👨‍🏫</div>
            <div class="option-text">
              <div class="option-title">教师账号</div>
              <div class="option-desc">教师专用登录</div>
            </div>
          </div>
        </div>

        <!-- 分隔线 -->
        <div class="divider">
          <span>或</span>
        </div>

        <!-- 第三方登录 -->
        <div class="social-login">
          <button class="social-btn wechat" @click="handleWechatLogin">
            <svg class="social-icon" viewBox="0 0 24 24" fill="none">
              <path d="M9 4C5.13401 4 2 6.23858 2 9C2 10.1256 2.37209 11.1643 3 12C3 12 4 14 4.5 14C4.5 14 5.5 12.5 7 12.5C8.5 12.5 9.5 14 9.5 14C10 14 11 12 11 12C11.6279 11.1643 12 10.1256 12 9C12 6.23858 8.86599 4 9 4Z" stroke="currentColor" stroke-width="2"/>
              <path d="M15 20C18.866 20 22 17.7614 22 15C22 13.8744 21.6279 12.8357 21 12C21 12 20 10 19.5 10C19.5 10 18.5 11.5 17 11.5C15.5 11.5 14.5 10 14.5 10C14 10 13 12 13 12C12.3721 12.8357 12 13.8744 12 15C12 17.7614 15.134 20 15 20Z" stroke="currentColor" stroke-width="2"/>
            </svg>
            微信登录
          </button>
        </div>

        <!-- 注册链接 -->
        <div class="register-link">
          还没有账户？
          <router-link to="/register" class="link">
            立即注册
          </router-link>
        </div>
      </div>
    </div>

    <!-- 底部信息 -->
    <div class="footer">
      <p>© 2024 智慧学苑 · 让学习成为一种习惯</p>
      <p class="footer-links">
        <a href="#" class="footer-link">帮助中心</a> ·
        <a href="#" class="footer-link">隐私政策</a> ·
        <a href="#" class="footer-link">用户协议</a>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 登录方式状态
const activeMethod = ref('account')

// 账号登录表单数据
const accountForm = reactive({
  account: '',
  password: '',
  remember: false
})

// 手机登录表单数据
const phoneForm = reactive({
  phone: '',
  smsCode: ''
})

// 错误信息
const errors = reactive({
  account: '',
  password: '',
  phone: '',
  smsCode: ''
})

// 全局错误信息
const generalError = ref('')

// 状态
const showPassword = ref(false)
const loading = ref(false)
const smsCountdown = ref(0)

// 从localStorage加载保存的用户信息
onMounted(() => {
  const savedAccount = localStorage.getItem('savedAccount')
  const savedPassword = localStorage.getItem('savedPassword')

  if (savedAccount && savedPassword) {
    accountForm.account = savedAccount
    accountForm.password = savedPassword
    accountForm.remember = true
  }
})

// 发送验证码
const sendSmsCode = () => {
  if (smsCountdown.value > 0) return

  // 手机号验证
  if (!phoneForm.phone.trim()) {
    errors.phone = '请输入手机号码'
    return
  }

  if (!/^1[3-9]\d{9}$/.test(phoneForm.phone)) {
    errors.phone = '请输入有效的手机号码'
    return
  }

  errors.phone = ''

  console.log('发送验证码到:', phoneForm.phone)

  // 开始倒计时
  smsCountdown.value = 60
  const timer = setInterval(() => {
    smsCountdown.value--
    if (smsCountdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

// 清除错误信息
const clearError = (field) => {
  if (errors[field]) {
    errors[field] = ''
  }
  generalError.value = ''
}

// 清除所有错误
const clearAllErrors = () => {
  errors.account = ''
  errors.password = ''
  errors.phone = ''
  errors.smsCode = ''
  generalError.value = ''
}

// 账号登录验证
const validateAccountForm = () => {
  let isValid = true

  if (!accountForm.account.trim()) {
    errors.account = '请输入用户名或邮箱'
    isValid = false
  }

  if (!accountForm.password) {
    errors.password = '请输入密码'
    isValid = false
  }

  return isValid
}

// 手机登录验证
const validatePhoneForm = () => {
  let isValid = true

  if (!phoneForm.phone.trim()) {
    errors.phone = '请输入手机号码'
    isValid = false
  } else if (!/^1[3-9]\d{9}$/.test(phoneForm.phone)) {
    errors.phone = '请输入有效的手机号码'
    isValid = false
  }

  if (!phoneForm.smsCode.trim()) {
    errors.smsCode = '请输入验证码'
    isValid = false
  } else if (phoneForm.smsCode.length !== 6 || !/^\d+$/.test(phoneForm.smsCode)) {
    errors.smsCode = '验证码为6位数字'
    isValid = false
  }

  return isValid
}

// 模拟用户数据库
const userDatabase = {
  // 预设账号
  'demo_user': 'demo123',
  'teacher001': 'teacher123',
  // 注册的账号可以从localStorage读取
}

// 检查注册的账号
const checkRegisteredAccount = (account, password) => {
  try {
    // 从localStorage获取注册的用户
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]')

    // 检查用户名或邮箱
    const user = registeredUsers.find(user =>
      (user.username === account || user.email === account) && user.password === password
    )

    return !!user
  } catch (error) {
    console.error('检查注册账号失败:', error)
    return false
  }
}

// 账号登录
const handleAccountLogin = async () => {
  if (!validateAccountForm()) return

  loading.value = true
  clearAllErrors()

  try {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 1000))

    const { account, password, remember } = accountForm

    // 检查是否记住账号
    if (remember) {
      localStorage.setItem('savedAccount', account)
      localStorage.setItem('savedPassword', password)
    } else {
      localStorage.removeItem('savedAccount')
      localStorage.removeItem('savedPassword')
    }

    // 检查登录凭据
    let loginSuccess = false

    // 1. 检查预设账号
    if (userDatabase[account] === password) {
      loginSuccess = true
    }
    // 2. 检查注册的账号
    else if (checkRegisteredAccount(account, password)) {
      loginSuccess = true
    }
    // 3. 测试用的万能密码（仅用于测试）
    else if (account === 'test' && password === 'test123') {
      loginSuccess = true
      console.log('测试账号登录成功')
    }

    if (loginSuccess) {
      // 保存登录状态
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('currentUser', JSON.stringify({
        username: account,
        loginTime: new Date().toISOString()
      }))

      console.log('登录成功，跳转到首页')

      // 登录成功后跳转到首页
      router.push('/')
    } else {
      generalError.value = '账号或密码错误，请重试'
    }

  } catch (error) {
    console.error('登录失败:', error)
    generalError.value = '登录失败，请检查网络连接或稍后重试'
  } finally {
    loading.value = false
  }
}

// 手机登录
const handlePhoneLogin = async () => {
  if (!validatePhoneForm()) return

  loading.value = true
  clearAllErrors()

  try {
    console.log('手机登录:', phoneForm)

    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1500))

    // 简单验证：验证码为123456
    if (phoneForm.smsCode === '123456') {
      // 保存登录状态
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('currentUser', JSON.stringify({
        phone: phoneForm.phone,
        loginTime: new Date().toISOString()
      }))

      console.log('手机登录成功，跳转到首页')

      // 登录成功后跳转到首页
      router.push('/')
    } else {
      generalError.value = '验证码错误，请输入123456进行测试'
    }

  } catch (error) {
    console.error('登录失败:', error)
    generalError.value = '登录失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

// 快速登录
const quickLogin = (type) => {
  clearAllErrors()

  if (type === 'demo') {
    accountForm.account = 'demo_user'
    accountForm.password = 'demo123'
    accountForm.remember = false
  } else if (type === 'teacher') {
    accountForm.account = 'teacher001'
    accountForm.password = 'teacher123'
    accountForm.remember = false
  }

  // 切换到账号登录方式
  activeMethod.value = 'account'

  // 自动登录
  setTimeout(() => {
    handleAccountLogin()
  }, 100)
}

// 微信登录
const handleWechatLogin = () => {
  console.log('微信登录')
  generalError.value = '微信登录功能正在开发中，请使用账号登录'
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f0f9ff 0%, #fef7ff 50%, #f0fdf4 100%);
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.decorations {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.circle {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, #93c5fd, #c4b5fd);
  opacity: 0.1;
  animation: float 6s ease-in-out infinite;
}

.circle-1 {
  width: 300px;
  height: 300px;
  top: -150px;
  right: -150px;
  animation-delay: 0s;
}

.circle-2 {
  width: 200px;
  height: 200px;
  bottom: -100px;
  left: -100px;
  animation-delay: 2s;
}

.triangle {
  position: absolute;
  width: 0;
  height: 0;
  border-style: solid;
  opacity: 0.1;
}

.triangle-1 {
  border-width: 0 150px 260px 150px;
  border-color: transparent transparent #60a5fa transparent;
  top: 10%;
  left: 5%;
  animation: float 8s ease-in-out infinite;
}

.triangle-2 {
  border-width: 130px 0 130px 225px;
  border-color: transparent transparent transparent #a78bfa;
  bottom: 10%;
  right: 5%;
  animation: float 10s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(5deg);
  }
}

.login-card {
  display: flex;
  max-width: 1000px;
  width: 100%;
  background: white;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
  position: relative;
  z-index: 1;
  animation: slideUp 0.6s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.brand-section {
  flex: 1;
  background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
  padding: 60px 40px;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.logo {
  text-align: center;
}

.logo-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

.logo h1 {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 8px;
  letter-spacing: -0.5px;
}

.tagline {
  font-size: 16px;
  opacity: 0.9;
  font-weight: 300;
}

.features {
  margin-top: 40px;
}

.feature {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  margin-bottom: 16px;
  transition: transform 0.3s ease, background 0.3s ease;
}

.feature:hover {
  transform: translateX(10px);
  background: rgba(255, 255, 255, 0.15);
}

.feature-icon {
  font-size: 28px;
}

.feature h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
}

.feature p {
  font-size: 14px;
  opacity: 0.8;
}

.form-section {
  flex: 1;
  padding: 60px 50px;
}

.form-header {
  text-align: center;
  margin-bottom: 40px;
}

.form-header h2 {
  font-size: 32px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 8px;
}

.form-header p {
  color: #6b7280;
  font-size: 16px;
}

/* 全局错误提示样式 */
.error-alert {
  background: #fef2f2;
  border: 2px solid #fecaca;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: #dc2626;
  font-size: 14px;
  font-weight: 500;
  animation: shake 0.5s ease;
}

.error-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
}

.login-methods {
  display: flex;
  gap: 12px;
  margin-bottom: 32px;
  background: #f9fafb;
  padding: 6px;
  border-radius: 12px;
}

.method-btn {
  flex: 1;
  padding: 14px;
  border: none;
  background: transparent;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.method-btn:hover {
  color: #4F46E5;
  background: rgba(79, 70, 229, 0.05);
}

.method-btn.active {
  color: #4F46E5;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.icon {
  width: 20px;
  height: 20px;
}

.login-form {
  margin-bottom: 32px;
}

.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
}

.required {
  color: #ef4444;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 16px;
  width: 20px;
  height: 20px;
  color: #9ca3af;
  pointer-events: none;
}

.input-wrapper input {
  width: 100%;
  padding: 16px 16px 16px 48px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 16px;
  color: #1f2937;
  transition: all 0.3s ease;
  background: white;
}

.input-wrapper input:focus {
  outline: none;
  border-color: #4F46E5;
  box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1);
}

.input-wrapper input.error {
  border-color: #ef4444;
}

.input-wrapper input.error:focus {
  box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.1);
}

.input-wrapper input::placeholder {
  color: #9ca3af;
}

.password-toggle {
  position: absolute;
  right: 16px;
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 4px;
  transition: color 0.3s ease;
}

.password-toggle:hover {
  color: #4F46E5;
}

.password-toggle svg {
  width: 20px;
  height: 20px;
}

.error-message {
  color: #ef4444;
  font-size: 12px;
  margin-top: 4px;
}

.hint-message {
  color: #6b7280;
  font-size: 12px;
  margin-top: 4px;
}

.sms-btn {
  position: absolute;
  right: 8px;
  background: #4F46E5;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s ease;
}

.sms-btn:hover:not(:disabled) {
  background: #4338ca;
}

.sms-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #6b7280;
}

.checkbox input {
  width: 18px;
  height: 18px;
  border: 2px solid #d1d5db;
  border-radius: 4px;
  cursor: pointer;
}

.checkbox input:checked {
  background-color: #4F46E5;
  border-color: #4F46E5;
}

.forgot-password {
  color: #4F46E5;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.3s ease;
}

.forgot-password:hover {
  color: #4338ca;
}

.submit-btn {
  width: 100%;
  padding: 18px;
  background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(79, 70, 229, 0.3);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.spinner {
  animation: spin 1s linear infinite;
  width: 20px;
  height: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 快速登录选项 */
.quick-login-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 32px;
}

.option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.option:hover {
  background: #f3f4f6;
  border-color: #e5e7eb;
  transform: translateY(-2px);
}

.option-icon {
  font-size: 24px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 10px;
}

.option-text {
  flex: 1;
}

.option-title {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
}

.option-desc {
  font-size: 12px;
  color: #6b7280;
}

.divider {
  display: flex;
  align-items: center;
  margin: 32px 0;
  color: #9ca3af;
  font-size: 14px;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #e5e7eb;
}

.divider span {
  padding: 0 16px;
}

.social-login {
  display: flex;
  justify-content: center;
  margin-bottom: 32px;
}

.social-btn {
  padding: 14px 32px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  background: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.social-btn.wechat {
  color: #22c55e;
  border-color: #dcfce7;
}

.social-btn.wechat:hover {
  background: #f0fdf4;
  border-color: #22c55e;
}

.social-icon {
  width: 20px;
  height: 20px;
}

.register-link {
  text-align: center;
  color: #6b7280;
  font-size: 14px;
}

.link {
  color: #4F46E5;
  font-weight: 600;
  text-decoration: none;
  margin-left: 4px;
  transition: color 0.3s ease;
}

.link:hover {
  color: #4338ca;
}

.footer {
  margin-top: 40px;
  text-align: center;
  color: #6b7280;
  font-size: 14px;
  position: relative;
  z-index: 1;
}

.footer-links {
  margin-top: 8px;
}

.footer-link {
  color: #6b7280;
  text-decoration: none;
  margin: 0 8px;
  transition: color 0.3s ease;
}

.footer-link:hover {
  color: #4F46E5;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .login-card {
    flex-direction: column;
    max-width: 450px;
  }

  .brand-section {
    padding: 40px 20px;
  }

  .form-section {
    padding: 40px 30px;
  }

  .quick-login-options {
    grid-template-columns: 1fr;
  }

  .circle-1,
  .circle-2,
  .triangle-1,
  .triangle-2 {
    display: none;
  }
}

@media (max-width: 480px) {
  .form-section {
    padding: 30px 20px;
  }

  .login-methods {
    flex-direction: column;
  }

  .social-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
