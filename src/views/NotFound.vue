<template>
  <div class="not-found-container">
    <div class="not-found-content">
      <div class="error-code">404</div>
      <h1 class="error-title">页面未找到</h1>
      <p class="error-message">抱歉，您访问的页面不存在。</p>
      <div class="action-buttons">
        <button @click="$router.go(-1)" class="btn-back">
          <i class="fas fa-arrow-left"></i>
          返回上一页
        </button>
        <button @click="$router.push('/home')" class="btn-home">
          <i class="fas fa-home"></i>
          返回首页
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFound'
}
</script>

<style scoped>
.not-found-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.not-found-content {
  text-align: center;
  background: white;
  padding: 60px 40px;
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
}

.error-code {
  font-size: 120px;
  font-weight: bold;
  color: #667eea;
  line-height: 1;
  margin-bottom: 20px;
}

.error-title {
  font-size: 32px;
  color: #2d3748;
  margin-bottom: 16px;
}

.error-message {
  font-size: 18px;
  color: #718096;
  margin-bottom: 40px;
}

.action-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-back,
.btn-home {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-back {
  background: #e2e8f0;
  color: #4a5568;
}

.btn-back:hover {
  background: #cbd5e0;
}

.btn-home {
  background: #667eea;
  color: white;
}

.btn-home:hover {
  background: #5a67d8;
  transform: translateY(-2px);
}

@media (max-width: 480px) {
  .not-found-content {
    padding: 40px 20px;
  }

  .error-code {
    font-size: 80px;
  }

  .error-title {
    font-size: 24px;
  }

  .action-buttons {
    flex-direction: column;
  }
}
</style>
