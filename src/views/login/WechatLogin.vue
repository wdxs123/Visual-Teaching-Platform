<template>
  <div class="wechat-login">
    <div class="wechat-content">
      <!-- 微信登录主内容 -->
      <div class="wechat-main">
        <div class="wechat-header">
          <div class="wechat-logo">
            <i class="fab fa-weixin"></i>
          </div>
          <h2>微信扫码登录</h2>
          <p>请使用微信扫一扫登录您的账户</p>
        </div>

        <!-- 二维码区域 -->
        <div class="qrcode-section">
          <div class="qrcode-container">
            <!-- 二维码显示区域 -->
            <div class="qrcode-display" :class="{ loading: qrCodeLoading, expired: qrCodeExpired }">
              <!-- 加载状态 -->
              <div v-if="qrCodeLoading" class="qrcode-loading">
                <div class="loading-spinner large"></div>
                <p>正在生成二维码...</p>
              </div>

              <!-- 过期状态 -->
              <div v-else-if="qrCodeExpired" class="qrcode-expired">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>二维码已过期</h3>
                <p>请点击刷新重新获取二维码</p>
                <button class="refresh-btn" @click="generateQRCode">
                  <i class="fas fa-redo"></i>
                  刷新二维码
                </button>
              </div>

              <!-- 正常显示二维码 -->
              <div v-else class="qrcode-normal">
                <div class="qrcode-image">
                  <!-- 这里可以放置真实的微信二维码 -->
                  <div class="demo-qrcode">
                    <div class="qrcode-placeholder">
                      <i class="fab fa-weixin"></i>
                      <p>微信二维码</p>
                      <small>开发中...</small>
                    </div>
                  </div>
                  <div class="qrcode-overlay" v-if="scanStatus !== 'waiting'">
                    <div class="scan-status" :class="scanStatus">
                      <i :class="statusIcon"></i>
                      <p>{{ statusText }}</p>
                    </div>
                  </div>
                </div>

                <!-- 二维码信息 -->
                <div class="qrcode-info">
                  <div class="qr-timer">
                    <i class="fas fa-clock"></i>
                    <span>二维码有效时间: {{ countdown }}秒</span>
                  </div>
                  <div class="qr-tip">
                    <i class="fas fa-info-circle"></i>
                    <span>请使用微信扫描二维码以登录</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 刷新按钮 -->
            <button
              v-if="!qrCodeLoading && !qrCodeExpired"
              class="qrcode-refresh"
              @click="generateQRCode"
              :disabled="refreshing"
            >
              <i class="fas fa-redo" :class="{ spinning: refreshing }"></i>
            </button>
          </div>

          <!-- 扫描状态指示器 -->
          <div class="scan-status-indicator" v-if="!qrCodeLoading && !qrCodeExpired">
            <div class="status-dot" :class="scanStatus"></div>
            <span class="status-text">{{ scanStatusText }}</span>
          </div>
        </div>

        <!-- 使用演示按钮 -->
        <div class="demo-section" v-if="showDemo">
          <button
            class="demo-btn"
            @click="simulateWechatLogin"
            :disabled="loading"
          >
            <i class="fas fa-magic"></i>
            模拟微信登录（开发测试）
          </button>
          <p class="demo-tip">此功能仅用于开发测试，实际项目中应接入微信官方API</p>
        </div>
      </div>

      <!-- 微信登录说明 -->
      <div class="wechat-guide">
        <h3>如何通过微信登录？</h3>
        <div class="guide-steps">
          <div class="guide-step">
            <div class="step-number">1</div>
            <div class="step-content">
              <h4>打开微信</h4>
              <p>在手机上打开微信应用</p>
            </div>
          </div>
          <div class="guide-step">
            <div class="step-number">2</div>
            <div class="step-content">
              <h4>扫一扫</h4>
              <p>点击微信右上角的"+"，选择"扫一扫"</p>
            </div>
          </div>
          <div class="guide-step">
            <div class="step-number">3</div>
            <div class="step-content">
              <h4>确认登录</h4>
              <p>扫描二维码后在手机上确认登录</p>
            </div>
          </div>
        </div>

        <div class="wechat-benefits">
          <h4>微信登录的优势</h4>
          <ul>
            <li><i class="fas fa-check"></i> 无需记住密码</li>
            <li><i class="fas fa-check"></i> 快速一键登录</li>
            <li><i class="fas fa-check"></i> 安全可靠</li>
            <li><i class="fas fa-check"></i> 自动关联账户</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 分割线 -->
    <div class="divider">
      <span>或使用其他方式登录</span>
    </div>

    <!-- 其他登录方式 -->
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
        class="alt-login-btn phone-login"
        @click="switchToPhoneLogin"
        :disabled="loading"
      >
        <i class="fas fa-mobile-alt"></i>
        <span>手机验证码登录</span>
      </button>
    </div>

    <!-- 微信登录成功弹窗 -->
    <div v-if="showSuccessModal" class="success-modal">
      <div class="modal-content">
        <div class="modal-header">
          <i class="fas fa-check-circle"></i>
          <h3>微信登录成功</h3>
        </div>
        <div class="modal-body">
          <p>欢迎回来！正在为您跳转...</p>
          <div class="user-info" v-if="mockUser">
            <img :src="mockUser.avatar" alt="用户头像" class="user-avatar">
            <div class="user-details">
              <h4>{{ mockUser.nickname }}</h4>
              <p>微信用户</p>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-primary" @click="handleLoginSuccess">
            <i class="fas fa-rocket"></i>
            立即进入
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/modules/user'

// 发射事件
const emit = defineEmits(['login-success', 'switch-login'])

const router = useRouter()
const userStore = useUserStore()

// 响应式数据
const qrCodeLoading = ref(true)
const qrCodeExpired = ref(false)
const refreshing = ref(false)
const loading = ref(false)
const showSuccessModal = ref(false)
const showDemo = ref(true) // 开发环境下显示演示按钮

const countdown = ref(120) // 二维码有效时间（秒）
const scanStatus = ref('waiting') // waiting, scanning, confirmed, success, error

const mockUser = ref(null)

// 模拟的微信用户数据
const mockUsers = [
  {
    openid: 'mock_openid_001',
    nickname: '微信用户',
    avatar: '/default-avatar.png',
    city: '深圳',
    province: '广东',
    country: '中国'
  },
  {
    openid: 'mock_openid_002',
    nickname: '技术达人',
    avatar: '/default-avatar.png',
    city: '北京',
    province: '北京',
    country: '中国'
  },
  {
    openid: 'mock_openid_003',
    nickname: '学习爱好者',
    avatar: '/default-avatar.png',
    city: '上海',
    province: '上海',
    country: '中国'
  }
]

// 计算属性
const statusIcon = computed(() => {
  switch (scanStatus.value) {
    case 'scanning':
      return 'fas fa-qrcode scanning'
    case 'confirmed':
      return 'fas fa-check-circle confirmed'
    case 'success':
      return 'fas fa-check-double success'
    case 'error':
      return 'fas fa-exclamation-circle error'
    default:
      return 'fab fa-weixin waiting'
  }
})

const statusText = computed(() => {
  switch (scanStatus.value) {
    case 'scanning':
      return '扫描成功\n请在手机上确认登录'
    case 'confirmed':
      return '确认登录\n正在验证用户信息...'
    case 'success':
      return '登录成功\n正在跳转...'
    case 'error':
      return '登录失败\n请重新扫描'
    default:
      return '等待扫描'
  }
})

const scanStatusText = computed(() => {
  switch (scanStatus.value) {
    case 'waiting':
      return '等待扫描'
    case 'scanning':
      return '已扫描，等待确认'
    case 'confirmed':
      return '已确认，正在登录'
    case 'success':
      return '登录成功'
    case 'error':
      return '登录失败'
    default:
      return '未知状态'
  }
})

// 方法
// 生成二维码（模拟）
const generateQRCode = () => {
  qrCodeLoading.value = true
  qrCodeExpired.value = false
  refreshing.value = true
  scanStatus.value = 'waiting'
  countdown.value = 120

  // 模拟生成二维码的延迟
  setTimeout(() => {
    qrCodeLoading.value = false
    refreshing.value = false
    startCountdown()

    // 模拟随机用户选择
    const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)]
    mockUser.value = randomUser

    console.log('✅ 二维码生成成功')
  }, 1500)
}

// 开始倒计时
const startCountdown = () => {
  const timer = setInterval(() => {
    countdown.value--

    // 二维码过期
    if (countdown.value <= 0) {
      clearInterval(timer)
      qrCodeExpired.value = true
      scanStatus.value = 'error'
    }

    // 模拟扫描过程（开发测试）
    if (countdown.value === 100 && scanStatus.value === 'waiting') {
      scanStatus.value = 'scanning'
    } else if (countdown.value === 95 && scanStatus.value === 'scanning') {
      scanStatus.value = 'confirmed'
    } else if (countdown.value === 90 && scanStatus.value === 'confirmed') {
      handleWechatLoginSuccess()
    }
  }, 1000)
}

// 模拟微信登录
const simulateWechatLogin = () => {
  if (qrCodeExpired.value) {
    generateQRCode()
  }

  loading.value = true

  // 模拟扫描和确认过程
  scanStatus.value = 'scanning'

  setTimeout(() => {
    scanStatus.value = 'confirmed'

    setTimeout(() => {
      handleWechatLoginSuccess()
    }, 2000)
  }, 1500)
}

// 处理微信登录成功
const handleWechatLoginSuccess = () => {
  scanStatus.value = 'success'
  loading.value = false

  // 显示成功弹窗
  setTimeout(() => {
    showSuccessModal.value = true
  }, 1000)
}

// 处理最终登录成功
const handleLoginSuccess = () => {
  showSuccessModal.value = false

  // 在实际项目中，这里应该调用微信登录API并处理用户数据
  // 这里使用模拟实现
  const mockWechatUser = {
    id: Date.now().toString(),
    username: `wx_${mockUser.value.nickname}`,
    nickname: mockUser.value.nickname,
    avatar: mockUser.value.avatar,
    openid: mockUser.value.openid,
    role: 'student',
    loginType: 'wechat',
    createdAt: new Date().toISOString()
  }

  const mockToken = 'mock-wechat-token-' + Date.now()

  // 保存到store和localStorage
  userStore.user = mockWechatUser
  userStore.token = mockToken
  localStorage.setItem('user', JSON.stringify(mockWechatUser))
  localStorage.setItem('token', mockToken)

  console.log('✅ 微信登录成功:', mockWechatUser)

  // 触发登录成功事件
  emit('login-success')
}

// 切换到密码登录
const switchToPasswordLogin = () => {
  emit('switch-login', 'password')
}

// 切换到手机登录
const switchToPhoneLogin = () => {
  emit('switch-login', 'phone')
}

// 组件挂载时生成二维码
onMounted(() => {
  generateQRCode()
})

// 组件卸载时清理定时器
onUnmounted(() => {
  // 清理可能的定时器
  clearInterval()
})
</script>

<style scoped>
.wechat-login {
  width: 100%;
}

.wechat-content {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
}

.wechat-main {
  flex: 1;
}

.wechat-guide {
  flex: 1;
  max-width: 300px;
}

/* 微信头部 */
.wechat-header {
  text-align: center;
  margin-bottom: 2rem;
}

.wechat-logo {
  font-size: 3rem;
  color: #09bb07;
  margin-bottom: 1rem;
}

.wechat-header h2 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.wechat-header p {
  color: #666;
  font-size: 0.9rem;
}

/* 二维码区域 */
.qrcode-section {
  text-align: center;
}

.qrcode-container {
  position: relative;
  display: inline-block;
  margin-bottom: 1.5rem;
}

.qrcode-display {
  width: 280px;
  height: 280px;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.qrcode-display.loading {
  border-color: #667eea;
  background: #f8f9ff;
}

.qrcode-display.expired {
  border-color: #dc3545;
  background: #fff5f5;
}

/* 二维码加载状态 */
.qrcode-loading {
  text-align: center;
  color: #667eea;
}

.loading-spinner.large {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

.qrcode-loading p {
  margin: 0;
  font-weight: 500;
}

/* 二维码过期状态 */
.qrcode-expired {
  text-align: center;
  color: #dc3545;
  padding: 1rem;
}

.qrcode-expired i {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.qrcode-expired h3 {
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
}

.qrcode-expired p {
  margin-bottom: 1.5rem;
  color: #666;
}

.refresh-btn {
  padding: 10px 20px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.refresh-btn:hover {
  background: #c82333;
  transform: translateY(-1px);
}

/* 二维码正常显示 */
.qrcode-normal {
  width: 100%;
  height: 100%;
}

.qrcode-image {
  width: 100%;
  height: 200px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  border-radius: 8px 8px 0 0;
}

.demo-qrcode {
  text-align: center;
  color: #666;
}

.qrcode-placeholder {
  padding: 2rem;
}

.qrcode-placeholder i {
  font-size: 4rem;
  color: #09bb07;
  margin-bottom: 1rem;
}

.qrcode-placeholder p {
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.qrcode-placeholder small {
  color: #999;
}

/* 二维码覆盖层 */
.qrcode-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px 8px 0 0;
}

.scan-status {
  text-align: center;
  padding: 1rem;
}

.scan-status i {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.scan-status.waiting i {
  color: #09bb07;
}

.scan-status.scanning i {
  color: #667eea;
  animation: pulse 1.5s infinite;
}

.scan-status.confirmed i {
  color: #28a745;
}

.scan-status.success i {
  color: #28a745;
}

.scan-status.error i {
  color: #dc3545;
}

.scan-status p {
  margin: 0;
  font-weight: 500;
  white-space: pre-line;
  line-height: 1.4;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.05);
  }
}

/* 二维码信息 */
.qrcode-info {
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 0 0 8px 8px;
}

.qr-timer, .qr-tip {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.85rem;
  color: #666;
}

.qr-timer i {
  color: #dc3545;
}

.qr-tip i {
  color: #667eea;
}

/* 刷新按钮 */
.qrcode-refresh {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 36px;
  height: 36px;
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #666;
}

.qrcode-refresh:hover:not(:disabled) {
  background: #667eea;
  color: white;
  transform: rotate(90deg);
}

.qrcode-refresh:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 扫描状态指示器 */
.scan-status-indicator {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #f8f9fa;
  border-radius: 20px;
  font-size: 0.9rem;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.status-dot.waiting {
  background: #6c757d;
}

.status-dot.scanning {
  background: #667eea;
}

.status-dot.confirmed {
  background: #ffc107;
}

.status-dot.success {
  background: #28a745;
}

.status-dot.error {
  background: #dc3545;
}

.status-text {
  font-weight: 500;
  color: #333;
}

/* 演示部分 */
.demo-section {
  text-align: center;
  margin-top: 2rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.demo-btn {
  padding: 12px 24px;
  background: linear-gradient(135deg, #09bb07 0%, #08a806 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.demo-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(9, 187, 7, 0.3);
}

.demo-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.demo-tip {
  font-size: 0.8rem;
  color: #666;
  margin: 0;
}

/* 微信登录指南 */
.wechat-guide {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 12px;
}

.wechat-guide h3 {
  margin-bottom: 1.5rem;
  color: #333;
  text-align: center;
}

.guide-steps {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.guide-step {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.step-number {
  width: 30px;
  height: 30px;
  background: #667eea;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  flex-shrink: 0;
  margin-top: 0.25rem;
}

.step-content h4 {
  margin: 0 0 0.25rem 0;
  color: #333;
  font-size: 1rem;
}

.step-content p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

.wechat-benefits h4 {
  margin-bottom: 1rem;
  color: #333;
}

.wechat-benefits ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.wechat-benefits li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  color: #666;
  font-size: 0.9rem;
}

.wechat-benefits i {
  color: #28a745;
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

.phone-login:hover:not(:disabled) i {
  color: #28a745;
}

/* 成功弹窗 */
.success-modal {
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
  animation: fadeIn 0.3s ease;
}

.modal-content {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  max-width: 400px;
  width: 90%;
  animation: slideUp 0.3s ease;
}

.modal-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.modal-header i {
  font-size: 3rem;
  color: #28a745;
  margin-bottom: 1rem;
}

.modal-header h3 {
  margin: 0;
  color: #333;
  font-size: 1.5rem;
}

.modal-body {
  text-align: center;
  margin-bottom: 2rem;
}

.modal-body p {
  color: #666;
  margin-bottom: 1.5rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
}

.user-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.user-details {
  text-align: left;
  flex: 1;
}

.user-details h4 {
  margin: 0 0 0.25rem 0;
  color: #333;
}

.user-details p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

.modal-footer {
  text-align: center;
}

.btn-primary {
  padding: 12px 24px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary:hover {
  background: #5a6fd8;
  transform: translateY(-1px);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .wechat-content {
    flex-direction: column;
  }

  .wechat-guide {
    max-width: 100%;
  }

  .alternative-login {
    grid-template-columns: 1fr;
  }

  .qrcode-display {
    width: 250px;
    height: 250px;
  }

  .guide-steps {
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .qrcode-display {
    width: 220px;
    height: 220px;
  }

  .qrcode-image {
    height: 160px;
  }

  .modal-content {
    padding: 1.5rem;
  }

  .user-info {
    flex-direction: column;
    text-align: center;
  }

  .user-details {
    text-align: center;
  }
}
</style>
