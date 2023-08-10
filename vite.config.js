import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import WindiCSS from 'vite-plugin-windicss'

import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  resolve:{
    alias:{
      "~":path.resolve(__dirname,"src")
    }
  },

  server:{
    proxy:{
      '/api': {
        target: 'http://localhost:8080',
        // secure: false, //https 则开启这行注释
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/manager': {
        target: 'http://localhost:9091',
        // secure: false,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
    },
    host:'0.0.0.0' ,//ip地址
    port: 8080, // 设置服务启动端口号
    open: true // 设置服务启动时是否自动打开浏览器
  },

  plugins: [vue(),WindiCSS()]
})



