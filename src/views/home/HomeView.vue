<template>
  
  <div class="home-container">
    <Sidebar />
    <main class="main-content">
      <div class="top-bar">
        <div class="welcome">
          <h2>{{ welcomeMessage }}</h2>
        </div>
        <div class="user-info">
          <div class="avatar">U</div>
        </div>
      </div>

      <div class="modules-container">
        <CourseCard
          v-for="course in courses"
          :key="course.id"
          :id="course.id"
          :title="course.title"
          :description="course.description"
          :icon="course.icon"
          @course-selected="handleCourseSelect"
        />
      </div>

      <footer class="footer">
        <p>教学助手平台 ©2023</p >
      </footer>
    </main>
  </div>
</template>

<script>
import Sidebar from '@/components/SideBar.vue'
import CourseCard from '@/components/CourseCard.vue'

export default {
  name: 'HomeView',
  components: {
    Sidebar,
    CourseCard
  },
  data() {
    return {
      welcomeMessages: [
        "欢迎使用教学助手平台",
        "开始您的电子技术学习之旅",
        "准备好掌握新知识了吗？",
        "今天的课程很精彩哦！"
      ],
      courses: [
        {
          id: 1,
          title: "电工学",
          description: "涵盖电路理论、电磁场基础、电机与变压器等核心知识，通过实践案例加深对电工基础的理解与应用。",
          icon: "fas fa-bolt"
        },
        {
          id: 2,
          title: "模拟电子技术",
          description: "学习基本放大电路、集成运放、反馈原理和振荡电路等核心内容，通过实验掌握模拟电路分析与设计方法。",
          icon: "fas fa-wave-square"
        },
        {
          id: 3,
          title: "数字电子技术",
          description: "学习逻辑门电路、组合与时序逻辑电路、ADC/DAC转换等关键技术，掌握现代数字系统设计与编程实现方法。",
          icon: "fas fa-microchip"
        }
      ]
    }
  },
  computed: {
    welcomeMessage() {
      const today = new Date().getDay()
      return this.welcomeMessages[today % this.welcomeMessages.length]
    }
  },
  methods: {
    handleCourseSelect(courseName) {
      alert(`您选择了${courseName}课程！`)
    }
  }
}
</script>

<style scoped>
.home-container {
  display: flex;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  margin-left: 240px;
  padding: 20px;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  margin-bottom: 30px;
}

.welcome h2 {
  font-size: 28px;
  font-weight: 600;
  color: #34495e;
}

.user-info {
  display: flex;
  align-items: center;
}

.avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background-color: #3498db;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 18px;
}

.modules-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 25px;
}

.footer {
  margin-top: 50px;
  text-align: center;
  padding: 20px;
  color: #7f8c8d;
  border-top: 1px solid #ecf0f1;
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
    padding-top: 80px;
  }

  .welcome h2 {
    font-size: 22px;
  }
}
</style>
