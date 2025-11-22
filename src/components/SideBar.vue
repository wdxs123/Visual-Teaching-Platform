<template>
  <nav class="sidebar">
    <div class="logo">
      <img src="@/assets/logo.png" alt="教学助手">
      <h1>教学助手</h1>
    </div>
    <ul class="nav-menu">
      <li class="nav-item">
        <a href=" " class="nav-link active">
          <i class="fas fa-book"></i>
          <span>课程分类</span>
        </a >
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'SideBar'
}
</script>

<style scoped>
/* 从主样式复制相关样式 */
.sidebar {
  width: 240px;
  background-color: #34495e;
  color: #ecf0f1;
  height: 100vh;
  position: fixed;
  padding: 20px 0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.logo {
  display: flex;
  align-items: center;
  padding: 0 20px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 20px;
}

.logo img {
  width: 36px;
  height: 36px;
  margin-right: 12px;
}

.logo h1 {
  font-size: 20px;
  font-weight: 600;
}

.nav-menu {
  list-style: none;
  padding: 0 15px;
}

.nav-item {
  margin-bottom: 8px;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  color: #ecf0f1;
  text-decoration: none;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-link i {
  margin-right: 12px;
  font-size: 18px;
}

.nav-link.active {
  background-color: #3498db;
  color: white;
}
</style>
