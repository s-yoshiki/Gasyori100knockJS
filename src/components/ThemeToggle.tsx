import { useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'gasyori:theme'

function readStoredTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored === 'light' || stored === 'dark' ? stored : 'system'
}

/**
 * ライト / ダーク / OS 追従を切り替えるボタン。
 *
 * 明示的に選ばれた場合だけ `<html data-theme>` を立てる。
 * 未選択（system）のときは属性を外し、CSS 側の prefers-color-scheme に任せる。
 */
export function ThemeToggle() {
  // クライアント専用のページなので、初期値は localStorage から直接読んでよい
  const [theme, setTheme] = useState<Theme>(readStoredTheme)

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'system') {
      root.removeAttribute('data-theme')
      localStorage.removeItem(STORAGE_KEY)
    } else {
      root.setAttribute('data-theme', theme)
      localStorage.setItem(STORAGE_KEY, theme)
    }
  }, [theme])

  const next: Record<Theme, Theme> = { system: 'light', light: 'dark', dark: 'system' }
  const label: Record<Theme, string> = {
    system: 'テーマ: OS に追従',
    light: 'テーマ: ライト',
    dark: 'テーマ: ダーク',
  }
  const icon: Record<Theme, string> = { system: '◐', light: '☀', dark: '☾' }

  return (
    <button
      type="button"
      className="button button--icon"
      onClick={() => setTheme(next[theme])}
      title={label[theme]}
      aria-label={label[theme]}
    >
      <span aria-hidden="true">{icon[theme]}</span>
    </button>
  )
}
