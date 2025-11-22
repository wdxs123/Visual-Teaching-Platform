<!-- <template>
  <div class="module-card" @click="handleClick">
    <div class="module-icon" :class="`icon-${id}`">
      <i :class="icon"></i>
    </div>
    <h3 class="module-title">{{ title }}</h3>
    <p class="module-description">{{ description }}</p >
    <button class="module-button">开始学习</button>
  </div>
</template>

<script>
export default {
  name: 'CourseCard',
  props: {
    id: Number,
    title: String,
    description: String,
    icon: String
  },
  methods: {
    handleClick() {
      this.$emit('course-selected', this.title)
    }
  }
}
</script>

<style scoped>
/* 卡片样式 */
.module-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 30px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  height: 260px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
}

.module-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}

.module-icon {
  font-size: 50px;
  margin-bottom: 20px;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.icon-1 {
  background: linear-gradient(135deg, #3498db, #1a5276);
}

.icon-2 {
  background: linear-gradient(135deg, #e74c3c, #a93226);
}

.icon-3 {
  background: linear-gradient(135deg, #2ecc71, #186a3b);
}

.module-title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 10px;
  color: #2c3e50;
}

.module-description {
  color: #7f8c8d;
  margin-bottom: 20px;
  line-height: 1.6;
  flex-grow: 1;
}

.module-button {
  background: #3498db;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 50px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  align-self: flex-start;
}

.module-button:hover {
  background: #34495e;
}
</style> -->
<template>
  <div class="module-card" @click="handleClick">
    <div class="module-icon" :class="`icon-${id}`">
      <i :class="icon"></i>
    </div>
    <h3 class="module-title">{{ title }}</h3>
    <p class="module-description">{{ description }}</p >
    <button class="module-button">开始学习</button>
  </div>
</template>

<script>
export default {
  name: 'CourseCard',
  props: {
    id: Number,
    title: String,
    description: String,
    icon: String
  },
  methods: {
    handleClick() {
      if (this.title === "电工学") {
        // 跳转到电工学专属页面
        this.$router.push({
          name: 'ElectricalEngineering',
          query: { course: 'electrical' }
        });
      } else {
        // 触发原始事件
        this.$emit('course-selected', this.title);
      }
    }
  }
}
</script>

<style scoped>
/* 卡片样式 */
.module-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 30px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  height: 260px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
}

.module-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}

.module-icon {
  font-size: 50px;
  margin-bottom: 20px;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.icon-1 {
  background: linear-gradient(135deg, #3498db, #1a5276);
}

.icon-2 {
  background: linear-gradient(135deg, #e74c3c, #a93226);
}

.icon-3 {
  background: linear-gradient(135deg, #2ecc71, #186a3b);
}

.module-title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 10px;
  color: #2c3e50;
}

.module-description {
  color: #7f8c8d;
  margin-bottom: 20px;
  line-height: 1.6;
  flex-grow: 1;
}

.module-button {
  background: #3498db;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 50px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  align-self: flex-start;
}

.module-button:hover {
  background: #34495e;
}
</style>
