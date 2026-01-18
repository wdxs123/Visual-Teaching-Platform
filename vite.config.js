import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: 'localhost',
    port: 5173,
    strictPort: true, // 如果端口被占用，直接失败
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 5173
    },
    // 允许跨域
    cors: true,
    // 配置代理（如果需要）
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // 你的后端地址
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true
  }
})
