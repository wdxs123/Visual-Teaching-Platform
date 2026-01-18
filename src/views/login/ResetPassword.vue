<template>
  <div class="reset-password-page">
    <!-- 背景装饰 -->
    <div class="background-decoration">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
    </div>

    <!-- 主要内容 -->
    <div class="reset-password-container">
      <!-- 左侧品牌区域 -->
      <div class="brand-section">
        <div class="brand-content">
          <div class="logo">
            <i class="fas fa-bolt"></i>
            <span>电气工程学习平台</span>
          </div>
          <h1 class="brand-title">设置新密码</h1>
          <p class="brand-subtitle">请为您的账户设置一个新的安全密码</p>

          <div class="security-tips">
            <h3><i class="fas fa-shield-alt"></i> 密码安全提示</h3>
            <ul>
              <li><i class="fas fa-check"></i> 使用至少8个字符</li>
              <li><i class="fas fa-check"></i> 包含字母和数字</li>
              <li><i class="fas fa-check"></i> 使用特殊字符增强安全性</li>
              <li><i class="fas fa-check"></i> 避免使用常见密码</li>
              <li><i class="fas fa-check"></i> 不要与其他网站密码相同</li>
            </ul>
          </div>

          <div class="progress-indicator">
            <div class="progress-step active">
              <div class="step-icon">
                <i class="fas fa-envelope"></i>
              </div>
              <div class="step-text">
                <div class="step-title">验证邮箱</div>
                <div class="step-desc">已发送验证链接</div>
              </div>
            </div>
            <div class="progress-connector active"></div>
            <div class="progress-step active">
              <div class="step-icon">
                <i class="fas fa-lock"></i>
              </div>
              <div class="step-text">
                <div class="step-title">设置新密码</div>
                <div class="step-desc">当前步骤</div>
              </div>
            </div>
            <div class="progress-connector"></div>
            <div class="progress-step">
              <div class="step-icon">
                <i class="fas fa-check"></i>
              </div>
              <div class="step-text">
                <div class="step-title">完成重置</div>
                <div class="step-desc">即将完成</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧表单区域 -->
      <div class="form-section">
        <div class="form-card">
          <!-- 重置令牌有效时的表单 -->
          <div v-if="tokenValid && !resetSuccess" class="reset-form">
            <div class="form-header">
              <h2>设置新密码</h2>
              <p>请为您的账户设置一个新的安全密码</p>
            </div>

            <form @submit.prevent="handleResetPassword" class="password-form">
              <div class="form-group">
                <label for="newPassword" class="form-label">
                  <i class="fas fa-lock"></i>
                  新密码 *
                </label>
                <div class="password-input-container">
                  <input
                    id="newPassword"
                    v-model="form.newPassword"
                    :type="showNewPassword ? 'text' : 'password'"
                    class="form-input"
                    :class="{ error: fieldErrors.newPassword }"
                    placeholder="请输入新密码（至少6位）"
                    required
                    :disabled="loading"
                    @input="checkPasswordStrength"
                    @blur="validateNewPassword"
                  >
                  <button
                    type="button"
                    class="password-toggle"
                    @click="showNewPassword = !showNewPassword"
                    :disabled="loading"
                  >
                    <i :class="showNewPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                  </button>
                </div>
                <div v-if="fieldErrors.newPassword" class="error-message">
                  <i class="fas fa-exclamation-circle"></i>
                  {{ fieldErrors.newPassword }}
                </div>

                <!-- 密码强度指示器 -->
                <div class="password-strength" v-if="form.newPassword">
                  <div class="strength-indicators">
                    <div class="strength-bar" :class="passwordStrength"></div>
                    <div class="strength-text">{{ passwordStrengthText }}</div>
                  </div>
                  <div class="password-requirements">
                    <div class="requirement" :class="{ met: form.newPassword.length >= 8 }">
                      <i :class="form.newPassword.length >= 8 ? 'fas fa-check' : 'fas fa-times'"></i>
                      至少8个字符
                    </div>
                    <div class="requirement" :class="{ met: hasUpperCase && hasLowerCase }">
                      <i :class="hasUpperCase && hasLowerCase ? 'fas fa-check' : 'fas fa-times'"></i>
                      包含大小写字母
                    </div>
                    <div class="requirement" :class="{ met: hasNumbers }">
                      <i :class="hasNumbers ? 'fas fa-check' : 'fas fa-times'"></i>
                      包含数字
                    </div>
                    <div class="requirement" :class="{ met: hasSpecialChar }">
                      <i :class="hasSpecialChar ? 'fas fa-check' : 'fas fa-times'"></i>
                      包含特殊字符
                    </div>
                  </div>
                </div>
              </div>

              <div class="form-group">
                <label for="confirmPassword" class="form-label">
                  <i class="fas fa-lock"></i>
                  确认新密码 *
                </label>
                <div class="password-input-container">
                  <input
                    id="confirmPassword"
                    v-model="form.confirmPassword"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    class="form-input"
                    :class="{ error: fieldErrors.confirmPassword, success: passwordsMatch && form.confirmPassword }"
                    placeholder="请再次输入新密码"
                    required
                    :disabled="loading"
                    @input="validatePasswordMatch"
                    @blur="validatePasswordMatch"
                  >
                  <button
                    type="button"
                    class="password-toggle"
                    @click="showConfirmPassword = !showConfirmPassword"
                    :disabled="loading"
                  >
                    <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                  </button>
                </div>
                <div v-if="fieldErrors.confirmPassword" class="error-message">
                  <i class="fas fa-exclamation-circle"></i>
                  {{ fieldErrors.confirmPassword }}
                </div>
                <div v-if="passwordsMatch && form.confirmPassword" class="success-message">
                  <i class="fas fa-check-circle"></i>
                  密码匹配
                </div>
              </div>

              <button
                type="submit"
                class="reset-btn"
                :disabled="loading || !isFormValid"
              >
                <span v-if="loading" class="loading-spinner"></span>
                <i v-else class="fas fa-key"></i>
                {{ loading ? '重置中...' : '重置密码' }}
              </button>
            </form>
          </div>

          <!-- 重置成功页面 -->
          <div v-else-if="resetSuccess" class="success-section">
            <div class="success-content">
              <div class="success-icon">
                <i class="fas fa-check-circle"></i>
              </div>
              <h2>密码重置成功！</h2>
              <p class="success-description">
                您的账户密码已成功重置，现在可以使用新密码登录
              </p>

              <div class="countdown-timer" v-if="countdown > 0">
                <p>{{ countdown }}秒后自动跳转到登录页面</p>
              </div>

              <div class="success-actions">
                <router-link to="/login" class="btn-primary">
                  <i class="fas fa-sign-in-alt"></i>
                  立即登录
                </router-link>
                <router-link to="/" class="btn-secondary">
                  <i class="fas fa-home"></i>
                  返回首页
                </router-link>
              </div>

              <div class="security-reminder">
                <h3><i class="fas fa-shield-alt"></i> 安全提醒</h3>
                <ul>
                  <li>请妥善保管您的新密码</li>
                  <li>建议定期更换密码以提高安全性</li>
                  <li>不要在多个网站使用相同的密码</li>
                  <li>如发现异常活动，请及时联系客服</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- 令牌无效或过期页面 -->
          <div v-else class="error-section">
            <div class="error-content">
              <div class="error-icon">
                <i class="fas fa-exclamation-triangle"></i>
              </div>
              <h2>重置链接无效或已过期</h2>
              <p class="error-description">
                您使用的密码重置链接无效或已过期，请重新申请密码重置
              </p>

              <div class="error-actions">
                <router-link to="/forgot-password" class="btn-primary">
                  <i class="fas fa-redo"></i>
                  重新申请重置
                </router-link>
                <router-link to="/login" class="btn-secondary">
                  <i class="fas fa-sign-in-alt"></i>
                  返回登录
                </router-link>
              </div>

              <div class="help-links">
                <h3>需要帮助？</h3>
                <ul>
                  <li><a href="#"><i class="fas fa-question-circle"></i> 查看帮助文档</a></li>
                  <li><a href="#"><i class="fas fa-envelope"></i> 联系客服支持</a></li>
                  <li><a href="#"><i class="fas fa-comments"></i> 在线客服咨询</a></li>
                </ul>
              </div>
            </div>
          </div>

          <!-- 返回登录链接 -->
          <div class="back-to-login" v-if="!resetSuccess && tokenValid">
            <router-link to="/login" class="back-link">
              <i class="fas fa-arrow-left"></i>
              返回登录页面
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- 消息提示 -->
    <div v-if="message" class="message-toast" :class="{ error: !isSuccess }">
      <i :class="isSuccess ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'"></i>
      <span>{{ message }}</span>
      <button class="close-btn" @click="message = ''">
        <i class="fas fa-times"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/modules/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

// 响应式数据
const form = reactive({
  newPassword: '',
  confirmPassword: ''
})

const loading = ref(false)
const tokenValid = ref(true)
const resetSuccess = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)
const countdown = ref(0)
const message = ref('')
const isSuccess = ref(false)

const fieldErrors = reactive({
  newPassword: '',
  confirmPassword: ''
})

// 计算属性
const hasUpperCase = computed(() => /[A-Z]/.test(form.newPassword))
const hasLowerCase = computed(() => /[a-z]/.test(form.newPassword))
const hasNumbers = computed(() => /\d/.test(form.newPassword))
const hasSpecialChar = computed(() => /[!@#$%^&*(),.?":{}|<>]/.test(form.newPassword))

const passwordStrength = computed(() => {
  if (!form.newPassword) return 'empty'
  if (form.newPassword.length < 6) return 'weak'

  const strengthFactors = [hasUpperCase.value, hasLowerCase.value, hasNumbers.value, hasSpecialChar.value]
  const strengthScore = strengthFactors.filter(Boolean).length

  if (form.newPassword.length >= 12 && strengthScore >= 3) return 'strong'
  if (form.newPassword.length >= 8 && strengthScore >= 2) return 'medium'
  return 'weak'
})

const passwordStrengthText = computed(() => {
  switch (passwordStrength.value) {
    case 'weak': return '密码强度：弱'
    case 'medium': return '密码强度：中'
    case 'strong': return '密码强度：强'
    default: return '请输入密码'
  }
})

const passwordsMatch = computed(() => {
  return form.newPassword === form.confirmPassword && form.confirmPassword !== ''
})

const isFormValid = computed(() => {
  return form.newPassword &&
         form.confirmPassword &&
         passwordsMatch.value &&
         form.newPassword.length >= 6 &&
         !fieldErrors.newPassword &&
         !fieldErrors.confirmPassword
})

// 监听器
watch([form.newPassword, form.confirmPassword], () => {
  validatePasswordMatch()
})

// 方法
const clearFieldError = (field) => {
  if (fieldErrors[field]) {
    fieldErrors[field] = ''
  }
}

const validateNewPassword = () => {
  if (!form.newPassword.trim()) {
    fieldErrors.newPassword = '请输入新密码'
    return false
  }

  if (form.newPassword.length < 6) {
    fieldErrors.newPassword = '密码长度至少6位'
    return false
  }

  clearFieldError('newPassword')
  return true
}

const checkPasswordStrength = () => {
  validateNewPassword()
}

const validatePasswordMatch = () => {
  if (!form.confirmPassword.trim()) {
    fieldErrors.confirmPassword = '请确认密码'
    return false
  }

  if (form.newPassword !== form.confirmPassword) {
    fieldErrors.confirmPassword = '两次输入的密码不一致'
    return false
  }

  clearFieldError('confirmPassword')
  return true
}

const validateForm = () => {
  let isValid = true

  // 清除之前的错误
  Object.keys(fieldErrors).forEach(key => {
    fieldErrors[key] = ''
  })

  // 验证各个字段
  if (!validateNewPassword()) isValid = false
  if (!validatePasswordMatch()) isValid = false

  return isValid
}

// 处理重置密码
const handleResetPassword = async () => {
  if (!validateForm()) {
    message.value = '请完善表单信息'
    isSuccess.value = false
    return
  }

  loading.value = true

  try {
    // 从URL参数获取token
    const token = route.query.token

    if (!token) {
      tokenValid.value = false
      message.value = '重置链接无效，缺少必要的参数'
      isSuccess.value = false
      return
    }

    // 在实际应用中，这里应该调用API验证token并重置密码
    // 这里使用模拟实现
    const result = await userStore.resetPassword(
      'user@example.com', // 在实际应用中，应该从token中解析出邮箱或用户ID
      token,
      form.newPassword
    )

    if (result.success) {
      isSuccess.value = true
      message.value = result.message || '密码重置成功'
      resetSuccess.value = true
      startCountdown()
    } else {
      isSuccess.value = false
      message.value = result.message || '重置密码失败'

      // 如果是token无效，标记为无效
      if (result.message.includes('无效') || result.message.includes('过期')) {
        tokenValid.value = false
      }
    }
  } catch (error) {
    console.error('重置密码异常:', error)
    isSuccess.value = false
    message.value = '重置密码失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

// 开始倒计时
const startCountdown = () => {
  countdown.value = 5
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
      router.push('/login')
    }
  }, 1000)
}

// 验证重置令牌
const validateResetToken = () => {
  const token = route.query.token

  if (!token) {
    tokenValid.value = false
    message.value = '重置链接无效，缺少必要的参数'
    isSuccess.value = false
    return
  }

  // 在实际应用中，这里应该调用API验证token的有效性
  // 这里使用模拟验证
  console.log('验证重置令牌:', token)

  // 模拟验证成功
  tokenValid.value = true
}

// 组件挂载时验证token
onMounted(() => {
  validateResetToken()
})
</script>

<style scoped>
.reset-password-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  padding: 1rem;
}

/* 背景装饰 */
.background-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
}

.circle-1 {
  width: 200px;
  height: 200px;
  top: 10%;
  left: 5%;
  animation: float 6s ease-in-out infinite;
}

.circle-2 {
  width: 150px;
  height: 150px;
  bottom: 20%;
  right: 10%;
  animation: float 8s ease-in-out infinite 2s;
}

.circle-3 {
  width: 100px;
  height: 100px;
  top: 50%;
  left: 80%;
  animation: float 10s ease-in-out infinite 1s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

/* 主容器 */
.reset-password-container {
  display: flex;
  max-width: 1200px;
  width: 100%;
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  min-height: 700px;
}

/* 品牌区域 */
.brand-section {
  flex: 1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand-content {
  text-align: center;
  width: 100%;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 2rem;
}

.logo i {
  font-size: 2rem;
}

.brand-title {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  font-weight: 700;
}

.brand-subtitle {
  font-size: 1.1rem;
  margin-bottom: 3rem;
  opacity: 0.9;
}

/* 安全提示 */
.security-tips {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  text-align: left;
  backdrop-filter: blur(10px);
}

.security-tips h3 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.security-tips ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.security-tips li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.security-tips li i {
  width: 16px;
}

/* 进度指示器 */
.progress-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.progress-step {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
}

.progress-step.active .step-icon {
  background: white;
  color: #667eea;
}

.progress-step:not(.active) .step-icon {
  background: rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.7);
}

.step-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.step-text {
  text-align: left;
  flex: 1;
}

.step-title {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.step-desc {
  font-size: 0.9rem;
  opacity: 0.8;
}

.progress-connector {
  width: 2px;
  height: 30px;
  background: rgba(255, 255, 255, 0.3);
  margin-left: 24px;
}

.progress-connector.active {
  background: white;
}

/* 表单区域 */
.form-section {
  flex: 1;
  padding: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-y: auto;
  max-height: 700px;
}

.form-card {
  width: 100%;
  max-width: 500px;
}

/* 表单头部 */
.form-header {
  text-align: center;
  margin-bottom: 2rem;
}

.form-header h2 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.form-header p {
  color: #6c757d;
  font-size: 1rem;
}

/* 表单样式 */
.password-form {
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input:disabled {
  background-color: #f8f9fa;
  cursor: not-allowed;
  opacity: 0.7;
}

.form-input.error {
  border-color: #dc3545;
}

.form-input.error:focus {
  border-color: #dc3545;
  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
}

.form-input.success {
  border-color: #28a745;
}

.form-input.success:focus {
  border-color: #28a745;
  box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.1);
}

/* 密码输入容器 */
.password-input-container {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.password-toggle:hover:not(:disabled) {
  background: #f8f9fa;
  color: #333;
}

.password-toggle:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 错误和成功消息 */
.error-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  animation: fadeIn 0.3s ease;
}

.success-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #28a745;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 密码强度指示器 */
.password-strength {
  margin-top: 1rem;
}

.strength-indicators {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.strength-bar {
  flex: 1;
  height: 6px;
  background: #e9ecef;
  border-radius: 3px;
  overflow: hidden;
  position: relative;
}

.strength-bar::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  transition: all 0.3s ease;
}

.strength-bar.weak::after {
  width: 33%;
  background: #dc3545;
}

.strength-bar.medium::after {
  width: 66%;
  background: #ffc107;
}

.strength-bar.strong::after {
  width: 100%;
  background: #28a745;
}

.strength-text {
  font-size: 0.875rem;
  color: #6c757d;
  min-width: 100px;
}

.password-requirements {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  font-size: 0.8rem;
}

.requirement {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6c757d;
}

.requirement.met {
  color: #28a745;
}

.requirement i {
  font-size: 0.7rem;
}

.requirement.met i {
  color: #28a745;
}

.requirement:not(.met) i {
  color: #dc3545;
}

/* 重置按钮 */
.reset-btn {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  margin-top: 1rem;
}

.reset-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.reset-btn:active:not(:disabled) {
  transform: translateY(0);
}

.reset-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* 成功页面 */
.success-section,
.error-section {
  text-align: center;
}

.success-icon,
.error-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
}

.success-icon {
  color: #28a745;
}

.error-icon {
  color: #dc3545;
}

.success-section h2,
.error-section h2 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 1rem;
}

.success-description,
.error-description {
  color: #6c757d;
  margin-bottom: 2rem;
  line-height: 1.5;
  font-size: 1.1rem;
}

.countdown-timer {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  color: #667eea;
  font-weight: 500;
}

.success-actions,
.error-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  justify-content: center;
}

.btn-primary,
.btn-secondary {
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover {
  background: #5a6fd8;
  transform: translateY(-1px);
}

.btn-secondary {
  background: #f8f9fa;
  color: #333;
  border: 1px solid #e9ecef;
}

.btn-secondary:hover {
  background: #e9ecef;
  transform: translateY(-1px);
}

/* 安全提醒 */
.security-reminder,
.help-links {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  text-align: left;
  margin-top: 2rem;
}

.security-reminder h3,
.help-links h3 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  color: #333;
  font-size: 1.1rem;
}

.security-reminder ul,
.help-links ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.security-reminder li {
  margin-bottom: 0.5rem;
  color: #6c757d;
  padding-left: 1.5rem;
  position: relative;
}

.security-reminder li::before {
  content: '•';
  position: absolute;
  left: 0.5rem;
  color: #667eea;
}

.help-links li {
  margin-bottom: 0.75rem;
}

.help-links a {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #667eea;
  text-decoration: none;
}

.help-links a:hover {
  text-decoration: underline;
}

/* 返回登录链接 */
.back-to-login {
  text-align: center;
  padding-top: 1.5rem;
  border-top: 1px solid #e9ecef;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
}

.back-link:hover {
  text-decoration: underline;
}

/* 加载动画 */
.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 消息提示 */
.message-toast {
  position: fixed;
  top: 20px;
  right: 20px;
  background: white;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  z-index: 1000;
  animation: slideIn 0.3s ease;
  border-left: 4px solid #28a745;
  max-width: 400px;
}

.message-toast.error {
  border-left-color: #dc3545;
}

.message-toast i {
  font-size: 1.2rem;
}

.message-toast:not(.error) i {
  color: #28a745;
}

.message-toast.error i {
  color: #dc3545;
}

.close-btn {
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  padding: 0;
  margin-left: auto;
}

.close-btn:hover {
  color: #495057;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .reset-password-container {
    flex-direction: column;
    max-width: 600px;
  }

  .brand-section {
    padding: 2rem;
  }

  .form-section {
    padding: 2rem;
  }
}

@media (max-width: 768px) {
  .reset-password-container {
    width: 95%;
    margin: 1rem;
  }

  .brand-title {
    font-size: 2rem;
  }

  .form-header h2 {
    font-size: 1.75rem;
  }

  .success-actions,
  .error-actions {
    flex-direction: column;
  }

  .password-requirements {
    grid-template-columns: 1fr;
  }

  .progress-step {
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }

  .progress-connector {
    width: 30px;
    height: 2px;
    margin-left: 0;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .circle {
    display: none;
  }
}

@media (max-width: 480px) {
  .brand-section,
  .form-section {
    padding: 1.5rem;
  }

  .brand-title {
    font-size: 1.75rem;
  }

  .logo {
    font-size: 1.25rem;
  }

  .form-input {
    padding: 10px 14px;
  }

  .reset-btn {
    padding: 14px;
  }

  .btn-primary,
  .btn-secondary {
    padding: 10px 20px;
  }
}
</style>
