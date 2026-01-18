<template>
  <div class="phone-login">
    <form @submit.prevent="handlePhoneLogin" class="login-form">
      <div class="form-group">
        <label for="phone" class="form-label">
          <i class="fas fa-mobile-alt"></i>
          手机号码
        </label>
        <input
          id="phone"
          v-model="form.phone"
          type="tel"
          class="form-input"
          :class="{ error: fieldErrors.phone }"
          placeholder="请输入手机号码"
          required
          :disabled="loading"
          @input="clearFieldError('phone')"
        >
        <div v-if="fieldErrors.phone" class="error-message">
          <i class="fas fa-exclamation-circle"></i>
          {{ fieldErrors.phone }}
        </div>
      </div>

      <div class="form-group">
        <label for="code" class="form-label">
          <i class="fas fa-sms"></i>
          验证码
        </label>
        <div class="code-input-container">
          <input
            id="code"
            v-model="form.code"
            type="text"
            class="form-input"
            :class="{ error: fieldErrors.code }"
            placeholder="请输入6位验证码"
            maxlength="6"
            required
            :disabled="loading"
            @input="clearFieldError('code')"
          >
          <button
            type="button"
            class="code-btn"
            :disabled="countdown > 0 || loading || !isPhoneValid"
            @click="sendVerificationCode"
          >
            <span v-if="countdown > 0" class="countdown-text">
              {{ countdown }}s
            </span>
            <span v-else class="code-text">
              获取验证码
            </span>
          </button>
        </div>
        <div v-if="fieldErrors.code" class="error-message">
          <i class="fas fa-exclamation-circle"></i>
          {{ fieldErrors.code }}
        </div>
        <div v-if="codeSent && countdown > 0" class="code-hint">
          <i class="fas fa-info-circle"></i>
          验证码已发送，请查收短信
        </div>
      </div>

      <div class="agreement">
        <label class="checkbox-label">
          <input
            v-model="form.agreed"
            type="checkbox"
            class="checkbox"
            :disabled="loading"
          >
          <span class="checkmark"></span>
          我已阅读并同意
          <a href="#" class="agreement-link">《用户协议》</a>
          和
          <a href="#" class="agreement-link">《隐私政策》</a>
        </label>
      </div>

      <button
        type="submit"
        class="login-btn"
        :disabled="loading || !isFormValid"
      >
        <span v-if="loading" class="loading-spinner"></span>
        <i v-else class="fas fa-sign-in-alt"></i>
        {{ loading ? '登录中...' : '登录/注册' }}
      </button>
    </form>

    <div class="divider">
      <span>或使用其他方式登录</span>
    </div>

    <div class="alternative-login">
      <button
        type="button"
        class="alt-login-btn password-login"
        @click="switchToPasswordLogin"
        :disabled="loading"
      >
        <i class="fas fa-key"></i>
        <span>密码登录</span>
      </button>
      <button
        type="button"
        class="alt-login-btn wechat-login"
        @click="switchToWechatLogin"
        :disabled="loading"
      >
        <i class="fab fa-weixin"></i>
        <span>微信登录</span>
      </button>
    </div>

    <!-- 演示手机号 -->
    <div class="demo-accounts" v-if="showDemoPhones">
      <div class="demo-header">
        <i class="fas fa-info-circle"></i>
        <span>演示手机号</span>
      </div>
      <div class="demo-list">
        <div class="demo-account" v-for="phone in demoPhones" :key="phone">
          <div class="demo-info">
            <strong>{{ phone }}</strong>
            <span>验证码: 123456</span>
          </div>
          <button
            type="button"
            class="demo-btn"
            @click="fillDemoPhone(phone)"
            :disabled="loading"
          >
            一键填充
          </button>
        </div>
      </div>
    </div>

    <!-- 验证码发送状态 -->
    <div v-if="codeSending" class="sending-overlay">
      <div class="sending-content">
        <div class="sending-spinner"></div>
        <p>正在发送验证码...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/modules/user'

// 发射事件
const emit = defineEmits(['login-success', 'switch-login'])

const router = useRouter()
const userStore = useUserStore()

// 响应式数据
const form = reactive({
  phone: '',
  code: '',
  agreed: true
})

const loading = ref(false)
const codeSending = ref(false)
const countdown = ref(0)
const codeSent = ref(false)
const fieldErrors = reactive({
  phone: '',
  code: ''
})

// 演示手机号配置
const showDemoPhones = ref(true)
const demoPhones = ref([
  '13800000001',
  '13800000002',
  '13800000003'
])

// 计算属性
const isPhoneValid = computed(() => {
  const phoneRegex = /^1[3-9]\d{9}$/
  return phoneRegex.test(form.phone)
})

const isFormValid = computed(() => {
  return isPhoneValid.value &&
         form.code.length === 6 &&
         form.agreed
})

// 清除字段错误
const clearFieldError = (field) => {
  if (fieldErrors[field]) {
    fieldErrors[field] = ''
  }
}

// 验证表单
const validateForm = () => {
  let isValid = true

  // 清除之前的错误
  Object.keys(fieldErrors).forEach(key => {
    fieldErrors[key] = ''
  })

  // 验证手机号
  if (!form.phone.trim()) {
    fieldErrors.phone = '请输入手机号码'
    isValid = false
  } else if (!isPhoneValid.value) {
    fieldErrors.phone = '请输入正确的手机号码'
    isValid = false
  }

  // 验证验证码
  if (!form.code.trim()) {
    fieldErrors.code = '请输入验证码'
    isValid = false
  } else if (form.code.length !== 6) {
    fieldErrors.code = '验证码必须是6位数字'
    isValid = false
  }

  // 验证协议
  if (!form.agreed) {
    // 这里可以添加协议未同意的提示
    console.warn('请同意用户协议和隐私政策')
  }

  return isValid
}

// 发送验证码
const sendVerificationCode = async () => {
  if (!isPhoneValid.value) {
    fieldErrors.phone = '请输入正确的手机号码'
    return
  }

  codeSending.value = true

  try {
    const result = await userStore.sendVerificationCode(form.phone)

    if (result.success) {
      codeSent.value = true
      startCountdown()
      console.log('✅ 验证码发送成功')
    } else {
      fieldErrors.phone = result.message || '发送验证码失败'
    }
  } catch (error) {
    console.error('发送验证码异常:', error)
    fieldErrors.phone = '发送验证码失败，请稍后重试'
  } finally {
    codeSending.value = false
  }
}

// 处理手机登录
const handlePhoneLogin = async () => {
  if (!validateForm()) {
    return
  }

  loading.value = true

  try {
    const result = await userStore.phoneLoginAction({
      phone: form.phone,
      code: form.code
    })

    if (result.success) {
      console.log('✅ 手机验证码登录成功')

      // 触发登录成功事件
      emit('login-success')
    } else {
      // 处理登录失败
      handleLoginError(result.message)
    }
  } catch (error) {
    console.error('登录异常:', error)
    handleLoginError('登录失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 处理登录错误
const handleLoginError = (message) => {
  // 根据错误消息设置对应的字段错误
  if (message.includes('手机') || message.includes('号码')) {
    fieldErrors.phone = message
  } else if (message.includes('验证码')) {
    fieldErrors.code = message
  } else {
    // 通用错误，显示在验证码字段
    fieldErrors.code = message
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

// 切换到密码登录
const switchToPasswordLogin = () => {
  emit('switch-login', 'password')
}

// 切换到微信登录
const switchToWechatLogin = () => {
  emit('switch-login', 'wechat')
}

// 填充演示手机号
const fillDemoPhone = (phone) => {
  form.phone = phone
  form.code = '123456' // 演示验证码

  // 清除可能的错误信息
  clearFieldError('phone')
  clearFieldError('code')
}

// 从本地存储恢复上次使用的手机号
const restoreLastPhone = () => {
  const lastPhone = localStorage.getItem('lastPhone')
  if (lastPhone) {
    form.phone = lastPhone
  }
}

// 保存手机号到本地存储
const savePhoneToStorage = () => {
  if (isPhoneValid.value) {
    localStorage.setItem('lastPhone', form.phone)
  }
}

// 组件挂载时恢复上次使用的手机号
onMounted(() => {
  restoreLastPhone()
})
</script>

<style scoped>
.phone-login {
  width: 100%;
  position: relative;
}

.login-form {
  margin-bottom: 1.5rem;
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

/* 验证码输入容器 */
.code-input-container {
  display: flex;
  gap: 1rem;
}

.code-input-container .form-input {
  flex: 1;
}

.code-btn {
  padding: 0 1.5rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  min-width: 120px;
}

.code-btn:hover:not(:disabled) {
  background: #5a6fd8;
  transform: translateY(-1px);
}

.code-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
  transform: none;
}

.countdown-text {
  font-weight: 600;
}

.code-text {
  font-weight: 500;
}

/* 错误消息 */
.error-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  animation: fadeIn 0.3s ease;
}

.code-hint {
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

/* 协议同意 */
.agreement {
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  cursor: pointer;
  color: #555;
  user-select: none;
  line-height: 1.4;
}

.checkbox {
  display: none;
}

.checkmark {
  width: 18px;
  height: 18px;
  border: 2px solid #ddd;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  background: white;
  flex-shrink: 0;
  margin-top: 0.1rem;
}

.checkbox:checked + .checkmark {
  background: #667eea;
  border-color: #667eea;
}

.checkbox:checked + .checkmark::after {
  content: '✓';
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.checkbox:disabled + .checkmark {
  opacity: 0.5;
  cursor: not-allowed;
}

.agreement-link {
  color: #667eea;
  text-decoration: none;
}

.agreement-link:hover {
  text-decoration: underline;
}

/* 登录按钮 */
.login-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.login-btn:active:not(:disabled) {
  transform: translateY(0);
}

.login-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* 分割线 */
.divider {
  position: relative;
  text-align: center;
  margin: 2rem 0;
  color: #6c757d;
  font-size: 0.9rem;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #e9ecef;
  z-index: 1;
}

.divider span {
  background: white;
  padding: 0 1rem;
  position: relative;
  z-index: 2;
}

/* 其他登录方式 */
.alternative-login {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 2rem;
}

.alt-login-btn {
  padding: 12px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #555;
}

.alt-login-btn:hover:not(:disabled) {
  border-color: #667eea;
  background: #f8f9ff;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.alt-login-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.alt-login-btn i {
  font-size: 1.25rem;
}

.password-login:hover:not(:disabled) i {
  color: #667eea;
}

.wechat-login:hover:not(:disabled) i {
  color: #09bb07;
}

/* 演示账户 */
.demo-accounts {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
  border-left: 4px solid #667eea;
}

.demo-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  font-weight: 500;
  color: #333;
  font-size: 0.9rem;
}

.demo-header i {
  color: #667eea;
}

.demo-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.demo-account {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background: white;
  border-radius: 4px;
  font-size: 0.85rem;
}

.demo-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.demo-info strong {
  color: #333;
}

.demo-info span {
  color: #6c757d;
  font-size: 0.8rem;
}

.demo-btn {
  padding: 4px 8px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.demo-btn:hover:not(:disabled) {
  background: #5a6fd8;
  transform: translateY(-1px);
}

.demo-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 发送验证码遮罩 */
.sending-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  z-index: 10;
}

.sending-content {
  text-align: center;
  color: #667eea;
}

.sending-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

.sending-content p {
  margin: 0;
  font-weight: 500;
}

/* 加载动画 */
.loading-spinner {
  width: 18px;
  height: 18px;
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

/* 响应式设计 */
@media (max-width: 768px) {
  .alternative-login {
    grid-template-columns: 1fr;
  }

  .code-input-container {
    flex-direction: column;
  }

  .code-btn {
    min-width: auto;
    padding: 10px;
  }

  .demo-account {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .demo-btn {
    align-self: flex-end;
  }
}

@media (max-width: 480px) {
  .form-input {
    padding: 10px 14px;
  }

  .login-btn {
    padding: 12px;
  }

  .alt-login-btn {
    padding: 10px;
  }

  .checkbox-label {
    font-size: 0.85rem;
  }
}
</style>
