<template>
  <div class="register-container">
    <div class="register-background">
      <div class="register-card">
        <!-- 头部 -->
        <div class="register-header">
          <div class="logo">
            <i class="fas fa-bolt"></i>
            <span>电工学学习系统</span>
          </div>
          <h1>用户注册</h1>
          <p>创建您的账户，开始学习之旅</p>
        </div>

        <!-- 注册表单 -->
        <form @submit.prevent="handleRegister" class="register-form">
          <div class="form-group">
            <label for="username">
              <i class="fas fa-user"></i>
              用户名
            </label>
            <input
              id="username"
              v-model="registerForm.username"
              type="text"
              placeholder="请输入用户名（4-16位字符）"
              required
              :class="{ error: errors.username }"
              @blur="validateUsername"
            />
            <span v-if="errors.username" class="error-message">{{ errors.username }}</span>
          </div>

          <div class="form-group">
            <label for="email">
              <i class="fas fa-envelope"></i>
              邮箱
            </label>
            <input
              id="email"
              v-model="registerForm.email"
              type="email"
              placeholder="请输入邮箱地址"
              required
              :class="{ error: errors.email }"
              @blur="validateEmail"
            />
            <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
          </div>

          <div class="form-group">
            <label for="password">
              <i class="fas fa-lock"></i>
              密码
            </label>
            <input
              id="password"
              v-model="registerForm.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="请输入密码（至少6位）"
              required
              :class="{ error: errors.password }"
              @blur="validatePassword"
            />
            <button
              type="button"
              class="password-toggle"
              @click="showPassword = !showPassword"
            >
              <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </button>
            <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
          </div>

          <div class="form-group">
            <label for="confirmPassword">
              <i class="fas fa-lock"></i>
              确认密码
            </label>
            <input
              id="confirmPassword"
              v-model="registerForm.confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="请再次输入密码"
              required
              :class="{ error: errors.confirmPassword }"
              @blur="validateConfirmPassword"
            />
            <button
              type="button"
              class="password-toggle"
              @click="showConfirmPassword = !showConfirmPassword"
            >
              <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </button>
            <span v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</span>
          </div>

          <div class="form-options">
            <label class="agree-terms">
              <input type="checkbox" v-model="registerForm.agreeTerms" required />
              <span>我已阅读并同意</span>
              <a href="#" @click.prevent="showTerms = true">《用户协议》</a>
              和
              <a href="#" @click.prevent="showPrivacy = true">《隐私政策》</a>
            </label>
          </div>

          <button
            type="submit"
            class="register-button"
            :disabled="loading"
            :class="{ loading: loading }"
          >
            <span v-if="!loading">注册</span>
            <span v-else>
              <i class="fas fa-spinner fa-spin"></i>
              注册中...
            </span>
          </button>
        </form>

        <!-- 登录链接 -->
        <div class="login-link">
          已有账户？
          <router-link to="/login">立即登录</router-link>
        </div>
      </div>
    </div>

    <!-- 协议弹窗 -->
    <div v-if="showTerms" class="modal-overlay" @click="showTerms = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>用户协议</h3>
          <button class="close-button" @click="showTerms = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="terms-content">
            <h4>欢迎使用电工学学习系统</h4>
            <p>请仔细阅读以下协议内容...</p>
            <!-- 具体的协议内容 -->
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-primary" @click="showTerms = false">
            我已阅读并同意
          </button>
        </div>
      </div>
    </div>

    <!-- 隐私政策弹窗 -->
    <div v-if="showPrivacy" class="modal-overlay" @click="showPrivacy = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>隐私政策</h3>
          <button class="close-button" @click="showPrivacy = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="privacy-content">
            <h4>隐私保护</h4>
            <p>我们重视您的隐私...</p>
            <!-- 具体的隐私政策内容 -->
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-primary" @click="showPrivacy = false">
            我已阅读并同意
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/modules/user'

export default {
  name: 'RegisterPage',
  setup() {
    const router = useRouter()
    const userStore = useUserStore()

    const registerForm = reactive({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeTerms: false
    })

    const errors = reactive({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    })

    const loading = ref(false)
    const showPassword = ref(false)
    const showConfirmPassword = ref(false)
    const showTerms = ref(false)
    const showPrivacy = ref(false)

    // 表单验证方法
    const validateUsername = () => {
      if (!registerForm.username.trim()) {
        errors.username = '请输入用户名'
      } else if (registerForm.username.length < 4) {
        errors.username = '用户名长度不能少于4位'
      } else if (registerForm.username.length > 16) {
        errors.username = '用户名长度不能超过16位'
      } else if (!/^[a-zA-Z0-9_]+$/.test(registerForm.username)) {
        errors.username = '用户名只能包含字母、数字和下划线'
      } else {
        errors.username = ''
      }
    }

    const validateEmail = () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!registerForm.email.trim()) {
        errors.email = '请输入邮箱地址'
      } else if (!emailRegex.test(registerForm.email)) {
        errors.email = '请输入有效的邮箱地址'
      } else {
        errors.email = ''
      }
    }

    const validatePassword = () => {
      if (!registerForm.password) {
        errors.password = '请输入密码'
      } else if (registerForm.password.length < 6) {
        errors.password = '密码长度不能少于6位'
      } else {
        errors.password = ''
      }
    }

    const validateConfirmPassword = () => {
      if (!registerForm.confirmPassword) {
        errors.confirmPassword = '请确认密码'
      } else if (registerForm.password !== registerForm.confirmPassword) {
        errors.confirmPassword = '两次输入的密码不一致'
      } else {
        errors.confirmPassword = ''
      }
    }

    // 处理注册
    const handleRegister = async () => {
      // 验证所有字段
      validateUsername()
      validateEmail()
      validatePassword()
      validateConfirmPassword()

      // 检查是否有错误
      if (Object.values(errors).some(error => error) || !registerForm.agreeTerms) {
        if (!registerForm.agreeTerms) {
          alert('请同意用户协议和隐私政策')
        }
        return
      }

      loading.value = true

      try {
        const result = await userStore.register({
          username: registerForm.username,
          email: registerForm.email,
          password: registerForm.password
        })

        if (result.success) {
          alert('注册成功！')
          router.push('/login') // 注册成功后跳转到登录页面
        } else {
          alert(result.message)
        }
      } catch (error) {
        alert('注册失败：' + error.message)
      } finally {
        loading.value = false
      }
    }

    return {
      registerForm,
      errors,
      loading,
      showPassword,
      showConfirmPassword,
      showTerms,
      showPrivacy,
      validateUsername,
      validateEmail,
      validatePassword,
      validateConfirmPassword,
      handleRegister
    }
  }
}
</script>

<style scoped lang="scss">
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;

  .register-background {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    padding: 2px;
  }

  .register-card {
    background: white;
    padding: 40px;
    border-radius: 18px;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
    width: 450px;
    max-width: 90vw;

    .register-header {
      text-align: center;
      margin-bottom: 30px;

      .logo {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        margin-bottom: 20px;
        color: #667eea;
        font-size: 18px;
        font-weight: 600;

        i {
          font-size: 24px;
        }
      }

      h1 {
        color: #2d3748;
        margin-bottom: 8px;
        font-size: 28px;
        font-weight: 700;
      }

      p {
        color: #718096;
        font-size: 14px;
      }
    }

    .register-form {
      .form-group {
        margin-bottom: 20px;
        position: relative;

        label {
          display: block;
          margin-bottom: 8px;
          color: #4a5568;
          font-weight: 500;
          font-size: 14px;

          i {
            margin-right: 8px;
            color: #a0aec0;
          }
        }

        input {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 14px;
          transition: all 0.3s ease;

          &:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
          }

          &.error {
            border-color: #e53e3e;
          }
        }

        .password-toggle {
          position: absolute;
          right: 12px;
          top: 38px;
          background: none;
          border: none;
          color: #a0aec0;
          cursor: pointer;
          padding: 4px;

          &:hover {
            color: #667eea;
          }
        }

        .error-message {
          color: #e53e3e;
          font-size: 12px;
          margin-top: 4px;
          display: block;
        }
      }

      .form-options {
        margin-bottom: 25px;

        .agree-terms {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          color: #4a5568;
          cursor: pointer;
          font-size: 14px;
          line-height: 1.4;

          input {
            margin-top: 2px;
          }

          a {
            color: #667eea;
            text-decoration: none;

            &:hover {
              text-decoration: underline;
            }
          }
        }
      }

      .register-button {
        width: 100%;
        padding: 14px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
        }

        &:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        &.loading {
          background: #a0aec0;
        }
      }
    }

    .login-link {
      text-align: center;
      margin-top: 30px;
      color: #718096;
      font-size: 14px;

      a {
        color: #667eea;
        text-decoration: none;
        font-weight: 500;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;

    .modal-content {
      background: white;
      border-radius: 12px;
      padding: 0;
      width: 500px;
      max-width: 90vw;
      max-height: 80vh;
      overflow: hidden;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);

      .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 24px;
        border-bottom: 1px solid #e2e8f0;

        h3 {
          margin: 0;
          color: #2d3748;
        }

        .close-button {
          background: none;
          border: none;
          font-size: 18px;
          color: #a0aec0;
          cursor: pointer;
          padding: 4px;

          &:hover {
            color: #4a5568;
          }
        }
      }

      .modal-body {
        padding: 24px;
        overflow-y: auto;
        max-height: 400px;

        .terms-content,
        .privacy-content {
          h4 {
            margin-bottom: 16px;
            color: #2d3748;
          }

          p {
            margin-bottom: 12px;
            color: #4a5568;
            line-height: 1.6;
          }
        }
      }

      .modal-footer {
        padding: 16px 24px;
        border-top: 1px solid #e2e8f0;
        display: flex;
        justify-content: flex-end;

        button {
          padding: 10px 20px;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;

          &:hover {
            background: #5a67d8;
          }
        }
      }
    }
  }
}

@media (max-width: 480px) {
  .register-container {
    padding: 10px;

    .register-card {
      padding: 30px 20px;
    }
  }
}
</style>
