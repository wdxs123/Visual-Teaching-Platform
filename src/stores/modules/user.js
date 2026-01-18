// src/stores/modules/user.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  // 状态
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || null)
  const isAuthenticated = computed(() => !!token.value)

  // 保存用户信息到 localStorage
  const saveToStorage = () => {
    if (user.value) {
      localStorage.setItem('user', JSON.stringify(user.value))
    }
    if (token.value) {
      localStorage.setItem('token', token.value)
    }
  }

  // 清除用户信息
  const clearStorage = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    user.value = null
    token.value = null
  }

  // 登录
  const login = async (credentials) => {
    try {
      // 模拟API调用
      console.log('登录请求:', credentials)

      // 这里应该调用实际的登录API
      // const response = await api.auth.login(credentials)

      // 模拟成功响应
      const mockResponse = {
        success: true,
        data: {
          user: {
            id: 1,
            username: credentials.account,
            email: credentials.account.includes('@') ? credentials.account : `${credentials.account}@example.com`
          },
          token: 'mock-jwt-token-' + Date.now()
        }
      }

      if (mockResponse.success) {
        user.value = mockResponse.data.user
        token.value = mockResponse.data.token
        saveToStorage()
        return { success: true }
      } else {
        throw new Error('登录失败')
      }
    } catch (error) {
      console.error('登录错误:', error)
      throw error
    }
  }

  // 注册
  const register = async (userData) => {
    try {
      console.log('注册请求:', userData)

      // 这里应该调用实际的注册API
      // const response = await api.auth.register(userData)

      // 模拟成功响应
      const mockResponse = {
        success: true,
        data: {
          user: {
            id: Date.now(),
            username: userData.username,
            email: userData.email
          },
          token: 'mock-jwt-token-register-' + Date.now()
        }
      }

      if (mockResponse.success) {
        user.value = mockResponse.data.user
        token.value = mockResponse.data.token
        saveToStorage()
        return { success: true }
      }
    } catch (error) {
      console.error('注册错误:', error)
      throw error
    }
  }

  // 登出
  const logout = () => {
    clearStorage()
  }

  // 从存储中恢复用户状态
  const restoreFromStorage = () => {
    const storedUser = localStorage.getItem('user')
    const storedToken = localStorage.getItem('token')

    if (storedUser) {
      user.value = JSON.parse(storedUser)
    }
    if (storedToken) {
      token.value = storedToken
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout,
    restoreFromStorage
  }
})
