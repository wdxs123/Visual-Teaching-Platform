import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/home/HomeView.vue'),
    meta: {
      title: '首页',
      requiresAuth: true
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/LoginPage.vue'),
    meta: {
      title: '用户登录',
      requiresAuth: false,
      requiresGuest: true
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/login/RegisterPage.vue'),
    meta: {
      title: '用户注册',
      requiresAuth: false,
      requiresGuest: true
    }
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('@/views/login/ForgotPassword.vue'),
    meta: {
      title: '忘记密码',
      requiresAuth: false,
      requiresGuest: true
    }
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: () => import('@/views/login/ResetPassword.vue'),
    meta: {
      title: '重置密码',
      requiresAuth: false,
      requiresGuest: true
    }
  },
  // 电气工程相关路由
  {
    path: '/electrical-engineering',
    name: 'ElectricalEngineering',
    component: () => import('@/views/electrical-engineering/ElectricalEngineering.vue'),
    meta: {
      title: '电气工程',
      requiresAuth: true
    }
  },
  {
    path: '/circuit-model',
    name: 'CircuitModel',
    component: () => import('@/views/electrical-engineering/CircuitModelViewer.vue'),
    meta: {
      title: '电路模型',
      requiresAuth: true
    }
  },
  // 404 页面
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/user/NotFound.vue'),
    meta: {
      title: '页面未找到',
      requiresAuth: false
    }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// 详细调试版本的路由守卫
router.beforeEach((to, from, next) => {
  console.log('=== 路由守卫开始 ===');

  // 获取所有可能的token键
  const tokenKeys = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    tokenKeys.push(key);
  }

  console.log('LocalStorage中的键:', tokenKeys);

  // 检查所有可能的token键
  let token = null;
  const possibleTokenKeys = ['vue_first_token', 'token', 'auth_token', 'access_token'];

  for (const key of possibleTokenKeys) {
    const value = localStorage.getItem(key);
    if (value) {
      token = value;
      console.log(`找到token键: ${key} = ${value.substring(0, 20)}...`);
      break;
    }
  }

  const isAuthenticated = !!token;

  console.log('路由守卫详细信息:');
  console.log('- 目标路径:', to.path);
  console.log('- 目标名称:', to.name);
  console.log('- 需要认证:', to.meta.requiresAuth || false);
  console.log('- 需要游客:', to.meta.requiresGuest || false);
  console.log('- 认证状态:', isAuthenticated ? '已登录' : '未登录');
  console.log('- 找到的token:', token ? `有 (${token.length} 字符)` : '无');

  // 设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - Vue First Program`;
  }

  // 如果用户已登录但访问需要游客的页面
  if (to.meta.requiresGuest && isAuthenticated) {
    console.log('❌ 已登录用户访问游客页面，重定向到首页');
    next('/');
    return;
  }

  // 如果需要认证但用户未登录
  if (to.meta.requiresAuth && !isAuthenticated) {
    console.log('❌ 需要认证但未登录，重定向到登录页');

    // 避免循环重定向
    if (to.path !== '/login') {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      });
    } else {
      next();
    }
    return;
  }

  console.log('✅ 允许访问:', to.path);
  next();
});

router.afterEach((to, from) => {
  console.log(`路由切换完成: ${from.path} -> ${to.path}`);
  console.log('=== 路由守卫结束 ===\n');
});

export default router;
