// src/api/auth.js
import axios from 'axios'

// 创建axios实例
const api = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器 - 添加token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    // 处理错误响应
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // token过期或无效
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          window.location.href = '/login'
          break
        case 403:
          console.error('权限不足')
          break
        case 404:
          console.error('资源不存在')
          break
        case 500:
          console.error('服务器错误')
          break
        default:
          console.error('请求错误:', error.response.data?.message || error.message)
      }
    }
    return Promise.reject(error)
  }
)

// 认证相关API
export const authAPI = {
  // 账号登录
  loginByAccount(account, password) {
    return api.post('/auth/login/account', { account, password })
  },

  // 手机登录
  loginByPhone(phone, smsCode) {
    return api.post('/auth/login/phone', { phone, smsCode })
  },

  // 注册
  register(userData) {
    return api.post('/auth/register', userData)
  },

  // 登出
  logout() {
    return api.post('/auth/logout')
  },

  // 获取用户信息
  getUserInfo() {
    return api.get('/auth/user')
  }
}

export default api
