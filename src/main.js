import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/main.scss'

// 创建应用实例
const app = createApp(App)

// 创建 Pinia 实例
const pinia = createPinia()

// 使用路由和状态管理
app.use(pinia)
app.use(router)

// 全局错误处理
app.config.errorHandler = (err, vm, info) => {
  console.error('Vue错误:', err)
  console.error('组件:', vm)
  console.error('错误信息:', info)
}

// 全局警告处理
app.config.warnHandler = (msg, vm, trace) => {
  console.warn('Vue警告:', msg)
  console.warn('组件:', vm)
  console.warn('追踪:', trace)
}

// 挂载应用
app.mount('#app')

console.log('🎉 Vue应用已启动')
console.log('📁 路由已安装')
console.log('📦 状态管理已配置')

// 开发环境特殊处理
if (import.meta.env.DEV) {
  console.log('🔧 开发模式')

  // 显示应用信息
  console.group('应用信息')
  console.log('环境:', import.meta.env.MODE)
  console.log('API地址:', import.meta.env.VITE_APP_API_URL)
  console.log('使用模拟API:', import.meta.env.VITE_APP_USE_MOCK_API)
  console.groupEnd()
}
