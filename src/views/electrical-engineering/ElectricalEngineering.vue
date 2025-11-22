<template>
  <div class="course-container">
    <!-- 面包屑导航 -->
    <div class="breadcrumb">
      <span @click="$router.push('/home')">首页</span>
      <i class="fas fa-angle-right"></i>
      <span>电工学</span>
    </div>

    <!-- 页面主体 -->
    <div class="content-container">
      <!-- 左侧导航 -->
      <div class="side-nav">
        <h2 class="course-title">电工学课程目录</h2>
        <div class="nav-menu">
          <div
            v-for="chapter in chapters"
            :key="chapter.id"
            class="nav-item"
            :class="{ active: activeChapter?.id === chapter.id }"
          >
            <div
              class="chapter-header"
              @click="toggleChapter(chapter)"
            >
              <span>{{ chapter.title }}</span>
              <i
                class="fas"
                :class="isChapterOpen(chapter.id) ? 'fa-caret-down' : 'fa-caret-right'"
              ></i>
            </div>

            <!-- 二级导航 - 节（Sections） -->
            <div
              v-if="isChapterOpen(chapter.id)"
              class="subnav-section"
            >
              <div
                v-for="section in chapter.sections"
                :key="section.id"
                class="section-item"
                :class="{ active: activeSection?.id === section.id }"
              >
                <div
                  class="section-header"
                  @click.stop="toggleSection(section)"
                >
                  <span>{{ section.title }}</span>
                  <i
                    class="fas"
                    :class="isSectionOpen(section.id) ? 'fa-caret-down' : 'fa-caret-right'"
                  ></i>
                </div>

                <!-- 三级导航 - 子节（Subsections） -->
                <ul
                  v-if="isSectionOpen(section.id) && section.subsections && section.subsections.length"
                  class="subsection-list"
                >
                  <li
                    v-for="subsection in section.subsections"
                    :key="subsection.id"
                    class="subsection-item"
                    :class="{ active: activeSubsection?.id === subsection.id }"
                    @click.stop="navigateToSubsection(subsection)"
                  >
                    {{ subsection.title }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧内容区域 -->
      <div class="content-main">
        <div class="placeholder">
          <i class="fas fa-book-open"></i>
          <p>请从左侧选择一个子节开始学习</p>
          <p class="placeholder-hint">点击子节将跳转到对应的内容页面</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 子节到 HTML 文件的映射
const subsectionToHtmlMap = {
  // 第1章
  'ss1.1.1': 'Section1_1_1.html',
  'ss1.1.2': 'Section1_1_2.html',
  'ss1.2.1': 'Section1_2_1.html',
  'ss1.2.2': 'Section1_2_2.html',
  'ss1.2.3': 'Section1_2_3.html',
  'ss1.2.4': 'Section1_2_4.html',
  'ss1.7.1': 'Section1_7_1.html',
  'ss1.7.2': 'Section1_7_2.html',

  // 第2章
  'ss2.3.1': 'Section2_3_1.html',

  // 可以继续添加其他子节的映射
};

export default {
  name: 'ElectricalEngineering',
  data() {
    return {
      activeChapter: null,
      activeSection: null,
      activeSubsection: null,

      expandedChapters: {},
      expandedSections: {},

      chapters: [
        {
          id: 'ch1',
          title: '第1章 网络的基本分析方法',
          sections: [
            {
              id: 's1.1',
              title: '1.1 参考方向和参考极性 电流和电压的波形',
              subsections: [
                { id: 'ss1.1.1', title: '1.1.1 参考方向和参考极性' },
                { id: 'ss1.1.2', title: '1.1.2 电流和电压的常见波形' }
              ]
            },
            {
              id: 's1.2',
              title: '1.2 元件的特性方程',
              subsections: [
                { id: 'ss1.2.1', title: '1.2.1 电阻元件的特性方程' },
                { id: 'ss1.2.2', title: '1.2.2 电容元件的特性方程' },
                { id: 'ss1.2.3', title: '1.2.3 电感元件的特性方程' },
                { id: 'ss1.2.4', title: '1.2.4 电压源的特性方程' }
              ]
            },
            {
              id: 's1.3',
              title: '1.3 基尔霍夫定律',
              subsections: [
                { id: 'ss1.3.1', title: '1.3.1 基尔霍夫第一定律' },
                { id: 'ss1.3.2', title: '1.3.2 基尔霍夫第二定律' }
              ]
            },
            {
              id: 's1.4',
              title: '1.4 结点分析法',
              subsections: []
            },
            {
              id: 's1.5',
              title: '1.5 回路分析法',
              subsections: [
                { id: 'ss1.5.1', title: '1.5.1 回路电流' },
                { id: 'ss1.5.2', title: '1.5.2 独立回路及其选取' },
                { id: 'ss1.5.3', title: '1.5.3 建立回路方程的步骤' }
              ]
            },
            {
              id: 's1.6',
              title: '1.6 动态网络分析举例',
              subsections: [
                { id: 'ss1.6.1', title: '*1.6.1 二阶常微分方程解法简介' },
                { id: 'ss1.6.2', title: '**1.6.2 一个典型的实例' }
              ]
            },
            {
              id: 's1.7',
              title: '1.7 有互感的网络',
              subsections: [
                { id: 'ss1.7.1', title: '1.7.1 互感电动势' },
                { id: 'ss1.7.2', title: '1.7.2 互感元件的特性方程' }
              ]
            }
          ]
        },
        {
          id: 'ch2',
          title: '第2章 网络的正弦稳态分析',
          sections: [
            {
              id: 's2.3',
              title: '2.3 示例节',
              subsections: [
                { id: 'ss2.3.1', title: '2.3.1 示例子节' }
              ]
            }
          ]
        },
        {
          id: 'ch3',
          title: '第3章 三相电路',
          sections: []
        },
        {
          id: 'ch4',
          title: '第4章 非正弦周期信号作用下电路的稳态分析',
          sections: []
        },
        {
          id: 'ch5',
          title: '第5章 电路的暂态分析',
          sections: []
        },
        {
          id: 'ch6',
          title: '第6章 二端口网络与网络矩阵',
          sections: []
        },
        {
          id: 'ch7',
          title: '第7章 均匀传输线的正弦稳态分析',
          sections: []
        },
        {
          id: 'ch8',
          title: '第8章 滤波电路',
          sections: []
        },
        {
          id: 'ch9',
          title: '第9章 均匀传输线的暂态分析',
          sections: []
        },
        {
          id: 'ch10',
          title: '第10章 非线性电路',
          sections: []
        }
      ]
    }
  },
  methods: {
    // 切换章节
    toggleChapter(chapter) {
      const isExpanding = !this.expandedChapters[chapter.id];

      // 如果正在展开此章，关闭所有其他章
      if (isExpanding) {
        this.expandedChapters = {};
        this.expandedSections = {};
        this.activeSubsection = null;
      }

      this.expandedChapters[chapter.id] = isExpanding;

      if (isExpanding) {
        this.activeChapter = chapter;
        // 如果展开章节，则安全选中第一个节
        if (chapter.sections && chapter.sections.length > 0) {
          this.toggleSection(chapter.sections[0]);
        }
      } else {
        this.activeChapter = null;
        this.activeSection = null;
      }
    },

    // 检查章是否展开
    isChapterOpen(chapterId) {
      return !!this.expandedChapters[chapterId];
    },

    // 切换节
    toggleSection(section) {
      // 只有在章打开时操作
      if (!this.activeChapter) return;

      const isExpanding = !this.expandedSections[section.id];

      // 如果正在展开此节，安全折叠其他节
      if (isExpanding) {
        // 重置同一章下的所有节状态
        for (const key in this.expandedSections) {
          this.expandedSections[key] = false;
        }
      }

      // 更新当前节状态
      this.expandedSections[section.id] = isExpanding;

      // 安全更新活动节
      if (isExpanding) {
        this.activeSection = section;
        // 清除三级导航选择
        this.activeSubsection = null;
      } else {
        this.activeSection = null;
      }
    },

    // 检查节是否展开
    isSectionOpen(sectionId) {
      return !!this.expandedSections[sectionId];
    },

    // 跳转到子节页面
    navigateToSubsection(subsection) {
      this.activeSubsection = subsection;

      // 获取对应的 HTML 文件
      const htmlFile = subsectionToHtmlMap[subsection.id];
      if (htmlFile) {
        // 跳转到新的页面，使用完整的 URL
        // 假设 HTML 文件放在 public/electrical-engineering/content/ 目录下
        const fullUrl = `${window.location.origin}/electrical-engineering/content/${htmlFile}`;
        window.open(fullUrl, '_blank');
      } else {
        console.warn(`未找到子节 ${subsection.id} 对应的 HTML 文件`);
        alert('该子节内容正在建设中...');
      }
    }
  },
  mounted() {
    // 默认展开第一章
    if (this.chapters.length > 0) {
      const firstChapter = this.chapters[0];
      this.expandedChapters[firstChapter.id] = true;
      this.activeChapter = firstChapter;

      if (firstChapter.sections && firstChapter.sections.length > 0) {
        const firstSection = firstChapter.sections[0];
        this.expandedSections[firstSection.id] = true;
        this.activeSection = firstSection;
      }
    }
  }
}
</script>

<style scoped lang="scss">
.course-container {
  height: 100%;
  display: flex;
  flex-direction: column;

  .breadcrumb {
    padding: 15px 20px;
    background: #f5f7fa;
    border-bottom: 1px solid #e4e7ed;
    display: flex;
    align-items: center;
    font-size: 15px;

    span {
      cursor: pointer;
      color: #606266;

      &:first-child:hover {
        color: #1e90ff;
      }
    }

    i {
      margin: 0 10px;
      color: #c0c4cc;
    }
  }

  .content-container {
    display: flex;
    flex: 1;
    background-color: #ffffff;

    .side-nav {
      width: 320px;
      border-right: 1px solid #e6e6e6;
      padding: 15px 0;
      height: calc(100vh - 120px);
      overflow-y: auto;

      .course-title {
        margin: 10px 20px 15px;
        padding-bottom: 10px;
        border-bottom: 1px solid #eee;
        color: #2c3e50;
        font-size: 18px;
        font-weight: 600;
      }

      .nav-menu {
        padding: 0 5px;

        .nav-item {
          margin-bottom: 2px;
          border-radius: 4px;

          &.active {
            background-color: #f0f7ff;
            border-left: 3px solid #3498db;
          }

          .chapter-header {
            padding: 12px 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
            background-color: #f9f9f9;
            transition: all 0.3s;

            &:hover {
              background-color: #f0f7ff;
            }

            span {
              font-weight: 600;
              color: #2c3e50;
              font-size: 16px;
            }

            i {
              color: #7f8c8d;
            }
          }

          .subnav-section {
            margin-left: 15px;
            border-left: 1px solid #eaecef;

            .section-item {
              padding: 5px 0;

              &.active {
                background-color: #f5f9ff;
                border-left: 2px solid #2980b9;
              }

              .section-header {
                padding: 10px 15px 10px 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                cursor: pointer;
                transition: all 0.3s;
                font-size: 15px;

                &:hover {
                  background-color: #edf4fc;
                }

                span {
                  color: #34495e;
                  font-weight: 500;
                }

                i {
                  font-size: 14px;
                  color: #95a5a6;
                }
              }

              .subsection-list {
                list-style: none;
                margin-left: 15px;
                border-left: 1px dashed #dcdfe6;
                padding: 3px 0;

                .subsection-item {
                  padding: 8px 15px 8px 30px;
                  cursor: pointer;
                  color: #5e6d82;
                  position: relative;
                  transition: all 0.2s;
                  font-size: 14px;

                  &:hover {
                    color: #3498db;
                    background-color: #f0f7ff;
                  }

                  &.active {
                    color: #3498db;
                    font-weight: 500;
                    background-color: #eaf2ff;

                    &::before {
                      content: '';
                      position: absolute;
                      left: 15px;
                      top: 50%;
                      transform: translateY(-50%);
                      width: 6px;
                      height: 6px;
                      background-color: #3498db;
                      border-radius: 50%;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    .content-main {
      flex: 1;
      padding: 0;
      overflow-y: auto;
      background-color: #f9fafc;
      display: flex;
      align-items: center;
      justify-content: center;

      .placeholder {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: #8492a6;
        text-align: center;

        i {
          font-size: 64px;
          margin-bottom: 20px;
          color: #e4e8f1;
        }

        p {
          font-size: 20px;
          margin-bottom: 10px;
        }

        .placeholder-hint {
          font-size: 14px;
          color: #a8b1bd;
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .course-container {
    .content-container {
      flex-direction: column;

      .side-nav {
        width: 100%;
        height: auto;
        max-height: 200px;
      }

      .content-main {
        .placeholder {
          padding: 20px;

          i {
            font-size: 48px;
          }

          p {
            font-size: 18px;
          }
        }
      }
    }
  }
}
</style>
