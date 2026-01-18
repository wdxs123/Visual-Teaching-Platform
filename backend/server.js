/* eslint-env node */
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import session from 'express-session';
import Redis from 'ioredis';
import connectRedis from 'connect-redis';
import dotenv from 'dotenv';

// 环境变量配置
dotenv.config();

const app = express();

// Redis配置
const RedisStore = connectRedis(session);
const redisClient = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

// 中间件
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET || process.env.JWT_SECRET || 'fallback-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // 开发环境
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24小时
  }
}));

// 数据库连接
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vue-firstprogram', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB连接成功'))
.catch(err => console.log('MongoDB连接失败:', err));

// 使redis在路由中可用
app.set('redis', redisClient);

// 路由导入
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';

// 使用路由
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// 错误处理中间件
app.use((err, req, res) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: '服务器内部错误'
  });
});

// 404处理
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: '接口不存在'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
  console.log(`前端地址: ${process.env.CORS_ORIGIN || 'http://localhost:5173'}`);
  console.log(`后端API: http://localhost:${PORT}/api`);
});
