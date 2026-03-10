/*
 * @Author: Knight
 * @version: 2.0.0
 * @Date: 2026-03-05 17:14:42
 * @LastEditors: Knight
 * @LastEditTime: 2026-03-10 18:35:26
 */
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  base:'/',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    port: 80,
    host: true,
    proxy: {
      '/case-zx-api': {
        target: 'http://dev.zcwapp.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/case-zx-api/, '')
      }
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    chunkSizeWarningLimit: 1000
  }
})
