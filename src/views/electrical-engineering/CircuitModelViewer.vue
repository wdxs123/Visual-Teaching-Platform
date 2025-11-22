<template>
  <div class="circuit-model-container">
    <!-- 3D模型容器 -->
    <div ref="modelContainer" class="h-[500px] w-full rounded-xl shadow-lg"></div>

    <!-- 模型控制面板 -->
    <div class="mt-4 flex space-x-4">
      <button
        @click="switchModel('resistor')"
        :class="{'bg-blue-500 text-white': currentModel === 'resistor'}"
        class="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
      >
        电阻器
      </button>
      <button
        @click="switchModel('capacitor')"
        :class="{'bg-blue-500 text-white': currentModel === 'capacitor'}"
        class="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
      >
        电容器
      </button>
      <button
        @click="switchModel('transistor')"
        :class="{'bg-blue-500 text-white': currentModel === 'transistor'}"
        class="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
      >
        晶体管
      </button>
    </div>
  </div>
</template>

<script>
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default {
  name: 'CircuitModelViewer',
  data() {
    return {
      scene: null,
      camera: null,
      renderer: null,
      controls: null,
      model: null,
      currentModel: 'resistor',
      models: {
        resistor: '@/assets/threejs/models/resistor.glb',
        capacitor: '@/assets/threejs/models/capacitor.glb',
        transistor: '@/assets/threejs/models/transistor.glb'
      }
    };
  },
  mounted() {
    this.initScene();
    this.loadModel(this.models.resistor);
    window.addEventListener('resize', this.handleResize);
  },
  beforeUnmount() {
    this.destroyScene();
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    initScene() {
      // 创建场景
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0xf0f8ff);

      // 创建摄像机
      const container = this.$refs.modelContainer;
      this.camera = new THREE.PerspectiveCamera(
        75,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
      );
      this.camera.position.z = 5;

      // 创建渲染器
      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setSize(container.clientWidth, container.clientHeight);
      this.renderer.setPixelRatio(window.devicePixelRatio);
      container.appendChild(this.renderer.domElement);

      // 添加轨道控制
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;

      // 添加光源
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      this.scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(10, 10, 10);
      this.scene.add(directionalLight);

      // 开始动画循环
      this.animate();
    },

    async loadModel(path) {
      // 移除旧模型
      if (this.model) {
        this.scene.remove(this.model);
        this.model = null;
      }

      const loader = new GLTFLoader();
      try {
        const gltf = await new Promise((resolve, reject) => {
          loader.load(path, resolve, undefined, reject);
        });

        this.model = gltf.scene;
        this.scene.add(this.model);

        // 居中模型并调整大小
        const box = new THREE.Box3().setFromObject(this.model);
        const center = box.getCenter(new THREE.Vector3());
        this.model.position.sub(center);

        const size = box.getSize(new THREE.Vector3()).length();
        this.camera.near = size / 100;
        this.camera.far = size * 100;
        this.camera.updateProjectionMatrix();

        this.camera.position.copy(center);
        this.camera.position.x += size;
        this.camera.position.y += size;
        this.camera.position.z += size;
        this.camera.lookAt(center);

        this.controls.target.copy(center);
        this.controls.update();
      } catch (error) {
        console.error('模型加载失败:', error);
      }
    },

    switchModel(type) {
      this.currentModel = type;
      this.loadModel(this.models[type]);
    },

    animate() {
      requestAnimationFrame(this.animate);
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
    },

    handleResize() {
      const container = this.$refs.modelContainer;
      if (!container) return;

      this.camera.aspect = container.clientWidth / container.clientHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(container.clientWidth, container.clientHeight);
    },

    destroyScene() {
      // 清理资源
      if (this.model) this.scene.remove(this.model);
      if (this.renderer) this.renderer.dispose();
      if (this.controls) this.controls.dispose();
    }
  }
};
</script>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;

.circuit-model-container {
  @apply p-6 bg-white rounded-xl shadow-md my-6;
  border: 1px solid #e2e8f0;
}
.circuit-model-container {
  @apply p-6 bg-white rounded-xl shadow-md my-6;
  border: 1px solid #e2e8f0;
}
</style>
