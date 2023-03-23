import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8081/',  //你要跨域访问的网址
        changeOrigin: true,   // 允许跨域
      }

    }
  }
  })
