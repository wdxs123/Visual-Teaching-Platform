<!-- src/views/login/RegisterPage.vue -->
<template>
  <div class="register-container">
    <!-- 背景装饰元素 -->
    <div class="decorations">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="wave wave-1"></div>
      <div class="wave wave-2"></div>
    </div>

    <!-- 主注册卡片 -->
    <div class="register-card">
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
          <p class="tagline">开启你的学习之旅</p>
        </div>

        <div class="benefits">
          <h3>注册即享权益</h3>
          <div class="benefit-item">
            <span class="benefit-icon">🎯</span>
            <div>
              <h4>个性化推荐</h4>
              <p>根据兴趣智能推荐课程</p>
            </div>
          </div>
          <div class="benefit-item">
            <span class="benefit-icon">📚</span>
            <div>
              <h4>免费课程</h4>
              <p>立即解锁入门课程</p>
            </div>
          </div>
          <div class="benefit-item">
            <span class="benefit-icon">📱</span>
            <div>
              <h4>多端同步</h4>
              <p>随时随地继续学习</p>
            </div>
          </div>
        </div>

        <div class="testimonial">
          <div class="quote">"这个平台让学习变得如此简单有趣！"</div>
          <div class="author">- 已注册学员</div>
        </div>
      </div>

      <!-- 右侧注册表单 -->
      <div class="form-section">
        <div class="form-header">
          <h2>创建新账户</h2>
          <p>加入智慧学苑，开启知识探索</p>
        </div>

        <!-- 注册表单 -->
        <form @submit.prevent="handleRegister" class="register-form">
          <div class="form-group">
            <label for="username">用户名 <span class="required">*</span></label>
            <div class="input-wrapper">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none">
                <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" stroke-width="2"/>
                <path d="M20 21V19C20 16.7909 18.2091 15 16 15H8C5.79086 15 4 16.7909 4 19V21" stroke="currentColor" stroke-width="2"/>
              </svg>
              <input
                id="username"
                v-model="formData.username"
                type="text"
                placeholder="请输入用户名（3-20位字母数字）"
                required
                :class="{ 'error': errors.username }"
                @blur="validateUsername"
                @input="clearError('username')"
              >
            </div>
            <div v-if="errors.username" class="error-message">{{ errors.username }}</div>
            <div v-else class="hint-message">用户名将用于登录和社区显示</div>
          </div>

          <div class="form-group">
            <label for="email">邮箱地址 <span class="required">*</span></label>
            <div class="input-wrapper">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none">
                <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" stroke-width="2"/>
                <path d="M22 6L12 13L2 6" stroke="currentColor" stroke-width="2"/>
              </svg>
              <input
                id="email"
                v-model="formData.email"
                type="email"
                placeholder="请输入常用邮箱"
                required
                :class="{ 'error': errors.email }"
                @blur="validateEmail"
                @input="clearError('email')"
              >
            </div>
            <div v-if="errors.email" class="error-message">{{ errors.email }}</div>
            <div v-else class="hint-message">用于账户验证和找回密码</div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="password">密码 <span class="required">*</span></label>
              <div class="input-wrapper">
                <svg class="input-icon" viewBox="0 0 24 24" fill="none">
                  <path d="M12 15V17M6 21H18C19.1046 21 20 20.1046 20 19V13C20 11.8954 19.1046 11 18 11H6C4.89543 11 4 11.8954 4 13V19C4 20.1046 4.89543 21 6 21Z" stroke="currentColor" stroke-width="2"/>
                  <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" stroke-width="2"/>
                </svg>
                <input
                  id="password"
                  v-model="formData.password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="至少8位字符"
                  required
                  :class="{ 'error': errors.password }"
                  @input="validatePassword"
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

            <div class="form-group">
              <label for="confirmPassword">确认密码 <span class="required">*</span></label>
              <div class="input-wrapper">
                <svg class="input-icon" viewBox="0 0 24 24" fill="none">
                  <path d="M12 15V17M6 21H18C19.1046 21 20 20.1046 20 19V13C20 11.8954 19.1046 11 18 11H6C4.89543 11 4 11.8954 4 13V19C4 20.1046 4.89543 21 6 21Z" stroke="currentColor" stroke-width="2"/>
                  <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" stroke-width="2"/>
                </svg>
                <input
                  id="confirmPassword"
                  v-model="formData.confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  placeholder="请再次输入密码"
                  required
                  :class="{ 'error': errors.confirmPassword }"
                  @input="validateConfirmPassword"
                >
                <button type="button" class="password-toggle" @click="showConfirmPassword = !showConfirmPassword">
                  <svg v-if="showConfirmPassword" viewBox="0 0 24 24" fill="none">
                    <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" stroke-width="2"/>
                    <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
                  </svg>
                  <svg v-else viewBox="0 0 24 24" fill="none">
                    <path d="M14.12 14.12C13.8454 14.4147 13.5141 14.6511 13.1462 14.8151C12.7782 14.9791 12.3809 15.0673 11.9781 15.0744C11.5753 15.0815 11.1752 15.0074 10.8016 14.8565C10.4281 14.7056 10.0887 14.481 9.80385 14.1961C9.51897 13.9113 9.29439 13.5719 9.14351 13.1984C8.99262 12.8248 8.91853 12.4247 8.92563 12.0219C8.93274 11.6191 9.02091 11.2218 9.18488 10.8538C9.34884 10.4858 9.58525 10.1546 9.88 9.88M17.94 17.94C16.2306 19.243 14.1491 19.9649 12 20C5 20 1 12 1 12C2.24389 9.68189 3.96914 7.65661 6.06 6.06L17.94 17.94ZM9.9 4.24C10.5883 4.07888 11.2931 3.99836 12 4C19 4 23 12 23 12C22.393 13.1356 21.6691 14.2047 20.84 15.19L9.9 4.24Z" stroke="currentColor" stroke-width="2"/>
                  </svg>
                </button>
              </div>
              <div v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</div>
            </div>
          </div>

          <!-- 密码强度指示器 -->
          <div class="password-strength" v-if="formData.password">
            <div class="strength-label">密码强度：<span class="strength-text">{{ getStrengthText() }}</span></div>
            <div class="strength-bar">
              <div
                :class="['strength-segment', getStrengthClass()]"
                :style="{ width: getStrengthWidth() }"
              ></div>
            </div>
            <div class="strength-tips">
              <span :class="{ 'valid': formData.password.length >= 8 }">≥8位</span>
              <span :class="{ 'valid': hasUppercase && hasLowercase }">大小写</span>
              <span :class="{ 'valid': hasNumber }">数字</span>
              <span :class="{ 'valid': hasSpecialChar }">符号</span>
            </div>
          </div>

          <!-- 用户协议 -->
          <div class="terms-agreement">
            <label class="checkbox-large">
              <input type="checkbox" v-model="formData.agreeTerms">
              <span class="checkmark"></span>
              <span class="checkbox-text">
                我已阅读并同意
                <a href="#" class="terms-link">《服务协议》</a> 和
                <a href="#" class="terms-link">《隐私政策》</a>
              </span>
            </label>
            <div v-if="errors.agreeTerms" class="error-message">{{ errors.agreeTerms }}</div>
          </div>

          <div class="terms-agreement">
            <label class="checkbox-large">
              <input type="checkbox" v-model="formData.receiveUpdates">
              <span class="checkmark"></span>
              <span class="checkbox-text">
                接收学习资源更新和课程推荐（可选）
              </span>
            </label>
          </div>

          <button
            type="submit"
            class="submit-btn"
            :disabled="loading || !formData.agreeTerms"
            :class="{ 'loading': loading }"
          >
            <span v-if="loading" class="btn-content">
              <svg class="spinner" viewBox="0 0 50 50">
                <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" stroke-width="5"></circle>
              </svg>
              注册中...
            </span>
            <span v-else class="btn-content">立即注册</span>
          </button>

          <div class="divider">
            <span>或</span>
          </div>

          <!-- 第三方注册 -->
          <div class="social-register">
            <button class="social-btn wechat" @click="handleWechatRegister">
              <svg class="social-icon" viewBox="0 0 24 24" fill="none">
                <path d="M9 4C5.13401 4 2 6.23858 2 9C2 10.1256 2.37209 11.1643 3 12C3 12 4 14 4.5 14C4.5 14 5.5 12.5 7 12.5C8.5 12.5 9.5 14 9.5 14C10 14 11 12 11 12C11.6279 11.1643 12 10.1256 12 9C12 6.23858 8.86599 4 9 4Z" stroke="currentColor" stroke-width="2"/>
                <path d="M15 20C18.866 20 22 17.7614 22 15C22 13.8744 21.6279 12.8357 21 12C21 12 20 10 19.5 10C19.5 10 18.5 11.5 17 11.5C15.5 11.5 14.5 10 14.5 10C14 10 13 12 13 12C12.3721 12.8357 12 13.8744 12 15C12 17.7614 15.134 20 15 20Z" stroke="currentColor" stroke-width="2"/>
              </svg>
              微信注册
            </button>
          </div>
        </form>

        <!-- 注册成功提示 -->
        <div v-if="showSuccess" class="success-overlay">
          <div class="success-modal">
            <div class="success-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h3>注册成功！</h3>
            <p class="success-message">
              欢迎加入智慧学苑，<strong>{{ formData.username }}</strong>！<br>
              验证邮件已发送至 <strong>{{ formData.email }}</strong>
            </p>
            <div class="success-actions">
              <button class="primary-btn" @click="goToLogin">
                前往登录
              </button>
              <button class="secondary-btn" @click="showSuccess = false">
                继续注册
              </button>
            </div>
          </div>
        </div>

        <!-- 登录链接 -->
        <div class="login-link">
          已有账户？
          <router-link to="/login" class="link">
            立即登录
          </router-link>
        </div>
      </div>
    </div>

    <!-- 底部信息 -->
    <div class="footer">
      <p>© 2024 智慧学苑 · 让学习成为一种习惯</p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/modules/user'

const router = useRouter()
const userStore = useUserStore()

// 表单数据
const formData = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeTerms: false,
  receiveUpdates: true,
})

// 错误信息
const errors = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeTerms: '',
  general: ''  // 添加 general 错误字段
})

// 状态
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const loading = ref(false)
const showSuccess = ref(false)

// 密码验证计算属性
const hasUppercase = computed(() => /[A-Z]/.test(formData.password))
const hasLowercase = computed(() => /[a-z]/.test(formData.password))
const hasNumber = computed(() => /\d/.test(formData.password))
const hasSpecialChar = computed(() => /[!@#$%^&*(),.?":{}|<>]/.test(formData.password))

// 密码强度计算
const calculateStrength = () => {
  let strength = 0

  // 长度检查
  if (formData.password.length >= 8) strength += 2
  else if (formData.password.length >= 6) strength += 1

  // 字符类型检查
  if (hasUppercase.value && hasLowercase.value) strength += 1
  if (hasNumber.value) strength += 1
  if (hasSpecialChar.value) strength += 1

  // 限制最大为5
  return Math.min(strength, 5)
}

const getStrengthWidth = () => {
  const strength = calculateStrength()
  return `${(strength / 5) * 100}%`
}

const getStrengthClass = () => {
  const strength = calculateStrength()
  if (strength <= 2) return 'weak'
  if (strength <= 3) return 'medium'
  return 'strong'
}

const getStrengthText = () => {
  const strength = calculateStrength()
  if (strength <= 2) return '弱'
  if (strength <= 3) return '中'
  return '强'
}

// 验证方法
const validateUsername = () => {
  if (!formData.username.trim()) {
    errors.username = '请输入用户名'
    return false
  }

  if (formData.username.length < 3 || formData.username.length > 20) {
    errors.username = '用户名长度需为3-20位'
    return false
  }

  if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
    errors.username = '只能包含字母、数字和下划线'
    return false
  }

  errors.username = ''
  return true
}

const validateEmail = () => {
  if (!formData.email.trim()) {
    errors.email = '请输入邮箱地址'
    return false
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(formData.email)) {
    errors.email = '请输入有效的邮箱地址'
    return false
  }

  errors.email = ''
  return true
}

const validatePassword = () => {
  if (!formData.password) {
    errors.password = '请输入密码'
    return false
  }

  if (formData.password.length < 8) {
    errors.password = '密码至少需要8个字符'
    return false
  }

  if (!hasUppercase.value || !hasLowercase.value || !hasNumber.value) {
    errors.password = '需包含大小写字母和数字'
    return false
  }

  errors.password = ''

  // 同时验证确认密码
  validateConfirmPassword()

  return true
}

const validateConfirmPassword = () => {
  if (!formData.confirmPassword) {
    errors.confirmPassword = '请确认密码'
    return false
  }

  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = '两次输入的密码不一致'
    return false
  }

  errors.confirmPassword = ''
  return true
}

const validateForm = () => {
  let isValid = true

  if (!validateUsername()) isValid = false
  if (!validateEmail()) isValid = false
  if (!validatePassword()) isValid = false
  if (!validateConfirmPassword()) isValid = false

  if (!formData.agreeTerms) {
    errors.agreeTerms = '请同意服务协议和隐私政策'
    isValid = false
  } else {
    errors.agreeTerms = ''
  }

  return isValid
}

const clearError = (field) => {
  if (errors[field]) {
    errors[field] = ''
  }
}

// 注册提交 - 只保留这一个函数
const handleRegister = async () => {
  if (!validateForm()) {
    return
  }

  loading.value = true
  errors.general = ''

  try {
    // 使用 Pinia store 注册
    await userStore.register({
      username: formData.username,
      email: formData.email,
      password: formData.password,
      receiveUpdates: formData.receiveUpdates
    })

    // 注册成功后显示成功提示
    showSuccess.value = true

  } catch (error) {
    console.error('注册失败:', error)

    // 根据错误类型显示不同的错误信息
    if (error.message?.includes('用户名已存在')) {
      errors.username = '该用户名已被注册'
    } else if (error.message?.includes('邮箱已存在')) {
      errors.email = '该邮箱已被注册'
    } else {
      errors.general = '注册失败，请稍后重试'
    }
  } finally {
    loading.value = false
  }
}

// 微信注册
const handleWechatRegister = () => {
  console.log('微信注册')
  // 这里实现微信注册逻辑
}

// 导航
const goToLogin = () => {
  router.push('/login')
}

// 监听表单变化
watch(() => formData.password, validatePassword)
watch(() => formData.confirmPassword, validateConfirmPassword)
</script>


<style scoped>
.register-container {
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

.wave {
  position: absolute;
  width: 300px;
  height: 100px;
  background: linear-gradient(90deg, transparent, rgba(79, 70, 229, 0.1), transparent);
  border-radius: 50%;
  opacity: 0.3;
}

.wave-1 {
  top: 20%;
  left: -150px;
  transform: rotate(45deg);
  animation: waveMove 15s linear infinite;
}

.wave-2 {
  bottom: 30%;
  right: -150px;
  transform: rotate(-45deg);
  animation: waveMove 20s linear infinite reverse;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(5deg);
  }
}

@keyframes waveMove {
  0% {
    transform: translateX(-100px) rotate(45deg);
  }
  100% {
    transform: translateX(calc(100vw + 100px)) rotate(45deg);
  }
}

.register-card {
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
  margin-bottom: 40px;
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

.benefits {
  margin-bottom: 40px;
}

.benefits h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
  opacity: 0.9;
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  margin-bottom: 12px;
  transition: transform 0.3s ease, background 0.3s ease;
}

.benefit-item:hover {
  transform: translateX(10px);
  background: rgba(255, 255, 255, 0.15);
}

.benefit-icon {
  font-size: 24px;
}

.benefit-item h4 {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 4px;
}

.benefit-item p {
  font-size: 13px;
  opacity: 0.8;
}

.testimonial {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 20px;
  backdrop-filter: blur(10px);
  border-left: 4px solid rgba(255, 255, 255, 0.3);
}

.quote {
  font-size: 15px;
  font-style: italic;
  line-height: 1.6;
  margin-bottom: 8px;
}

.author {
  font-size: 13px;
  opacity: 0.8;
  text-align: right;
}

.form-section {
  flex: 1;
  padding: 60px 50px;
  position: relative;
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

.register-form {
  margin-bottom: 30px;
}

.form-row {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.form-row .form-group {
  flex: 1;
  margin-bottom: 0;
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

.password-strength {
  background: #f9fafb;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 24px;
}

.strength-label {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.strength-text {
  font-weight: 600;
}

.strength-bar {
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
  position: relative;
}

.strength-segment {
  height: 100%;
  transition: all 0.3s ease;
  position: absolute;
  left: 0;
  top: 0;
}

.strength-segment.weak {
  background: #ef4444;
}

.strength-segment.medium {
  background: #f59e0b;
}

.strength-segment.strong {
  background: #10b981;
}

.strength-tips {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #9ca3af;
}

.strength-tips span {
  position: relative;
  padding-left: 16px;
}

.strength-tips span::before {
  content: '○';
  position: absolute;
  left: 0;
}

.strength-tips span.valid {
  color: #10b981;
}

.strength-tips span.valid::before {
  content: '✓';
}

.terms-agreement {
  margin-bottom: 16px;
}

.checkbox-large {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  cursor: pointer;
  font-size: 14px;
  color: #374151;
}

.checkbox-large input {
  margin-top: 4px;
  min-width: 20px;
  min-height: 20px;
  border: 2px solid #d1d5db;
  border-radius: 4px;
  cursor: pointer;
  appearance: none;
  position: relative;
  flex-shrink: 0;
}

.checkbox-large input:checked {
  background-color: #4F46E5;
  border-color: #4F46E5;
}

.checkbox-large input:checked::after {
  content: '✓';
  position: absolute;
  color: white;
  font-size: 14px;
  font-weight: bold;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.checkbox-text {
  line-height: 1.5;
}

.terms-link {
  color: #4F46E5;
  text-decoration: none;
  font-weight: 500;
}

.terms-link:hover {
  text-decoration: underline;
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
  margin-top: 8px;
  margin-bottom: 24px;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(79, 70, 229, 0.3);
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.submit-btn.loading {
  opacity: 0.8;
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

.divider {
  display: flex;
  align-items: center;
  margin: 24px 0;
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

.social-register {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
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

.success-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.success-modal {
  background: white;
  border-radius: 20px;
  padding: 40px;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  max-width: 400px;
  width: 90%;
  animation: scaleIn 0.3s ease;
}

@keyframes scaleIn {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.success-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
  background: linear-gradient(135deg, #10b981, #34d399);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.success-icon svg {
  width: 40px;
  height: 40px;
}

.success-modal h3 {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 16px;
}

.success-message {
  color: #6b7280;
  font-size: 15px;
  line-height: 1.6;
  margin-bottom: 30px;
}

.success-message strong {
  color: #4F46E5;
}

.success-actions {
  display: flex;
  gap: 12px;
}

.primary-btn {
  flex: 1;
  padding: 14px;
  background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.primary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(79, 70, 229, 0.3);
}

.secondary-btn {
  flex: 1;
  padding: 14px;
  background: white;
  color: #4F46E5;
  border: 2px solid #4F46E5;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.secondary-btn:hover {
  background: #f9fafb;
}

.login-link {
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

/* 响应式设计 */
@media (max-width: 768px) {
  .register-card {
    flex-direction: column;
    max-width: 450px;
  }

  .brand-section {
    padding: 40px 20px;
  }

  .form-section {
    padding: 40px 30px;
  }

  .form-row {
    flex-direction: column;
    gap: 16px;
  }

  .wave-1,
  .wave-2 {
    display: none;
  }
}

@media (max-width: 480px) {
  .form-section {
    padding: 30px 20px;
  }

  .success-actions {
    flex-direction: column;
  }
}
</style>
