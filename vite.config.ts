import { copyFileSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import type { Plugin } from 'vite'
import { defineConfig } from 'vitest/config'

/**
 * GitHub Pages はリポジトリ名がパスの先頭に付く。
 * 独自ドメインやルート配信に切り替える場合は BASE_PATH=/ を渡す。
 */
const base = process.env.BASE_PATH ?? '/Gasyori100knockJS/'

/**
 * GitHub Pages は SPA のヒストリ API フォールバックを持たないため、
 * 未知のパスへ直接アクセスされた際に 404.html が返る性質を利用して
 * index.html の複製を配置する。
 */
function githubPagesSpaFallback(): Plugin {
  return {
    name: 'github-pages-spa-fallback',
    apply: 'build',
    closeBundle() {
      copyFileSync('dist/index.html', 'dist/404.html')
    },
  }
}

export default defineConfig({
  base,
  plugins: [react(), githubPagesSpaFallback()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
  },
})
