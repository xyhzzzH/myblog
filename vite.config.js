import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  base:'./',
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: 'http://47.115.211.83:8081/',  //你要跨域访问的网址
        changeOrigin: true,   // 允许跨域
      }

    }
  }
  })
