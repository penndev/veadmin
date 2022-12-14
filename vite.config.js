import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import eslint from 'vite-plugin-eslint'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    eslint({
      fix: true
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      path: 'path-browserify'
    }
  },
  envPrefix: ['VITE', 'VE'],
  base:"",
})
