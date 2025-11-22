import * as THREE from 'three';

export default {
  createScene(container) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth/container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    return { scene, camera, renderer };
  },

  loadModel(scene, path) {
    return new Promise((resolve) => {
      new THREE.GLTFLoader().load(path, (gltf) => {
        scene.add(gltf.scene);
        resolve(gltf.scene);
      });
    });
  },

  // 更多通用方法...
}
