<template>
  <div class="forgot-password-page">
    <!-- 背景装饰 -->
    <div class="background-decoration">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
    </div>

    <!-- 主要内容 -->
    <div class="forgot-password-container">
      <!-- 左侧品牌区域 -->
      <div class="brand-section">
        <div class="brand-content">
          <div class="logo">
            <i class="fas fa-bolt"></i>
            <span>电气工程学习平台</span>
          </div>
          <h1 class="brand-title">找回密码</h1>
          <p class="brand-subtitle">重置您的账户密码，重新开始学习之旅</p>
          <div class="steps">
            <div class="step" :class="{ active: currentStep >= 1, completed: currentStep > 1 }">
              <div class="step-number">1</div>
              <div class="step-text">验证身份</div>
            </div>
            <div class="step-line" :class="{ active: currentStep > 1 }"></div>
            <div class="step" :class="{ active: currentStep >= 2, completed: currentStep > 2 }">
              <div class="step-number">2</div>
              <div class="step-text">重置密码</div>
            </div>
            <div class="step-line" :class="{ active: currentStep > 2 }"></div>
            <div class="step" :class="{ active: currentStep >= 3, completed: currentStep > 3 }">
              <div class="step-number">3</div>
              <div class="step-text">完成</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧表单区域 -->
      <div class="form-section">
        <div class="form-card">
          <!-- 步骤1: 输入邮箱 -->
          <div v-if="currentStep === 1" class="step-content">
            <h2>验证您的邮箱</h2>
            <p class="step-description">
              请输入您注册时使用的邮箱地址，我们将向该邮箱发送验证码
            </p>

            <form @submit.prevent="handleSendCode" class="forgot-password-form">
              <div class="form-group">
                <label for="email" class="form-label">
                  <i class="fas fa-envelope"></i>
                  邮箱地址
                </label>
                <input
                  id="email"
                  v-model="email"
                  type="email"
                  class="form-input"
                  placeholder="请输入您的邮箱地址"
                  required
                  :disabled="loading"
                >
                <div v-if="emailError" class="error-message">
                  <i class="fas fa-exclamation-circle"></i>
                  {{ emailError }}
                </div>
              </div>

              <button
                type="submit"
                class="submit-btn"
                :disabled="loading || !email"
              >
                <span v-if="loading" class="loading-spinner"></span>
                {{ loading ? '发送中...' : '发送验证码' }}
              </button>
            </form>

            <div class="back-to-login">
              <router-link to="/login" class="back-link">
                <i class="fas fa-arrow-left"></i>
                返回登录
              </router-link>
            </div>
          </div>

          <!-- 步骤2: 输入验证码和新密码 -->
          <div v-else-if="currentStep === 2" class="step-content">
            <h2>重置密码</h2>
            <p class="step-description">
              我们已向 <strong>{{ email }}</strong> 发送了验证码，请输入验证码并设置新密码
            </p>

            <form @submit.prevent="handleResetPassword" class="forgot-password-form">
              <div class="form-group">
                <label for="code" class="form-label">
                  <i class="fas fa-shield-alt"></i>
                  验证码
                </label>
                <div class="code-input-container">
                  <input
                    id="code"
                    v-model="code"
                    type="text"
                    class="form-input"
                    placeholder="请输入6位验证码"
                    maxlength="6"
                    required
                    :disabled="loading"
                  >
                  <button
                    type="button"
                    class="resend-btn"
                    :disabled="countdown > 0"
                    @click="resendCode"
                  >
                    {{ countdown > 0 ? `${countdown}s后重新发送` : '重新发送' }}
                  </button>
                </div>
              </div>

              <div class="form-group">
                <label for="newPassword" class="form-label">
                  <i class="fas fa-lock"></i>
                  新密码
                </label>
                <div class="password-input-container">
                  <input
                    id="newPassword"
                    v-model="newPassword"
                    :type="showNewPassword ? 'text' : 'password'"
                    class="form-input"
                    placeholder="请输入新密码（至少6位）"
                    required
                    :disabled="loading"
                  >
                  <button
                    type="button"
                    class="password-toggle"
                    @click="showNewPassword = !showNewPassword"
                  >
                    <i :class="showNewPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                  </button>
                </div>
                <div class="password-strength" :class="passwordStrength">
                  <div class="strength-bar">
                    <div class="strength-fill"></div>
                  </div>
                  <span class="strength-text">{{ passwordStrengthText }}</span>
                </div>
              </div>

              <div class="form-group">
                <label for="confirmPassword" class="form-label">
                  <i class="fas fa-lock"></i>
                  确认新密码
                </label>
                <div class="password-input-container">
                  <input
                    id="confirmPassword"
                    v-model="confirmPassword"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    class="form-input"
                    placeholder="请再次输入新密码"
                    required
                    :disabled="loading"
                  >
                  <button
                    type="button"
                    class="password-toggle"
                    @click="showConfirmPassword = !showConfirmPassword"
                  >
                    <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                  </button>
                </div>
                <div v-if="passwordError" class="error-message">
                  <i class="fas fa-exclamation-circle"></i>
                  {{ passwordError }}
                </div>
              </div>

              <div class="form-actions">
                <button
                  type="button"
                  class="btn-secondary"
                  @click="currentStep = 1"
                  :disabled="loading"
                >
                  <i class="fas fa-arrow-left"></i>
                  上一步
                </button>
                <button
                  type="submit"
                  class="submit-btn"
                  :disabled="loading || !isFormValid"
                >
                  <span v-if="loading" class="loading-spinner"></span>
                  {{ loading ? '重置中...' : '重置密码' }}
                </button>
              </div>
            </form>
          </div>

          <!-- 步骤3: 完成 -->
          <div v-else class="step-content">
            <div class="success-content">
              <div class="success-icon">
                <i class="fas fa-check-circle"></i>
              </div>
              <h2>密码重置成功！</h2>
              <p class="success-description">
                您的密码已成功重置，现在可以使用新密码登录您的账户
              </p>

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

              <div class="security-tips">
                <h3>安全提示</h3>
                <ul>
                  <li><i class="fas fa-shield-alt"></i> 请妥善保管您的密码</li>
                  <li><i class="fas fa-sync-alt"></i> 定期更换密码以提高安全性</li>
                  <li><i class="fas fa-user-shield"></i> 不要在其他网站使用相同密码</li>
                </ul>
              </div>
            </div>
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
import { ref, reactive, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/modules/user'

const router = useRouter()
const userStore = useUserStore()

// 响应式数据
const currentStep = ref(1)
const email = ref('')
const code = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const message = ref('')
const isSuccess = ref(false)
const emailError = ref('')
const passwordError = ref('')
const countdown = ref(0)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

// 计算属性
const passwordStrength = computed(() => {
  if (!newPassword.value) return 'empty'
  if (newPassword.value.length < 6) return 'weak'
  if (newPassword.value.length < 8) return 'medium'
  return 'strong'
})

const passwordStrengthText = computed(() => {
  switch (passwordStrength.value) {
    case 'weak': return '密码强度：弱'
    case 'medium': return '密码强度：中'
    case 'strong': return '密码强度：强'
    default: return '请输入密码'
  }
})

const isFormValid = computed(() => {
  return code.value &&
         newPassword.value &&
         confirmPassword.value &&
         newPassword.value === confirmPassword.value &&
         newPassword.value.length >= 6
})

// 监听密码变化
watch([newPassword, confirmPassword], () => {
  if (confirmPassword.value && newPassword.value !== confirmPassword.value) {
    passwordError.value = '两次输入的密码不一致'
  } else {
    passwordError.value = ''
  }
})

// 发送验证码
const handleSendCode = async () => {
  if (!email.value) {
    emailError.value = '请输入邮箱地址'
    return
  }

  // 简单的邮箱格式验证
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.value)) {
    emailError.value = '请输入有效的邮箱地址'
    return
  }

  loading.value = true
  emailError.value = ''

  try {
    const result = await userStore.sendPasswordResetCode(email.value)

    if (result.success) {
      isSuccess.value = true
      message.value = result.message
      currentStep.value = 2
      startCountdown()
    } else {
      isSuccess.value = false
      message.value = result.message
      emailError.value = result.message
    }
  } catch (error) {
    isSuccess.value = false
    message.value = '发送验证码失败，请稍后重试'
    emailError.value = '发送验证码失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

// 重新发送验证码
const resendCode = async () => {
  if (countdown.value > 0) return

  loading.value = true
  try {
    const result = await userStore.sendPasswordResetCode(email.value)

    if (result.success) {
      isSuccess.value = true
      message.value = '验证码已重新发送'
      startCountdown()
    } else {
      isSuccess.value = false
      message.value = result.message
    }
  } catch (error) {
    isSuccess.value = false
    message.value = '发送验证码失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

// 重置密码
const handleResetPassword = async () => {
  if (!isFormValid.value) return

  loading.value = true
  passwordError.value = ''

  try {
    const result = await userStore.resetPassword(
      email.value,
      code.value,
      newPassword.value
    )

    if (result.success) {
      isSuccess.value = true
      message.value = result.message
      currentStep.value = 3
    } else {
      isSuccess.value = false
      message.value = result.message
      passwordError.value = result.message
    }
  } catch (error) {
    isSuccess.value = false
    message.value = '重置密码失败，请稍后重试'
    passwordError.value = '重置密码失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

// 开始倒计时
const startCountdown = () => {
  countdown.value = 60
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}
</script>

<style scoped>
.forgot-password-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
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
.forgot-password-container {
  display: flex;
  max-width: 1000px;
  width: 90%;
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  min-height: 600px;
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

/* 步骤指示器 */
.steps {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2rem;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.step-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  transition: all 0.3s ease;
}

.step.active .step-number {
  background: white;
  color: #667eea;
}

.step.completed .step-number {
  background: #28a745;
  color: white;
}

.step-text {
  font-size: 0.9rem;
  opacity: 0.7;
}

.step.active .step-text {
  opacity: 1;
  font-weight: 500;
}

.step-line {
  width: 60px;
  height: 2px;
  background: rgba(255, 255, 255, 0.2);
  margin: 0 1rem;
  transition: all 0.3s ease;
}

.step-line.active {
  background: white;
}

/* 表单区域 */
.form-section {
  flex: 1;
  padding: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-card {
  width: 100%;
  max-width: 400px;
}

.step-content h2 {
  font-size: 1.75rem;
  margin-bottom: 0.5rem;
  color: #333;
}

.step-description {
  color: #6c757d;
  margin-bottom: 2rem;
  line-height: 1.5;
}

/* 表单样式 */
.forgot-password-form {
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
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input:disabled {
  background-color: #f8f9fa;
  cursor: not-allowed;
}

/* 验证码输入容器 */
.code-input-container {
  display: flex;
  gap: 1rem;
}

.code-input-container .form-input {
  flex: 1;
}

.resend-btn {
  padding: 0 1rem;
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  color: #667eea;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.resend-btn:hover:not(:disabled) {
  background: #667eea;
  color: white;
}

.resend-btn:disabled {
  background: #f8f9fa;
  color: #6c757d;
  cursor: not-allowed;
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
}

.password-toggle:hover {
  color: #333;
}

/* 密码强度指示器 */
.password-strength {
  margin-top: 0.5rem;
}

.strength-bar {
  height: 4px;
  background: #e9ecef;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 0.25rem;
}

.strength-fill {
  height: 100%;
  transition: all 0.3s ease;
}

.password-strength.weak .strength-fill {
  width: 33%;
  background: #dc3545;
}

.password-strength.medium .strength-fill {
  width: 66%;
  background: #ffc107;
}

.password-strength.strong .strength-fill {
  width: 100%;
  background: #28a745;
}

.strength-text {
  font-size: 0.8rem;
  color: #6c757d;
}

/* 错误消息 */
.error-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

/* 按钮样式 */
.submit-btn {
  width: 100%;
  padding: 12px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.submit-btn:hover:not(:disabled) {
  background: #5a6fd8;
  transform: translateY(-1px);
}

.submit-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
  transform: none;
}

/* 表单操作 */
.form-actions {
  display: flex;
  gap: 1rem;
}

.btn-secondary {
  flex: 1;
  padding: 12px;
  background: #f8f9fa;
  color: #333;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-secondary:hover:not(:disabled) {
  background: #e9ecef;
}

.btn-secondary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 返回登录 */
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

/* 成功内容 */
.success-content {
  text-align: center;
}

.success-icon {
  font-size: 4rem;
  color: #28a745;
  margin-bottom: 1.5rem;
}

.success-description {
  color: #6c757d;
  margin-bottom: 2rem;
  line-height: 1.5;
}

.success-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.btn-primary {
  flex: 1;
  padding: 12px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-primary:hover {
  background: #5a6fd8;
  transform: translateY(-1px);
}

.security-tips {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  text-align: left;
}

.security-tips h3 {
  margin-bottom: 1rem;
  color: #333;
}

.security-tips ul {
  list-style: none;
  padding: 0;
}

.security-tips li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  color: #6c757d;
}

/* 加载动画 */
.loading-spinner {
  width: 16px;
  height: 16px;
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
@media (max-width: 768px) {
  .forgot-password-container {
    flex-direction: column;
    width: 95%;
    margin: 1rem;
  }

  .brand-section {
    padding: 2rem;
  }

  .form-section {
    padding: 2rem;
  }

  .brand-title {
    font-size: 2rem;
  }

  .steps {
    flex-wrap: wrap;
    gap: 1rem;
  }

  .step-line {
    display: none;
  }

  .form-actions {
    flex-direction: column;
  }

  .success-actions {
    flex-direction: column;
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

  .code-input-container {
    flex-direction: column;
  }

  .resend-btn {
    padding: 8px 12px;
  }
}
</style>
