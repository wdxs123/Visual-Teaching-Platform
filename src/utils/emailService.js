// src/utils/emailService.js
import axios from 'axios'

// 邮件服务配置
class EmailService {
  constructor() {
    // 从环境变量获取邮箱配置（使用 import.meta.env 替代 process.env）
    this.emailUser = import.meta.env.VUE_APP_EMAIL_USER || 'your-email@qq.com'
    this.emailPass = import.meta.env.VUE_APP_EMAIL_PASS || 'your-authorization-code'
    this.apiBaseUrl = import.meta.env.VUE_APP_API_BASE_URL || '/api'
  }

  /**
   * 发送验证码邮件
   * @param {string} to - 收件人邮箱
   * @param {string} code - 验证码
   * @param {string} type - 邮件类型 (reset: 重置密码, register: 注册验证)
   * @returns {Promise}
   */
  async sendVerificationCode(to, code, type = 'reset') {
    try {
      const subject = type === 'reset' ? '密码重置验证码' : '注册验证码'
      const html = this.generateVerificationEmailHTML(code, type)

      const response = await axios.post(`${this.apiBaseUrl}/email/send`, {
        to,
        subject,
        html,
        type
      })

      return {
        success: true,
        message: '验证码发送成功',
        data: response.data
      }
    } catch (error) {
      console.error('发送验证码邮件失败:', error)
      return {
        success: false,
        message: error.response?.data?.message || '发送验证码失败，请稍后重试'
      }
    }
  }

  /**
   * 生成验证码邮件HTML内容
   * @param {string} code - 验证码
   * @param {string} type - 邮件类型
   * @returns {string}
   */
  generateVerificationEmailHTML(code, type) {
    const title = type === 'reset' ? '密码重置' : '账号注册'
    const action = type === 'reset' ? '重置密码' : '完成注册'

    return `
      <!DOCTYPE html>
      <html lang="zh-CN">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${title}验证码</title>
          <style>
              body {
                  font-family: 'Microsoft YaHei', Arial, sans-serif;
                  line-height: 1.6;
                  color: #333;
                  background-color: #f5f5f5;
                  margin: 0;
                  padding: 20px;
              }
              .container {
                  max-width: 600px;
                  margin: 0 auto;
                  background: white;
                  border-radius: 8px;
                  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                  overflow: hidden;
              }
              .header {
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  color: white;
                  padding: 30px;
                  text-align: center;
              }
              .header h1 {
                  margin: 0;
                  font-size: 24px;
              }
              .content {
                  padding: 30px;
              }
              .verification-code {
                  background: #f8f9fa;
                  border: 2px dashed #dee2e6;
                  border-radius: 8px;
                  padding: 20px;
                  text-align: center;
                  margin: 20px 0;
              }
              .code {
                  font-size: 32px;
                  font-weight: bold;
                  color: #667eea;
                  letter-spacing: 8px;
              }
              .footer {
                  background: #f8f9fa;
                  padding: 20px;
                  text-align: center;
                  color: #6c757d;
                  font-size: 12px;
              }
              .warning {
                  color: #e53e3e;
                  font-size: 14px;
                  margin-top: 10px;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h1>知理图云——多元可视化教学平台</h1>
                  <p>${title}验证码</p>
              </div>
              <div class="content">
                  <p>您好！</p>
                  <p>您正在申请${action}，请使用以下验证码完成操作：</p>

                  <div class="verification-code">
                      <div class="code">${code}</div>
                  </div>

                  <p>验证码有效期为 <strong>15分钟</strong>，请尽快使用。</p>
                  <p class="warning">请注意：请不要将此验证码透露给任何人，包括客服人员。</p>

                  <p>如果这不是您本人的操作，请忽略此邮件。</p>
              </div>
              <div class="footer">
                  <p>© 2024 知理图云——多元可视化教学平台。</p>
                  <p>此邮件由系统自动发送，请勿回复。</p>
              </div>
          </div>
      </body>
      </html>
    `
  }

  /**
   * 发送密码重置成功通知
   * @param {string} to - 收件人邮箱
   * @param {string} username - 用户名
   * @returns {Promise}
   */
  async sendPasswordResetSuccess(to, username) {
    try {
      const html = this.generatePasswordResetSuccessHTML(username)

      const response = await axios.post(`${this.apiBaseUrl}/email/send`, {
        to,
        subject: '密码重置成功通知',
        html,
        type: 'reset_success'
      })

      return {
        success: true,
        message: '通知邮件发送成功',
        data: response.data
      }
    } catch (error) {
      console.error('发送密码重置成功通知失败:', error)
      return {
        success: false,
        message: error.response?.data?.message || '发送通知邮件失败'
      }
    }
  }

  /**
   * 生成密码重置成功邮件HTML内容
   * @param {string} username - 用户名
   * @returns {string}
   */
  generatePasswordResetSuccessHTML(username) {
    return `
      <!DOCTYPE html>
      <html lang="zh-CN">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>密码重置成功通知</title>
          <style>
              body {
                  font-family: 'Microsoft YaHei', Arial, sans-serif;
                  line-height: 1.6;
                  color: #333;
                  background-color: #f5f5f5;
                  margin: 0;
                  padding: 20px;
              }
              .container {
                  max-width: 600px;
                  margin: 0 auto;
                  background: white;
                  border-radius: 8px;
                  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                  overflow: hidden;
              }
              .header {
                  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
                  color: white;
                  padding: 30px;
                  text-align: center;
              }
              .header h1 {
                  margin: 0;
                  font-size: 24px;
              }
              .content {
                  padding: 30px;
              }
              .success-icon {
                  text-align: center;
                  font-size: 48px;
                  color: #28a745;
                  margin: 20px 0;
              }
              .footer {
                  background: #f8f9fa;
                  padding: 20px;
                  text-align: center;
                  color: #6c757d;
                  font-size: 12px;
              }
              .warning {
                  color: #e53e3e;
                  font-size: 14px;
                  margin-top: 10px;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h1>知理图云——多元可视化教学平台</h1>
                  <p>密码重置成功通知</p>
              </div>
              <div class="content">
                  <div class="success-icon">✓</div>
                  <p>尊敬的 <strong>${username}</strong>，您好！</p>
                  <p>您的账户密码已成功重置。</p>
                  <p>如果您本人进行了此操作，请使用新密码登录系统。</p>

                  <p class="warning">如果这不是您本人的操作，请立即联系客服，并建议您立即修改密码。</p>

                  <p>感谢您使用我们的服务！</p>
              </div>
              <div class="footer">
                  <p>© 2024 知理图云——多元可视化教学平台. 保留所有权利。</p>
                  <p>此邮件由系统自动发送，请勿回复。</p>
              </div>
          </div>
      </body>
      </html>
    `
  }

  /**
   * 验证邮箱格式
   * @param {string} email - 邮箱地址
   * @returns {boolean}
   */
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
}

// 创建单例实例
const emailService = new EmailService()

export default emailService
