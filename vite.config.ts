import path from 'node:path'
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const stylesDir = path.resolve(__dirname, 'src/assets/styles')

/** 全局 partial / 入口：自身已 @use variables，不可再注入，否则重复 @use 报错 */
function skipScssVariableInjection(file: string | undefined): boolean {
  if (!file) return true
  if (file.includes('node_modules')) return true
  if (file.includes(`${path.sep}assets${path.sep}styles${path.sep}`)) return true
  if (file.includes(`${path.sep}assets${path.sep}main.scss`)) return true
  return false
}

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/frontend-interview-vue/' : '/',
  plugins: [
    vue(),
    vueJsx(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    port: 5174,
  },
  css: {
    preprocessorOptions: {
      scss: {
        loadPaths: [stylesDir],
        additionalData(source, file) {
          if (skipScssVariableInjection(file)) return source
          return `@use "variables" as *;\n${source}`
        },
      },
    },
  },
}))
