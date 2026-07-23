import { writeFileSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import type { Plugin } from 'vite'
import { defineConfig } from 'vitest/config'

/**
 * カスタムドメインではルートから配信する。
 * サブパスで配信する場合は BASE_PATH=/path/ を渡す。
 */
const base = process.env.BASE_PATH ?? '/'

/**
 * GitHub Pages 向けの SPA フォールバックを出力する。
 *
 * GitHub Pages はヒストリ API のフォールバックを持たないため、
 * `/questions/38` のようなクリーン URL に直接アクセスすると 404.html が返る。
 *
 * 404.html をそのまま index.html の複製にすると画面は出るが、
 * HTTP ステータスが 404 のままになり検索エンジンに拾われない。
 * そこで 404.html では一度クエリ文字列にパスを畳んで index.html へ飛ばし、
 * index.html 側（`restoreSpaPath`）で元のパスへ戻す。
 * こうすると最終的なレスポンスは 200 になる。
 */
function githubPagesSpaFallback(basePath: string): Plugin {
  // base のセグメント数だけはリダイレクト後も残す（プロジェクトページのリポジトリ名など）
  const segmentsToKeep = basePath.split('/').filter(Boolean).length

  const html = `<!doctype html>
<html lang="ja">
  <head>
    <meta charset="utf-8" />
    <title>画像処理100本ノック JS</title>
    <script>
      // パスをクエリ文字列に畳んで index.html へ飛ばす。
      // 復元は index.html の先頭にあるスクリプトが行う。
      (function () {
        var segmentsToKeep = ${segmentsToKeep}
        var l = window.location
        var prefix = l.pathname
          .split('/')
          .slice(0, 1 + segmentsToKeep)
          .join('/')
        var rest = l.pathname
          .slice(1)
          .split('/')
          .slice(segmentsToKeep)
          .join('/')
          .replace(/&/g, '~and~')
        l.replace(
          l.protocol +
            '//' +
            l.host +
            prefix +
            '/?/' +
            rest +
            (l.search ? '&' + l.search.slice(1) : '') +
            l.hash,
        )
      })()
    </script>
  </head>
  <body></body>
</html>
`

  return {
    name: 'github-pages-spa-fallback',
    apply: 'build',
    closeBundle() {
      writeFileSync('dist/404.html', html)
    },
  }
}

export default defineConfig({
  base,
  plugins: [react(), githubPagesSpaFallback(base)],
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
