import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

export const useUserStore = defineStore('user', () => {
  const router = useRouter()

  // 状态
  const user = ref(null)
  const token = ref(null)
  const isLoggedIn = computed(() => !!token.value)

  // 从本地存储恢复状态
  const initialize = () => {
    const savedUser = localStorage.getItem('user')
    const savedToken = localStorage.getItem('token')

    if (savedUser && savedToken) {
      user.value = JSON.parse(savedUser)
      token.value = savedToken
    }
  }

  // 获取所有注册用户
  const getRegisteredUsers = () => {
    return JSON.parse(localStorage.getItem('users') || '[]')
  }

  // 保存注册用户
  const saveRegisteredUsers = (users) => {
    localStorage.setItem('users', JSON.stringify(users))
  }

  // 登录
  const login = async (credentials) => {
    try {
      // 使用模拟登录API
      const response = await mockLogin(credentials)

      user.value = response.user
      token.value = response.token

      // 保存到本地存储
      localStorage.setItem('user', JSON.stringify(response.user))
      localStorage.setItem('token', response.token)
      localStorage.setItem('isLoggedIn', 'true')

      return { success: true, message: '登录成功' }
    } catch (error) {
      return { success: false, message: error.message }
    }
  }

  // 注册
  const register = async (userData) => {
    try {
      // 使用模拟注册API
      const response = await mockRegister(userData)

      user.value = response.user
      token.value = response.token

      // 保存到本地存储
      localStorage.setItem('user', JSON.stringify(response.user))
      localStorage.setItem('token', response.token)
      localStorage.setItem('isLoggedIn', 'true')

      return { success: true, message: '注册成功' }
    } catch (error) {
      return { success: false, message: error.message }
    }
  }

  // 注销
  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.removeItem('isLoggedIn')
    router.push('/login')
  }

  // 更新用户信息
  const updateProfile = (userData) => {
    user.value = { ...user.value, ...userData }
    localStorage.setItem('user', JSON.stringify(user.value))
  }

  // 检查用户名是否可用
  const checkUsernameAvailable = (username) => {
    const users = getRegisteredUsers()
    return !users.find(u => u.username === username)
  }

  // 检查邮箱是否可用
  const checkEmailAvailable = (email) => {
    const users = getRegisteredUsers()
    return !users.find(u => u.email === email)
  }

  // 模拟登录API
  const mockLogin = (credentials) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          // 从本地存储获取所有注册用户
          const users = getRegisteredUsers()

          // 查找匹配的用户
          const user = users.find(u =>
            u.username === credentials.username && u.password === credentials.password
          )

          if (user) {
            resolve({
              user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role || 'student',
                avatar: user.avatar,
                createdAt: user.createdAt
              },
              token: 'mock-jwt-token-' + Date.now()
            })
          } else {
            reject(new Error('用户名或密码错误'))
          }
        } catch (error) {
          reject(new Error('登录失败：' + error.message))
        }
      }, 1000)
    })
  }

  // 模拟注册API
  const mockRegister = (userData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          // 获取所有注册用户
          const users = getRegisteredUsers()

          // 检查用户名是否已存在
          const existingUser = users.find(u => u.username === userData.username)
          if (existingUser) {
            reject(new Error('用户名已存在'))
            return
          }

          // 检查邮箱是否已存在
          const existingEmail = users.find(u => u.email === userData.email)
          if (existingEmail) {
            reject(new Error('邮箱已被注册'))
            return
          }

          // 创建新用户
          const newUser = {
            id: Date.now().toString(),
            username: userData.username,
            email: userData.email,
            password: userData.password, // 实际项目中应该加密
            role: 'student',
            avatar: '/default-avatar.png',
            createdAt: new Date().toISOString()
          }

          // 保存新用户到注册用户列表
          users.push(newUser)
          saveRegisteredUsers(users)

          resolve({
            user: {
              id: newUser.id,
              username: newUser.username,
              email: newUser.email,
              role: newUser.role,
              avatar: newUser.avatar,
              createdAt: newUser.createdAt
            },
            token: 'mock-jwt-token-' + Date.now()
          })
        } catch (error) {
          reject(new Error('注册失败：' + error.message))
        }
      }, 1000)
    })
  }

  // 初始化
  initialize()

  return {
    user,
    token,
    isLoggedIn,
    login,
    register,
    logout,
    updateProfile,
    checkUsernameAvailable,
    checkEmailAvailable
  }
})
