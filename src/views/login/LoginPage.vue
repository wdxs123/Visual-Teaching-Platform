<template>
  <div class="login-container">
    <div class="login-background">
      <div class="login-card">
        <!-- 头部 -->
        <div class="login-header">
          <div class="logo">
            <i class="fas fa-bolt"></i>
            <span>电工学学习系统</span>
          </div>
          <h1>用户登录</h1>
          <p>欢迎回来，请登录您的账户</p>
        </div>

        <!-- 登录表单 -->
        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label for="username">
              <i class="fas fa-user"></i>
              用户名
            </label>
            <input
              id="username"
              v-model="loginForm.username"
              type="text"
              placeholder="请输入用户名"
              required
              :class="{ error: errors.username }"
            />
            <span v-if="errors.username" class="error-message">{{ errors.username }}</span>
          </div>

          <div class="form-group">
            <label for="password">
              <i class="fas fa-lock"></i>
              密码
            </label>
            <input
              id="password"
              v-model="loginForm.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="请输入密码"
              required
              :class="{ error: errors.password }"
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

          <div class="form-options">
            <label class="remember-me">
              <input type="checkbox" v-model="loginForm.rememberMe" />
              <span>记住我</span>
            </label>
            <a href="#" class="forgot-password" @click.prevent="handleForgotPassword">
              忘记密码？
            </a>
          </div>

          <button
            type="submit"
            class="login-button"
            :disabled="loading"
            :class="{ loading: loading }"
          >
            <span v-if="!loading">登录</span>
            <span v-else>
              <i class="fas fa-spinner fa-spin"></i>
              登录中...
            </span>
          </button>
        </form>

        <!-- 其他登录方式 -->
        <div class="social-login">
          <div class="divider">
            <span>或使用其他方式登录</span>
          </div>
          <div class="social-buttons">
            <button class="social-btn wechat" @click="socialLogin('wechat')">
              <i class="fab fa-weixin"></i>
            </button>
            <button class="social-btn github" @click="socialLogin('github')">
              <i class="fab fa-github"></i>
            </button>
            <button class="social-btn google" @click="socialLogin('google')">
              <i class="fab fa-google"></i>
            </button>
          </div>
        </div>

        <!-- 注册链接 -->
        <div class="register-link">
          还没有账户？
          <router-link to="/register">立即注册</router-link>
        </div>
      </div>
    </div>

    <!-- 忘记密码弹窗 -->
    <div v-if="showForgotPassword" class="modal-overlay" @click="showForgotPassword = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>重置密码</h3>
          <button class="close-button" @click="showForgotPassword = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <p>请输入您的邮箱地址，我们将发送重置密码的链接</p>
          <input
            v-model="resetEmail"
            type="email"
            placeholder="请输入邮箱地址"
            class="modal-input"
          />
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" @click="showForgotPassword = false">
            取消
          </button>
          <button class="btn-primary" @click="handleResetPassword">
            发送重置链接
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
  name: 'LoginPage',
  setup() {
    const router = useRouter()
    const userStore = useUserStore()

    const loginForm = reactive({
      username: '',
      password: '',
      rememberMe: false
    })

    const errors = reactive({
      username: '',
      password: ''
    })

    const loading = ref(false)
    const showPassword = ref(false)
    const showForgotPassword = ref(false)
    const resetEmail = ref('')

    // 表单验证
    const validateForm = () => {
      let isValid = true
      errors.username = ''
      errors.password = ''

      if (!loginForm.username.trim()) {
        errors.username = '请输入用户名'
        isValid = false
      }

      if (!loginForm.password) {
        errors.password = '请输入密码'
        isValid = false
      } else if (loginForm.password.length < 6) {
        errors.password = '密码长度不能少于6位'
        isValid = false
      }

      return isValid
    }

    // 处理登录 - 使用真实的验证逻辑
    const handleLogin = async () => {
      if (!validateForm()) return

      loading.value = true

      try {
        // 使用 userStore 的真实登录验证
        const result = await userStore.login({
          username: loginForm.username,
          password: loginForm.password
        })

        if (result.success) {
          alert('登录成功！')

          if (loginForm.rememberMe) {
            localStorage.setItem('rememberMe', 'true')
          }

          router.push('/home')
        } else {
          alert(result.message)
        }
      } catch (error) {
        alert('登录失败：' + error.message)
      } finally {
        loading.value = false
      }
    }

    // 显示消息
    const showMessage = (message, type = 'info') => {
      alert(`${type === 'error' ? '错误' : '成功'}: ${message}`)
    }

    // 第三方登录
    const socialLogin = (provider) => {
      showMessage(`即将跳转到${provider}登录...`, 'info')
    }

    // 处理忘记密码
    const handleForgotPassword = () => {
      showForgotPassword.value = true
    }

    // 处理重置密码
    const handleResetPassword = () => {
      if (!resetEmail.value) {
        showMessage('请输入邮箱地址', 'error')
        return
      }

      showMessage(`重置密码链接已发送到 ${resetEmail.value}`, 'success')
      showForgotPassword.value = false
      resetEmail.value = ''
    }

    return {
      loginForm,
      errors,
      loading,
      showPassword,
      showForgotPassword,
      resetEmail,
      handleLogin,
      socialLogin,
      handleForgotPassword,
      handleResetPassword
    }
  }
}
</script>

<style scoped lang="scss">
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;

  .login-background {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    padding: 2px;
  }

  .login-card {
    background: white;
    padding: 40px;
    border-radius: 18px;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
    width: 400px;
    max-width: 90vw;

    .login-header {
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

    .login-form {
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
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 25px;
        font-size: 14px;

        .remember-me {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #4a5568;
          cursor: pointer;

          input {
            margin: 0;
          }
        }

        .forgot-password {
          color: #667eea;
          text-decoration: none;

          &:hover {
            text-decoration: underline;
          }
        }
      }

      .login-button {
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

    .social-login {
      margin: 30px 0;

      .divider {
        text-align: center;
        position: relative;
        margin: 20px 0;

        &::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background: #e2e8f0;
        }

        span {
          background: white;
          padding: 0 15px;
          color: #718096;
          font-size: 12px;
        }
      }

      .social-buttons {
        display: flex;
        justify-content: center;
        gap: 15px;

        .social-btn {
          width: 50px;
          height: 50px;
          border: 2px solid #e2e8f0;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 18px;

          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          }

          &.wechat:hover {
            border-color: #09bb07;
            color: #09bb07;
          }

          &.github:hover {
            border-color: #333;
            color: #333;
          }

          &.google:hover {
            border-color: #db4437;
            color: #db4437;
          }
        }
      }
    }

    .register-link {
      text-align: center;
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
      width: 400px;
      max-width: 90vw;
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

        p {
          margin-bottom: 16px;
          color: #718096;
          font-size: 14px;
        }

        .modal-input {
          width: 100%;
          padding: 12px;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 14px;

          &:focus {
            outline: none;
            border-color: #667eea;
          }
        }
      }

      .modal-footer {
        padding: 16px 24px;
        border-top: 1px solid #e2e8f0;
        display: flex;
        gap: 12px;
        justify-content: flex-end;

        button {
          padding: 10px 20px;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;

          &.btn-secondary {
            background: #e2e8f0;
            color: #4a5568;

            &:hover {
              background: #cbd5e0;
            }
          }

          &.btn-primary {
            background: #667eea;
            color: white;

            &:hover {
              background: #5a67d8;
            }
          }
        }
      }
    }
  }
}

@media (max-width: 480px) {
  .login-container {
    padding: 10px;

    .login-card {
      padding: 30px 20px;
    }
  }
}
</style>
