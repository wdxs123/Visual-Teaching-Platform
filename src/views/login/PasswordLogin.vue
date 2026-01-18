<template>
  <div class="password-login">
    <form @submit.prevent="handlePasswordLogin" class="login-form">
      <div class="form-group">
        <label for="login" class="form-label">
          <i class="fas fa-user"></i>
          用户名/邮箱
        </label>
        <input
          id="login"
          v-model="form.login"
          type="text"
          class="form-input"
          :class="{ error: fieldErrors.login }"
          placeholder="请输入用户名或邮箱"
          required
          :disabled="loading"
          @input="clearFieldError('login')"
        >
        <div v-if="fieldErrors.login" class="error-message">
          <i class="fas fa-exclamation-circle"></i>
          {{ fieldErrors.login }}
        </div>
      </div>

      <div class="form-group">
        <label for="password" class="form-label">
          <i class="fas fa-lock"></i>
          密码
        </label>
        <div class="password-input-container">
          <input
            id="password"
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            class="form-input"
            :class="{ error: fieldErrors.password }"
            placeholder="请输入密码"
            required
            :disabled="loading"
            @input="clearFieldError('password')"
          >
          <button
            type="button"
            class="password-toggle"
            @click="showPassword = !showPassword"
            :disabled="loading"
          >
            <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
          </button>
        </div>
        <div v-if="fieldErrors.password" class="error-message">
          <i class="fas fa-exclamation-circle"></i>
          {{ fieldErrors.password }}
        </div>
      </div>

      <div class="form-options">
        <label class="checkbox-label">
          <input
            v-model="form.remember"
            type="checkbox"
            class="checkbox"
            :disabled="loading"
          >
          <span class="checkmark"></span>
          记住我
        </label>
        <router-link to="/forgot-password" class="forgot-password">
          忘记密码？
        </router-link>
      </div>

      <button
        type="submit"
        class="login-btn"
        :disabled="loading || !isFormValid"
      >
        <span v-if="loading" class="loading-spinner"></span>
        <i v-else class="fas fa-sign-in-alt"></i>
        {{ loading ? '登录中...' : '登录' }}
      </button>
    </form>

    <div class="divider">
      <span>或使用其他方式登录</span>
    </div>

    <div class="alternative-login">
      <button
        type="button"
        class="alt-login-btn phone-login"
        @click="switchToPhoneLogin"
        :disabled="loading"
      >
        <i class="fas fa-mobile-alt"></i>
        <span>手机验证码登录</span>
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

    <!-- 演示账户提示 -->
    <div class="demo-accounts" v-if="showDemoAccounts">
      <div class="demo-header">
        <i class="fas fa-info-circle"></i>
        <span>演示账户</span>
      </div>
      <div class="demo-list">
        <div class="demo-account" v-for="account in demoAccounts" :key="account.username">
          <div class="demo-info">
            <strong>{{ account.username }}</strong>
            <span>密码: {{ account.password }}</span>
          </div>
          <button
            type="button"
            class="demo-btn"
            @click="fillDemoAccount(account)"
            :disabled="loading"
          >
            一键填充
          </button>
        </div>
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
  login: '',
  password: '',
  remember: false
})

const loading = ref(false)
const showPassword = ref(false)
const fieldErrors = reactive({
  login: '',
  password: ''
})

// 演示账户配置
const showDemoAccounts = ref(true)
const demoAccounts = ref([
  { username: 'demo@example.com', password: '123456' },
  { username: 'testuser', password: 'test123' },
  { username: 'admin', password: 'admin123' }
])

// 计算属性
const isFormValid = computed(() => {
  return form.login.trim() && form.password.trim()
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

  // 验证登录名
  if (!form.login.trim()) {
    fieldErrors.login = '请输入用户名或邮箱'
    isValid = false
  }

  // 验证密码
  if (!form.password.trim()) {
    fieldErrors.password = '请输入密码'
    isValid = false
  } else if (form.password.length < 6) {
    fieldErrors.password = '密码长度至少6位'
    isValid = false
  }

  return isValid
}

// 处理密码登录
const handlePasswordLogin = async () => {
  if (!validateForm()) {
    return
  }

  loading.value = true

  try {
    const result = await userStore.login({
      login: form.login.trim(),
      password: form.password
    })

    if (result.success) {
      console.log('✅ 密码登录成功')

      // 如果选择了记住我，保存登录信息到本地存储
      if (form.remember) {
        localStorage.setItem('rememberMe', 'true')
        localStorage.setItem('lastLogin', form.login)
      } else {
        localStorage.removeItem('rememberMe')
        localStorage.removeItem('lastLogin')
      }

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
  if (message.includes('用户名') || message.includes('邮箱')) {
    fieldErrors.login = message
  } else if (message.includes('密码')) {
    fieldErrors.password = message
  } else {
    // 通用错误，可以显示在顶部或使用其他方式提示
    console.error('登录错误:', message)
    fieldErrors.login = message // 临时显示在用户名字段
  }
}

// 切换到手机登录
const switchToPhoneLogin = () => {
  emit('switch-login', 'phone')
}

// 切换到微信登录
const switchToWechatLogin = () => {
  emit('switch-login', 'wechat')
}

// 填充演示账户
const fillDemoAccount = (account) => {
  form.login = account.username
  form.password = account.password
  form.remember = true

  // 清除可能的错误信息
  clearFieldError('login')
  clearFieldError('password')
}

// 从本地存储恢复记住的登录名
const restoreRememberedLogin = () => {
  const rememberMe = localStorage.getItem('rememberMe')
  const lastLogin = localStorage.getItem('lastLogin')

  if (rememberMe === 'true' && lastLogin) {
    form.login = lastLogin
    form.remember = true
  }
}

// 组件挂载时恢复记住的登录名
onMounted(() => {
  restoreRememberedLogin()
})
</script>

<style scoped>
.password-login {
  width: 100%;
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

/* 表单选项 */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  color: #555;
  user-select: none;
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

.forgot-password {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.forgot-password:hover {
  color: #5a6fd8;
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

.phone-login:hover:not(:disabled) i {
  color: #28a745;
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

  .form-options {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
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
}
</style>
