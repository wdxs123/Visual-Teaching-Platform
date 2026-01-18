/* eslint-env node */
/* global process */

import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// 发送手机验证码
router.post('/send-code', async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: '手机号不能为空'
      });
    }

    // 生成6位验证码
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // 存储验证码到Redis，5分钟过期
    await req.app.get('redis').setex(`verification:${phone}`, 300, code);

    console.log(`手机号 ${phone} 的验证码: ${code}`); // 开发环境输出到控制台

    // TODO: 实际项目中接入短信服务商
    // await sendSMS(phone, code);

    res.json({
      success: true,
      message: '验证码已发送',
      debug: process.env.NODE_ENV === 'development' ? code : undefined // 开发环境返回验证码
    });
  } catch (error) {
    console.error('发送验证码错误:', error);
    res.status(500).json({
      success: false,
      message: '发送验证码失败'
    });
  }
});

// 手机验证码登录/注册
router.post('/phone-login', async (req, res) => {
  try {
    const { phone, code } = req.body;

    if (!phone || !code) {
      return res.status(400).json({
        success: false,
        message: '手机号和验证码不能为空'
      });
    }

    // 验证验证码
    const storedCode = await req.app.get('redis').get(`verification:${phone}`);
    if (!storedCode || storedCode !== code) {
      return res.status(400).json({
        success: false,
        message: '验证码错误或已过期'
      });
    }

    // 查找或创建用户
    let user = await User.findOne({ phone });
    const isNewUser = !user;

    if (!user) {
      user = new User({
        phone,
        username: `user_${Date.now()}`
      });
      await user.save();
    }

    // 更新登录信息
    user.lastLogin = new Date();
    user.loginCount += 1;
    await user.save();

    // 生成JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        phone: user.phone
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 删除已使用的验证码
    await req.app.get('redis').del(`verification:${phone}`);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        phone: user.phone,
        email: user.email
      },
      isNewUser
    });
  } catch (error) {
    console.error('手机登录错误:', error);
    res.status(500).json({
      success: false,
      message: '登录失败'
    });
  }
});

// 密码注册
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, phone } = req.body;

    // 检查必填字段
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: '用户名、邮箱和密码不能为空'
      });
    }

    // 检查用户是否已存在
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: '用户已存在'
      });
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 12);

    // 创建用户
    const user = new User({
      username,
      email,
      phone,
      password: hashedPassword
    });

    await user.save();

    // 生成token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error('注册错误:', error);
    res.status(500).json({
      success: false,
      message: '注册失败'
    });
  }
});

// 密码登录
router.post('/login', async (req, res) => {
  try {
    const { login, password } = req.body;

    if (!login || !password) {
      return res.status(400).json({
        success: false,
        message: '登录名和密码不能为空'
      });
    }

    // 查找用户
    const user = await User.findOne({
      $or: [
        { email: login },
        { username: login },
        { phone: login }
      ],
      isActive: true
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: '用户不存在'
      });
    }

    if (!user.password) {
      return res.status(400).json({
        success: false,
        message: '该账号未设置密码，请使用其他方式登录'
      });
    }

    // 验证密码
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: '密码错误'
      });
    }

    // 更新登录信息
    user.lastLogin = new Date();
    user.loginCount += 1;
    await user.save();

    // 生成token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({
      success: false,
      message: '登录失败'
    });
  }
});

// 忘记密码
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: '邮箱不能为空'
      });
    }

    const user = await User.findOne({ email, isActive: true });
    if (!user) {
      // 出于安全考虑，不透露用户是否存在
      return res.json({
        success: true,
        message: '如果邮箱存在，重置链接已发送'
      });
    }

    // 生成重置token
    const resetToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1小时
    await user.save();

    // TODO: 发送重置邮件
    console.log(`密码重置链接: http://localhost:5173/reset-password?token=${resetToken}`);

    res.json({
      success: true,
      message: '重置链接已发送到您的邮箱',
      debug: process.env.NODE_ENV === 'development' ? resetToken : undefined
    });
  } catch (error) {
    console.error('忘记密码错误:', error);
    res.status(500).json({
      success: false,
      message: '发送失败'
    });
  }
});

// 重置密码
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Token和新密码不能为空'
      });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: '重置链接无效或已过期'
      });
    }

    // 更新密码
    user.password = await bcrypt.hash(newPassword, 12);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({
      success: true,
      message: '密码重置成功'
    });
  } catch (error) {
    console.error('重置密码错误:', error);
    res.status(500).json({
      success: false,
      message: '重置失败'
    });
  }
});

// 验证token
router.post('/verify-token', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token不能为空'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: '用户不存在'
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone
      }
    });
  } catch (_) {  // 使用下划线表示这个变量是故意不使用的
    res.status(401).json({
      success: false,
      message: 'Token无效'
    });
  }
});

export default router;
