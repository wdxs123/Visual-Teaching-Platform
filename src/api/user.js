import request from '@/utils/request'

/**
 * 用户邮箱注册
 * @param {Object} data - 包含邮箱、用户名、密码、确认密码
 * @returns {Promise}
 */
export const userRegisterService = ({ email, username, password, confirmPassword }) => {
  return request.post('/api/auth/register', {
    email,
    username,
    password,
    confirmPassword
  })
}

/**
 * 用户邮箱登录
 * @param {Object} data - 包含邮箱和密码
 * @returns {Promise}
 */
export const userLoginService = ({ email, password, rememberMe = false }) => {
  return request.post('/api/auth/login', {
    email,
    password,
    rememberMe
  })
}

/**
 * 用户登出
 * @returns {Promise}
 */
export const userLogoutService = () => {
  return request.post('/api/auth/logout')
}

/**
 * 发送重置密码邮件
 * @param {Object} data - 包含邮箱地址
 * @returns {Promise}
 */
export const sendResetPasswordEmail = (email) => {
  return request.post('/api/auth/forgot-password', { email })
}

/**
 * 重置密码
 * @param {Object} data - 包含token和新密码
 * @returns {Promise}
 */
export const resetPasswordService = (data) => {
  return request.post('/api/auth/reset-password', data)
}

/**
 * 获取用户信息
 * @returns {Promise}
 */
export const getUserInfoService = () => {
  return request.get('/api/user/info')
}

/**
 * 更新用户信息
 * @param {Object} data - 用户信息
 * @returns {Promise}
 */
export const updateUserInfoService = (data) => {
  return request.put('/api/user/update', data)
}

// 模拟API（开发环境使用）
const mockUsers = [
  {
    id: 1,
    email: 'test@example.com',
    username: '测试用户',
    password: 'test123456'
  }
]

// 开发环境模拟实现
const isDevelopment = process.env.NODE_ENV === 'development'

// 模拟注册
const mockUserRegisterService = async (data) => {
  await new Promise(resolve => setTimeout(resolve, 1000))

  // 检查邮箱是否已存在
  const existingUser = mockUsers.find(user => user.email === data.email)
  if (existingUser) {
    throw { response: { data: { message: '邮箱已被注册' } } }
  }

  // 检查用户名是否已存在
  const existingUsername = mockUsers.find(user => user.username === data.username)
  if (existingUsername) {
    throw { response: { data: { message: '用户名已被使用' } } }
  }

  // 创建新用户
  const newUser = {
    id: mockUsers.length + 1,
    email: data.email,
    username: data.username,
    password: data.password
  }

  mockUsers.push(newUser)

  return {
    data: {
      success: true,
      message: '注册成功',
      user: {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username
      }
    }
  }
}

// 模拟登录
const mockUserLoginService = async (data) => {
  await new Promise(resolve => setTimeout(resolve, 1000))

  const user = mockUsers.find(u => u.email === data.email && u.password === data.password)

  if (!user) {
    throw { response: { data: { message: '邮箱或密码错误' } } }
  }

  const token = `mock-jwt-token-${user.id}-${Date.now()}`

  return {
    data: {
      success: true,
      message: '登录成功',
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username
      }
    }
  }
}

// 根据环境选择使用真实API还是模拟API
export const registerService = isDevelopment ? mockUserRegisterService : userRegisterService
export const loginService = isDevelopment ? mockUserLoginService : userLoginService
export const logoutService = isDevelopment ? () => Promise.resolve({ data: { success: true } }) : userLogoutService

export default {
  userRegisterService: registerService,
  userLoginService: loginService,
  userLogoutService: logoutService,
  sendResetPasswordEmail,
  resetPasswordService,
  getUserInfoService,
  updateUserInfoService
}
